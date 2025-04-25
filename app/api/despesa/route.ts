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
    if (sector && budgetData[year]?.setores[sector]) {
      return NextResponse.json({
        [year]: {
          sector: sector,
          ...budgetData[year].setores[sector]
        }
      });
    }
    
    // Just return the whole data structure as it already has the correct format
    return NextResponse.json(budgetData);
    
  } catch (error) {
    console.error("Error reading budget data:", error);
    return NextResponse.json(
      { error: "Failed to load budget data" }, 
      { status: 500 }
    );
  }
}