import { NextResponse } from "next/server"
import { districtData } from "@/lib/district-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const district = searchParams.get("district")

  // Return specific district data for a year
  if (year && district) {
    const yearData = districtData[year]
    if (yearData) {
      const districtInfo = yearData.find((d) => d.id === district)
      if (districtInfo) {
        return NextResponse.json(districtInfo)
      }
    }
    return NextResponse.json({ error: "Year or district not found" }, { status: 404 })
  }

  // Return all districts for a specific year
  if (year && !district) {
    const yearData = districtData[year]
    if (yearData) {
      return NextResponse.json(yearData)
    }
    return NextResponse.json({ error: "Year not found" }, { status: 404 })
  }

  // Return all data if no parameters
  return NextResponse.json(districtData)
}
