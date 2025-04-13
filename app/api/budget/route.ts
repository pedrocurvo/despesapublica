import { NextResponse } from "next/server"

// Mock budget data
const budgetData = {
  years: {
    2018: {
      total: {
        proposed: 84.6,
        expended: 83.1,
      },
      sectors: {
        education: {
          proposed: 6.8,
          expended: 6.7,
        },
        healthcare: {
          proposed: 6.1,
          expended: 6.3,
        },
        "social-security": {
          proposed: 5.5,
          expended: 5.6,
        },
        infrastructure: {
          proposed: 4.2,
          expended: 4.1,
        },
        defense: {
          proposed: 2.0,
          expended: 1.9,
        },
        justice: {
          proposed: 1.5,
          expended: 1.5,
        },
        environment: {
          proposed: 1.2,
          expended: 1.1,
        },
        culture: {
          proposed: 0.8,
          expended: 0.7,
        },
        other: {
          proposed: 56.5,
          expended: 55.2,
        },
      },
    },
    2019: {
      total: {
        proposed: 86.2,
        expended: 85.4,
      },
      sectors: {
        education: {
          proposed: 7.0,
          expended: 6.9,
        },
        healthcare: {
          proposed: 6.3,
          expended: 6.5,
        },
        "social-security": {
          proposed: 5.7,
          expended: 5.8,
        },
        infrastructure: {
          proposed: 4.4,
          expended: 4.3,
        },
        defense: {
          proposed: 2.1,
          expended: 2.0,
        },
        justice: {
          proposed: 1.6,
          expended: 1.6,
        },
        environment: {
          proposed: 1.3,
          expended: 1.2,
        },
        culture: {
          proposed: 0.9,
          expended: 0.8,
        },
        other: {
          proposed: 56.9,
          expended: 56.3,
        },
      },
    },
    2020: {
      total: {
        proposed: 87.5,
        expended: 89.2,
      },
      sectors: {
        education: {
          proposed: 7.2,
          expended: 7.0,
        },
        healthcare: {
          proposed: 6.9,
          expended: 7.8,
        },
        "social-security": {
          proposed: 6.0,
          expended: 6.5,
        },
        infrastructure: {
          proposed: 4.5,
          expended: 4.4,
        },
        defense: {
          proposed: 2.2,
          expended: 2.1,
        },
        justice: {
          proposed: 1.7,
          expended: 1.6,
        },
        environment: {
          proposed: 1.4,
          expended: 1.3,
        },
        culture: {
          proposed: 0.9,
          expended: 0.7,
        },
        other: {
          proposed: 56.7,
          expended: 57.8,
        },
      },
    },
    2021: {
      total: {
        proposed: 89.8,
        expended: 90.1,
      },
      sectors: {
        education: {
          proposed: 7.5,
          expended: 7.4,
        },
        healthcare: {
          proposed: 7.1,
          expended: 7.5,
        },
        "social-security": {
          proposed: 6.2,
          expended: 6.4,
        },
        infrastructure: {
          proposed: 4.7,
          expended: 4.6,
        },
        defense: {
          proposed: 2.3,
          expended: 2.2,
        },
        justice: {
          proposed: 1.8,
          expended: 1.7,
        },
        environment: {
          proposed: 1.5,
          expended: 1.4,
        },
        culture: {
          proposed: 1.0,
          expended: 0.9,
        },
        other: {
          proposed: 57.7,
          expended: 58.0,
        },
      },
    },
    2022: {
      total: {
        proposed: 91.3,
        expended: 90.5,
      },
      sectors: {
        education: {
          proposed: 7.9,
          expended: 7.7,
        },
        healthcare: {
          proposed: 7.2,
          expended: 7.3,
        },
        "social-security": {
          proposed: 6.5,
          expended: 6.4,
        },
        infrastructure: {
          proposed: 5.0,
          expended: 4.8,
        },
        defense: {
          proposed: 2.4,
          expended: 2.3,
        },
        justice: {
          proposed: 1.9,
          expended: 1.8,
        },
        environment: {
          proposed: 1.6,
          expended: 1.5,
        },
        culture: {
          proposed: 1.1,
          expended: 1.0,
        },
        other: {
          proposed: 57.7,
          expended: 57.7,
        },
      },
    },
    2023: {
      total: {
        proposed: 93.4,
        expended: 91.7,
      },
      sectors: {
        education: {
          proposed: 8.2,
          expended: 7.9,
        },
        healthcare: {
          proposed: 7.4,
          expended: 7.8,
        },
        "social-security": {
          proposed: 6.8,
          expended: 6.7,
        },
        infrastructure: {
          proposed: 5.2,
          expended: 5.0,
        },
        defense: {
          proposed: 2.5,
          expended: 2.4,
        },
        justice: {
          proposed: 2.0,
          expended: 1.9,
        },
        environment: {
          proposed: 1.7,
          expended: 1.6,
        },
        culture: {
          proposed: 1.2,
          expended: 1.1,
        },
        other: {
          proposed: 58.4,
          expended: 57.3,
        },
      },
    },
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const sector = searchParams.get("sector")
  const startYear = searchParams.get("startYear")
  const endYear = searchParams.get("endYear")

  // Return specific year data
  if (year && !sector) {
    const yearData = budgetData.years[year]
    if (yearData) {
      return NextResponse.json(yearData)
    }
    return NextResponse.json({ error: "Year not found" }, { status: 404 })
  }

  // Return specific sector data for a year
  if (year && sector) {
    const yearData = budgetData.years[year]
    if (yearData && yearData.sectors[sector]) {
      return NextResponse.json(yearData.sectors[sector])
    }
    return NextResponse.json({ error: "Year or sector not found" }, { status: 404 })
  }

  // Return data for a range of years
  if (startYear && endYear) {
    const start = Number.parseInt(startYear)
    const end = Number.parseInt(endYear)
    const rangeData = {}

    for (let i = start; i <= end; i++) {
      const yearStr = i.toString()
      if (budgetData.years[yearStr]) {
        rangeData[yearStr] = budgetData.years[yearStr]
      }
    }

    if (Object.keys(rangeData).length > 0) {
      return NextResponse.json(rangeData)
    }
    return NextResponse.json({ error: "No data found for the specified range" }, { status: 404 })
  }

  // Return all data if no parameters
  return NextResponse.json(budgetData)
}
