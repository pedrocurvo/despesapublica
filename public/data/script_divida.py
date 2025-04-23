import pandas as pd
import json

# Load the Excel file
year = 2013
excel_path = f"Quadros_{year}.xls"

sheet_name_list = {
    2023: ["Quadro 2.7."],
    2022: ["Quadro 2.7."],
    2021: ["Quadro 91"],
    2020: ["Quadro 85"],
    2019: ["Quadro 84"],
    2018: ["Quadro 81"],
    2017: ["Quadro 82"],
    2016: ["Quadro 78"],
    2015: ["Quadro 90"],
    2014: ["Quadro 83"],
    2013: ["Quadro 96"],
}

output_path = f"../divida/{year}.json"

# Read the sheets
dfs = {sheet_name: pd.read_excel(excel_path, sheet_name=sheet_name) for sheet_name in sheet_name_list[year]}

all_data = {}

for sheet_name, df in dfs.items():
    print(f"Processing sheet: {sheet_name}")

    # Ajuste inicial: headers e corte
    df.columns = df.iloc[2]
    df = df[3:]  # Remove header rows

    # Seleciona colunas de interesse (assumindo que a 2ª e 6ª colunas são as relevantes)
    df = df.iloc[:, [0, 4]]

    # Filtra as primeiras 3 linhas (ajuste conforme necessário)
    df = df.iloc[:2]

    # Renomeia colunas
    df.columns = ["Name", "Value"]
    df.reset_index(drop=True, inplace=True)

    print("📄 Preview do DataFrame:")
    print(df)
    print("\n")

    for _, row in df.iterrows():
        name = str(row["Name"]).strip()
        value = row["Value"]

        # Criar estrutura adequada
        if "Maastricht" in name:
            row_dict = {
                "Divida em milhões de euros": value
            }
        elif "% PIB" in name:
            row_dict = {
                "Divida em %PIB": value
            }
        else:
            row_dict = {
                name: {
                    "Year": value
                }
            }

        # Atualiza o dicionário principal
        all_data.update(row_dict)
        print("📌 Linha adicionada:", row_dict)

# Salvar para JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_data, f, indent=4, ensure_ascii=False)

print(f"\n✅ JSON salvo em: {output_path}")
