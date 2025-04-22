import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const startYear = Number(url.searchParams.get('startYear') || 2018);
    const endYear = Number(url.searchParams.get('endYear') || 2023);
    
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
    
    const balanceData: Record<string, any> = {};
    
    for (const year of years) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'balanco', `${year}.json`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        balanceData[year] = JSON.parse(fileContent);
      } catch (err) {
        console.error(`Error reading balance data for ${year}:`, err);
        // Skip this year if file doesn't exist or is invalid
      }
    }
    
    return NextResponse.json(balanceData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance data' },
      { status: 500 }
    );
  }
}