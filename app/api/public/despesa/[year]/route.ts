import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface RouteParams {
  params: {
    year: string;
  };
}

export async function GET(_: Request, { params }: RouteParams) {
  const { year } = params;
  
  try {
    // Read the data from the JSON file
    const filePath = path.join(process.cwd(), "public", "despesa", `${year}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const budgetData = JSON.parse(fileData);
    
    // Format the response
    const formattedData = {
      totalValues: budgetData.Values,
      sectors: budgetData.sectors
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(`Error reading expense data for year ${year}:`, error);
    return NextResponse.json(
      { error: `Failed to load expense data for year ${year}` }, 
      { status: 404 }
    );
  }
}