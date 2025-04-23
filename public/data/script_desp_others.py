import pandas as pd
import json

# Load the Excel file
year = 2013
#excel_path = f"Quadros_{year}.xlsx"
excel_path = f"Quadros_{year}.xls"
#sheet_name_list = ["Quadro 2.1."]

sheet_name_list = {
    2023: ["Quadro 2.1."],
    2022: ["Quadro 2.1."],
    2021: ["Quadro 21"],
    2020: ["Quadro 20"],
    2019: ["Quadro 20"],
    2018: ["Quadro 19"],
    2017: ["Quadro 20"],
    2016: ["Quadro 20"],
    2015: ["Quadro 69"],
    2014: ["Quadro 21"],
    2013: ["Quadro 17"],
    }

output_path = f"../balanco/{year}.json"

# Read the sheets
dfs = {sheet_name: pd.read_excel(excel_path, sheet_name=sheet_name) for sheet_name in sheet_name_list[year]}

# Dictionary to store the data
all_data = {}

# Print the heads of the dataframes for debugging
for sheet_name, df in dfs.items():
    # Output cell B2 which is the name of title
    #title = df.iloc[0, 0]
    # Strip everything from the title before the dash -
    #title = title.split("—")[0].strip()
    # Remove : despesa por medidas do Programa
    #title = title.split(":")[0].strip()
    # Print the title
    #print(f"Title of {sheet_name}: {title}")
    # Remove the first two rows and transform the next one into the header
    df.columns = df.iloc[2]
    df = df[2:]
    # Remove the first column
    #df = df.iloc[:, 1:]

    # Keep columns 0, 4
    df = df.iloc[:, [0, 4]]

    # Keep rows 11, 18
    df = df.iloc[[0, 21, 25, 26, 27]]

    # First row is the header
    df.columns = df.iloc[0]
    df = df[1:]


    # Rename first column to Name
    df.rename(columns={df.columns[0]: "Name"}, inplace=True)

    # Reset the index
    df.reset_index(drop=True, inplace=True)
    print(f"Head of {sheet_name}:")
    print(df)
    print("\n")

    # Iterate over the rows and create a dictionary
    print(df.columns)
    for index, row in df.iterrows():
        # Create a dictionary for each row
        if "Total da Receita" in row["Name"]:
            row_dict = {
                    "Receita": {
                        "Year": row["Administrações Públicas"]
                    }
                }
        elif "Total da Despesa" in row["Name"]:
            row_dict = {
                    "Despesa": {
                        "Year": row["Administrações Públicas"]
                    }
                }
        elif "percentagem do PIB" in row["Name"]:
            row_dict = {
                    "PIBper": {
                      "Year": row["Administrações Públicas"]
                    }
                }
        elif "Capac" in row["Name"]:
            row_dict = {
                    "Saldo": {
                        "Year": row["Administrações Públicas"]
                    }
                }
        else:
            row_dict = {
                row["Name"]: {
                    "Year": row["Administrações Públicas"]
                }
            }
        # Add the dictionary to the all_data dictionary
        all_data.update(row_dict)
        # Print the dictionary
        print(row_dict)

# Save the data to a JSON file
with open(output_path, "w") as f:
    json.dump(all_data, f, indent=4)


