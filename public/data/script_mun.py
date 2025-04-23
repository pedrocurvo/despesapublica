import pandas as pd
import json

# Load the Excel file

"""sheet_name = {
    2023: ["Mapa 12"],
    2022: ["Mapa 12"],
    2021: ["Mapa 12"],
    2020: ["Mapa XIX"],
    2019: ["Mapa XIX"],
    2018: ["Mapa XIX"],
    2017: ["Mapa XIX"],
    2016: ["Mapa XIX"],
    2015: ["Mapa XIX"],
}"""

year = 2015
sheet_name = "Mapa XIX"
#excel_path = f"Mapas_{year}.xlsx"
excel_path = f"Mapas_{year}.xls"

#output_path = f"municipal_transfers_{year}.json"
output_path = f"../municipality_transfers/{year}.json"

# Read the sheet
df = pd.read_excel(excel_path, sheet_name=sheet_name)

# Store the second-to-last row as the national total before removing it
#country_total_row = df.iloc[-2]
country_total_row = df.iloc[-4]
country_total = country_total_row.iloc[-1] if pd.notna(country_total_row.iloc[-1]) else None

# Remove the last two rows
#df = df[:-2]
df = df[:-4]

# Output structure
districts = []
current_district = None
current_block = {}

for i, row in df.iterrows():
    #first_col = str(row.iloc[1]).strip()
    first_col = str(row.iloc[0]).strip()
    total_value = row.iloc[8]
    #total_value = row.iloc[11]

    if pd.isna(first_col) or first_col == "nan":
        continue

    # Detect district headers
    if (
        "(distrito)" in first_col.lower()
        or "madeira" == first_col.lower()
        or "açores" in first_col.lower()
    ):
        if current_block:
            districts.append(current_block)
        current_district = first_col.replace("(distrito)", "").strip()
        current_block = {
            "District": current_district,
            "Total": None,
            "Municipalities": {}
        }
        continue

    # Handle TOTAL line for the district
    if first_col.lower().startswith("total"):
        if current_block:
            try:
                current_block["Total"] = float(total_value)
            except (ValueError, TypeError):
                current_block["Total"] = None
        continue

    # If no district yet, skip
    if not current_block or "Municipalities" not in current_block:
        continue

    # Add municipality
    try:
        value = float(total_value)
        current_block["Municipalities"][first_col] = value
    except (ValueError, TypeError):
        continue

# Append final district block
if current_block:
    districts.append(current_block)

# Wrap with country-level info
final_output = {
    "Country": "Portugal",
    "Year": year,
    "Total": float(country_total) if pd.notna(country_total) else None,
    "Districts": districts
}

# Export to JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"JSON saved to {output_path}")