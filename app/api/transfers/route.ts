import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Get the year from the request query parameters
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || '2023';
  const level = searchParams.get('level') || 'district'; // district or municipality

  try {
    // Construct the file path to the JSON data
    const filePath = path.join(process.cwd(), 'public', 'municipality_transfers', `${year}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `No data available for year ${year}` },
        { status: 404 }
      );
    }
    
    // Read and parse the JSON file
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Calculate national percentage for each district
    const enhancedData = {
      ...data,
      Districts: data.Districts.map((district: any) => {
        const nationalPercentage = (district.Total / data.Total) * 100;
        
        return {
          ...district,
          NationalPercentage: nationalPercentage.toString()
        };
      })
    };
    
    // If level is municipality, return all data including municipalities
    // Otherwise, just return district-level data
    if (level === 'municipality') {
      return NextResponse.json(enhancedData);
    } else {
      // Create a simplified version with just district data
      const districtData = {
        Country: enhancedData.Country,
        Year: enhancedData.Year,
        Total: enhancedData.Total,
        Districts: enhancedData.Districts.map((district: any) => ({
          District: district.District,
          Total: district.Total,
          NationalPercentage: district.NationalPercentage
        }))
      };
      
      return NextResponse.json(districtData);
    }
  } catch (error) {
    console.error('Error processing transfer data:', error);
    return NextResponse.json(
      { error: 'Error processing transfer data' },
      { status: 500 }
    );
  }
}