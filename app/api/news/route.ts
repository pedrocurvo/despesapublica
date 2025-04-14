import { NextResponse } from "next/server"

// Mock news data
const newsData = {
  2023: [
    {
      id: 1,
      title: "Government Approves 2023 Budget with Focus on Education",
      date: "2022-12-15",
      source: "Diário de Notícias",
      summary:
        "The Portuguese government has approved the 2023 budget with a significant increase in education funding, aiming to improve school infrastructure and teacher salaries.",
      url: "#",
    },
    {
      id: 2,
      title: "Healthcare Spending Exceeds Budget Allocation for Third Year",
      date: "2023-03-22",
      source: "Público",
      summary:
        "For the third consecutive year, healthcare expenditure has exceeded the allocated budget, raising concerns about financial sustainability in the sector.",
      url: "#",
    },
    {
      id: 3,
      title: "Defense Budget Increases Amid European Security Concerns",
      date: "2023-05-10",
      source: "Expresso",
      summary:
        "Portugal has increased its defense budget by 4.2% compared to the previous year, citing growing security concerns in Europe and NATO commitments.",
      url: "#",
    },
    {
      id: 4,
      title: "Budget Execution Report Shows 98% Utilization Rate",
      date: "2023-07-05",
      source: "Jornal de Negócios",
      summary:
        "The latest budget execution report indicates a 98% utilization rate across all sectors, with education and healthcare showing the highest execution rates.",
      url: "#",
    },
    {
      id: 5,
      title: "Finance Minister Announces Mid-Year Budget Adjustments",
      date: "2023-06-30",
      source: "Observador",
      summary:
        "The Finance Minister has announced minor adjustments to the 2023 budget to address unexpected economic challenges and inflation pressures.",
      url: "#",
    },
  ],
  2022: [
    {
      id: 1,
      title: "Parliament Approves 2022 Budget After Political Deadlock",
      date: "2021-12-10",
      source: "Público",
      summary:
        "After weeks of negotiation, the Portuguese Parliament has finally approved the 2022 budget, avoiding a potential political crisis.",
      url: "#",
    },
    {
      id: 2,
      title: "Infrastructure Projects Get Major Boost in 2022 Budget",
      date: "2022-01-15",
      source: "Diário de Notícias",
      summary:
        "The 2022 budget allocates €5.2 billion to infrastructure projects, with a focus on transportation and digital infrastructure development.",
      url: "#",
    },
    {
      id: 3,
      title: "Budget Deficit Lower Than Expected in First Quarter",
      date: "2022-04-20",
      source: "Expresso",
      summary:
        "The budget deficit for the first quarter of 2022 was lower than expected, indicating positive economic recovery signs.",
      url: "#",
    },
    {
      id: 4,
      title: "Government Announces Additional Funding for Healthcare System",
      date: "2022-05-12",
      source: "Jornal de Negócios",
      summary:
        "In response to ongoing healthcare challenges, the government has announced an additional €500 million in funding for the national healthcare system.",
      url: "#",
    },
  ],
  2021: [
    {
      id: 1,
      title: "2021 Budget Focuses on Pandemic Recovery",
      date: "2020-12-18",
      source: "Diário de Notícias",
      summary:
        "The 2021 budget prioritizes economic recovery from the COVID-19 pandemic, with significant allocations to healthcare and business support.",
      url: "#",
    },
    {
      id: 2,
      title: "EU Recovery Funds Integrated into National Budget",
      date: "2021-02-10",
      source: "Público",
      summary:
        "Portugal has successfully integrated EU recovery funds into its national budget, with plans to use the funds for digital transformation and green initiatives.",
      url: "#",
    },
    {
      id: 3,
      title: "Budget Execution Shows Impact of Pandemic Measures",
      date: "2021-07-15",
      source: "Expresso",
      summary:
        "The mid-year budget execution report highlights the significant impact of pandemic-related measures on public finances.",
      url: "#",
    },
  ],
  2020: [
    {
      id: 1,
      title: "Emergency Budget Revision Approved Due to Pandemic",
      date: "2020-03-25",
      source: "Público",
      summary:
        "Parliament has approved an emergency revision to the 2020 budget to address the immediate needs arising from the COVID-19 pandemic.",
      url: "#",
    },
    {
      id: 2,
      title: "Healthcare Budget Doubled in Emergency Measure",
      date: "2020-04-10",
      source: "Diário de Notícias",
      summary:
        "The government has doubled the healthcare budget allocation as an emergency measure to combat the COVID-19 crisis.",
      url: "#",
    },
  ],
  2019: [
    {
      id: 1,
      title: "2019 Budget Approved with Focus on Public Services",
      date: "2018-12-20",
      source: "Expresso",
      summary:
        "The 2019 budget has been approved with a strong focus on improving public services, particularly in education and healthcare.",
      url: "#",
    },
    {
      id: 2,
      title: "Budget Surplus Achieved for First Time in Democratic History",
      date: "2019-06-30",
      source: "Jornal de Negócios",
      summary:
        "Portugal has achieved a budget surplus for the first time in its democratic history, marking a significant economic milestone.",
      url: "#",
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")) : null

  // Return news for a specific year
  if (year) {
    const yearData = newsData[year]
    if (yearData) {
      if (limit && limit > 0) {
        return NextResponse.json(yearData.slice(0, limit))
      }
      return NextResponse.json(yearData)
    }
    return NextResponse.json({ error: "Year not found" }, { status: 404 })
  }

  // Return all news data if no year specified, but ensure unique IDs
  // by adding the year as a prefix to the id property
  const allNews = Object.entries(newsData).flatMap(([year, articles]) => 
    articles.map(article => ({
      ...article,
      uniqueId: `${year}-${article.id}` // Add a uniqueId property that combines year and id
    }))
  );
  
  // Sort by date (descending) to get the most recent news first
  allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (limit && limit > 0) {
    return NextResponse.json(allNews.slice(0, limit))
  }

  return NextResponse.json(allNews)
}
