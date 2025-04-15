import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

const ARQUIVO_PT_URL = 'http://arquivo.pt/textsearch';
const DATETIME_FORMAT = 'yyyyMMddHHmmss';

function multipleReplace(str: string): string {
    const replacements: Record<string, string> = {
      'Ã¡': 'á', 'Ã ': 'à', 'Ã£': 'ã', 'Ã¢': 'â', 'Ã': 'Á',
      'Ã©': 'é', 'Ãª': 'ê', 'Ã¨': 'è',
      'Ã³': 'ó', 'Ãµ': 'õ', 'Ã´': 'ô',
      'Ãº': 'ú', 'Ã': 'Ú', 'Ã¼': 'ü',
      'Ã§': 'ç', 'Ã¢': 'â', 'Ã“': 'Ó',
      'Ã­': 'í', 'Ã“': 'Ó', 'Ã‰': 'É',
      'Ã“': 'Ó', 'Ã‘': 'Ñ', 'Ãº': 'ú',
      'Ã¨': 'è', 'Ã™': 'Ù', 'Ã„': 'Ä',
      'Ã–': 'Ö', 'Ã¤': 'ä', 'Ã¶': 'ö',
      'ÃŸ': 'ß', 'Ã¡': 'á', 'Ã³': 'ó',
      'Â': '', 'Ã§': 'ç', 'Ã´': 'ô', 'Ã­': 'í',
      // Removes lingering malformed characters
    };
  
    const regex = new RegExp(Object.keys(replacements).join('|'), 'g');
    return str.replace(regex, match => replacements[match] || match);
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}

function cleanTitle(title: string): string {
  title = title.replace(/\xad|\u00ad/g, '');

  const regexBeg = /^([\"\w\s\/']+)(-|—|\||>|:)\s/;
  const regexEnd = /(-|—|\||>|\/)\s([\(\w\.\,\s\-\/\&\')]+)$/;

  const matchBeg = title.match(regexBeg);
  if (matchBeg) title = matchBeg[1];

  let matchEnd = title.match(regexEnd);
  while (matchEnd) {
    title = title.replace(matchEnd[0], '');
    matchEnd = title.match(regexEnd);
  }

  return title.trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('query');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const domains = searchParams.getAll('domain');

  if (!query || !from || !to || domains.length === 0) {
    return NextResponse.json({ error: 'Missing query, from, to, or domain parameters' }, { status: 400 });
  }

  const formattedFrom = formatDate(new Date(from));
  const formattedTo = formatDate(new Date(to));
  const siteSearch = domains.map(url => parse(url).host).join(',');

  const params = new URLSearchParams({
    q: query,
    from: formattedFrom,
    to: formattedTo,
    siteSearch,
    maxItems: '1000',
    dedupValue: '250',
    type: 'html',
    fields: 'originalURL,title,tstamp,encoding,linkToArchive'
  });

  const res = await fetch(`${ARQUIVO_PT_URL}?${params}`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json({ error: 'Arquivo.pt request failed' }, { status: 500 });
  }

  const data = await res.json();

  const headlines = (data.response_items || []).map((item: any) => {
    const date = item.tstamp;
    if (date < formattedFrom || date > formattedTo) return null;

    let title = item.title;
    title = multipleReplace(title);
    title = cleanTitle(title);

    return {
      headline: title,
      datetime: new Date(
        `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}T${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`
      ),
      domain: parse(item.originalURL).host,
      url: item.linkToArchive
    };
  }).filter(Boolean);

  return NextResponse.json({ results: headlines });
}