import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || "2023"; // Default to 2023 if no year is provided
  const sector = searchParams.get("sector");
  
  try {
    // Read the data from the JSON file
    const filePath = path.join(process.cwd(), "public", "despesa", `${year}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const budgetData = JSON.parse(fileData);
    
    // Return specific sector data if requested
    if (sector) {
      if (!budgetData.sectors[sector]) {
        return NextResponse.json({ error: "Sector not found" }, { status: 404 });
      }
      return NextResponse.json({
        sector: sector,
        data: budgetData.sectors[sector]
      });
    }
    
    // Process data to format it for the chart
    const formattedData = {
      sectors: {},
      totalValues: budgetData.Values
    };
    
    // Extract the required data for each sector
    Object.keys(budgetData.sectors).forEach(sectorName => {
      const sectorData = budgetData.sectors[sectorName];
      formattedData.sectors[sectorName] = {
        "Despesa Total Nao Consolidada": sectorData["Despesa Total Nao Consolidada"],
        "Despesa Total Consolidada": sectorData["Despesa Total Consolidada"],
        "Despesa Efetiva Consolidada": sectorData["Despesa Efetiva Consolidada"],
        "Subsectors": {}
      };
      
      // Format subsector data if available
      if (sectorData.Subsectors) {
        const subsectors = {};
        Object.keys(sectorData.Subsectors).forEach(subsectorName => {
          // Skip the DESPESA TOTAL entries which are totals 
          if (
            subsectorName !== "DESPESA TOTAL NÃO CONSOLIDADA" && 
            subsectorName !== "DESPESA TOTAL CONSOLIDADA"
          ) {
            subsectors[subsectorName] = sectorData.Subsectors[subsectorName];
          }
        });
        formattedData.sectors[sectorName]["Subsectors"] = subsectors;
      }
    });
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error reading budget data:", error);
    return NextResponse.json(
      { error: "Failed to load budget data" }, 
      { status: 500 }
    );
  }
}