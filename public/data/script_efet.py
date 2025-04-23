# 2023
# Quadro 4.7. PO01 — Órgãos de Soberania: despesa por medidas do Programa
# Quadro 4.9. PO02 — Governação: despesa por medidas do Programa
# Quadro 4.16. PO03 — Representação Externa: despesa por medidas do Programa
# Quadro 4.18. PO04 — Defesa: despesa por medidas do Programa
# Quadro 4.20. PO05 — Segurança Interna: despesa por medidas do Programa
# Quadro 4.22. PO06 — Justiça: despesa por medidas do Programa
# Quadro 4.24. PO07 — Finanças: despesa por medidas do Programa
# Quadro 4.26. PO08 — Gestão da Dívida Pública: despesa por medidas do Programa
# Quadro 4.29. PO09 — Economia e Mar: despesa por medidas do Programa
# Quadro 4.32. PO10 — Cultura: despesa por medidas do Programa
# Quadro 4.36. PO11 — Ciência, Tecnologia e Ensino Superior: despesa por medidas do Programa
# Quadro 4.46. PO12 — Ensino Básico e Secundário e Administração Escolar: despesa por medidas do Programa
# Quadro 4.48. PO13 — Trabalho, Solidariedade e Segurança Social: despesa por medidas do Programa
# Quadro 4.54. PO14 — Saúde: despesa por medidas do Programa
# Quadro 4.59. PO15 — Ambiente e Ação Climática: despesa por medidas do Programa
# Quadro 4.62. PO16 — Infraestruturas e Habitação: despesa por medidas do Programa
# Quadro 4.66. PO17 — Agricultura e Alimentação: despesa por medidas do Programa

import pandas as pd
import json

# Load the Excel file
year = 2022
excel_path = f"Quadros_{year}.xlsx"

#sheet_name_list = ["Quadro 4.7.", "Quadro 4.9.", "Quadro 4.16.", "Quadro 4.18.", "Quadro 4.20.", "Quadro 4.22.", "Quadro 4.24.", "Quadro 4.26.", "Quadro 4.29.", "Quadro 4.32.", "Quadro 4.36.", "Quadro 4.46.", "Quadro 4.48.", "Quadro 4.54.", "Quadro 4.59.", "Quadro 4.62.", "Quadro 4.66."]

sheet_name_list = {
    2023: ["Quadro 4.7.", "Quadro 4.9.", "Quadro 4.16.", "Quadro 4.18.", "Quadro 4.20.", "Quadro 4.22.", "Quadro 4.24.", "Quadro 4.26.", "Quadro 4.29.", "Quadro 4.32.", "Quadro 4.36.", "Quadro 4.46.", "Quadro 4.48.", "Quadro 4.54.", "Quadro 4.59.", "Quadro 4.62.", "Quadro 4.66."],
    2022: ["Quadro 4.7.", "Quadro 4.9.", "Quadro 4.14.", "Quadro 4.16.", "Quadro 4.21.", "Quadro 4.23.", "Quadro 4.26.", "Quadro 4.28.", "Quadro 4.31.", "Quadro 4.34.", "Quadro 4.38.", "Quadro 4.48.", "Quadro 4.50.", "Quadro 4.56.", "Quadro 4.60.", "Quadro 4.63.", "Quadro 4.67."],
    2021: ["Quadro 141", "Quadro 143", "Quadro 150", "Quadro 154", "Quadro 156", "Quadro 161", "Quadro 163", "Quadro 165", "Quadro 168", "Quadro 172", "Quadro 180", "Quadro 182", "Quadro 188", "Quadro 193", "Quadro 197", "Quadro 201", "Quadro 203"],
    2020: ["Quadro 133", "Quadro 135", "Quadro 142", "Quadro 146", "Quadro 148", "Quadro 150", "Quadro 152", "Quadro 154", "Quadro 156", "Quadro 159", "Quadro 163", "Quadro 169", "Quadro 171", "Quadro 174", "Quadro 182", "Quadro 186", "Quadro 190", "Quadro 192"],
    2019: ["Quadro 125", "Quadro 127", "Quadro 131", "Quadro 133", "Quadro 135", "Quadro 138", "Quadro 140", "Quadro 143", "Quadro 147", "Quadro 153", "Quadro 155", "Quadro 158", "Quadro 165", "Quadro 170", "Quadro 176", "Quadro 179", "Quadro 182"],
    2018: ["Quadro 119", "Quadro 121", "Quadro 126", "Quadro 128", "Quadro 130", "Quadro 132", "Quadro 134", "Quadro 136", "Quadro 139", "Quadro 143", "Quadro 149", "Quadro 151", "Quadro 159", "Quadro 162", "Quadro 167", "Quadro 173", "Quadro 175", "Quadro 178"],
    2017: ["Quadro 122", "Quadro 124", "Quadro 129", "Quadro 131", "Quadro 133", "Quadro 136", "Quadro 138", "Quadro 140", "Quadro 142", "Quadro 145", "Quadro 151", "Quadro 153", "Quadro 160", "Quadro 162", "Quadro 166", "Quadro 170", "Quadro 176", "Quadro 179"],
    2016: ["Quadro 121", "Quadro 123", "Quadro 128", "Quadro 130", "Quadro 134", "Quadro 138", "Quadro 140", "Quadro 142", "Quadro 145", "Quadro 148", "Quadro 150", "Quadro 154", "Quadro 156", "Quadro 160", "Quadro 166", "Quadro 169", "Quadro 172"],
    2015: ["Quadro 124", "Quadro 126", "Quadro 131", "Quadro 135", "Quadro 137", "Quadro 141", "Quadro 143", "Quadro 145", "Quadro 159", "Quadro 161", "Quadro 166", "Quadro 169", "Quadro 171", "Quadro 174"],
    2014: ["Quadro 112", "Quadro 114", "Quadro 120", "Quadro 122", "Quadro 125", "Quadro 128", "Quadro 132", "Quadro 134", "Quadro 149", "Quadro 151", "Quadro 157", "Quadro 160", "Quadro 162", "Quadro 164"],
}

output_path = f"../despesa/{year}.json"


# Read the sheets
dfs = {sheet_name: pd.read_excel(excel_path, sheet_name=sheet_name) for sheet_name in sheet_name_list[year]}

# Dictionary to store the data
all_data = {}

# Print the heads of the dataframes for debugging
for sheet_name, df in dfs.items():
    # Output cell B2 which is the name of title
    title = df.iloc[0, 1]
    # Strip everything from the title before the dash -
    title = title.split("—")[1].strip()
    # Remove : despesa por medidas do Programa
    title = title.split(":")[0].strip()
    # Print the title
    print(f"Title of {sheet_name}: {title}")
    # Remove the first two rows and transform the next one into the header
    df.columns = df.iloc[2]
    df = df[3:]
    # Remove the first column
    df = df.iloc[:, 1:]
    # Reset the index
    df.reset_index(drop=True, inplace=True)
    print(f"Head of {sheet_name}:")
    print(df)
    print("\n")

    # Columns to keep
    keep = ["Estado, SFA e EPR", f"Orçamento Corrigido de {year}", f"Execução de {year}"]

    # Filter the columns
    df = df[keep]

    # Print a JSON with subsector: title, despesa total nao consolidada: value,
    # despesa total consolidada: value, despesa efetiva consolidade: value,
    # subsectors: {subsector: name, orçamento corrigido: value, execucao: value}

    # Get the DESPESA TOTAL NAO CONSOLIDADA
    # Transform the first column into a list
    subsectors = df.iloc[:, 0].tolist()
    orcamento_corrigido = df.iloc[:, 1].tolist()
    execucao = df.iloc[:, 2].tolist()
    # Get the values of the columns
    print(f"Subsectors of {sheet_name}:")
    print(subsectors)
    print(f"Orcamento Corrigido of {sheet_name}:")
    print(orcamento_corrigido)
    print(f"Execucao of {sheet_name}:")
    print(execucao)

    # Find the index of 'DESPESA TOTAL NÃO CONSOLIDADA'
    index = subsectors.index("DESPESA TOTAL NÃO CONSOLIDADA")
    # Get the value of 'DESPESA TOTAL NÃO CONSOLIDADA'
    value_orcamento_corrigido = orcamento_corrigido[index]
    value_execucao = execucao[index]

    # Find the index of 'DESPESA TOTAL CONSOLIDADA'
    index = subsectors.index("DESPESA TOTAL CONSOLIDADA")
    # Get the value of 'DESPESA TOTAL CONSOLIDADA'
    value_orcamento_corrigido_consolidado = orcamento_corrigido[index]
    value_execucao_consolidado = execucao[index]

    # Find the index of 'DESPESA EFETIVA CONSOLIDADA'
    index = subsectors.index("DESPESA EFETIVA CONSOLIDADA")
    # Get the value of 'DESPESA EFETIVA CONSOLIDADA'
    value_orcamento_corrigido_efetiva = orcamento_corrigido[index]
    value_execucao_efetiva = execucao[index]
    # Remove the subsectors from the list
    subsectors = subsectors[:index]
    orcamento_corrigido = orcamento_corrigido[:index]
    execucao = execucao[:index]
    # Create a dictionary with the subsectors
    subsectors_dict = {}
    for i in range(len(subsectors)):
        subsectors_dict[subsectors[i]] = {
            "Orcamento Corrigido": orcamento_corrigido[i],
            "Execucao": execucao[i]
        }
    # Create a dictionary with the title, despesa total nao consolidada, despesa total consolidada, despesa efetiva consolidade
    data = {
        "Despesa Total Nao Consolidada": {
            "Orcamento Corrigido": value_orcamento_corrigido,
            "Execucao": value_execucao
        },
        "Despesa Total Consolidada": {
            "Orcamento Corrigido": value_orcamento_corrigido_consolidado,
            "Execucao": value_execucao_consolidado
        },
        "Despesa Efetiva Consolidada": {
            "Orcamento Corrigido": value_orcamento_corrigido_efetiva,
            "Execucao": value_execucao_efetiva
        },
        "Subsectors": subsectors_dict
    }
    # Print the data
    print(f"Data of {sheet_name}:")
    print(data)
    # Add the data to the dictionary
    all_data[title] = data


# Sum "Despesa Total Nao Consolidada", "Despesa Total Consolidada" and "Despesa Efetiva Consolidada"
# for all the sectors (keys of the dictionary) and store them as a new key, value pair

total_despesa_total_nao_consolidada = 0
total_despesa_total_consolidada = 0
total_despesa_efetiva_consolidada = 0
total_despesa_nao_consolidade_executada = 0
total_despesa_consolidada_executada = 0
total_despesa_efetiva_consolidada_executada = 0

for key, value in all_data.items():
    total_despesa_total_nao_consolidada += value["Despesa Total Nao Consolidada"]["Orcamento Corrigido"]
    total_despesa_total_consolidada += value["Despesa Total Consolidada"]["Orcamento Corrigido"]
    total_despesa_efetiva_consolidada += value["Despesa Efetiva Consolidada"]["Orcamento Corrigido"]
    total_despesa_nao_consolidade_executada += value["Despesa Total Nao Consolidada"]["Execucao"]
    total_despesa_consolidada_executada += value["Despesa Total Consolidada"]["Execucao"]
    total_despesa_efetiva_consolidada_executada += value["Despesa Efetiva Consolidada"]["Execucao"]


# New dictionary with the total values
total_data = {
    "Values" : {
        "Despesa Total Nao Consolidada": {
            "Orcamento Corrigido": total_despesa_total_nao_consolidada,
            "Execucao": total_despesa_nao_consolidade_executada
        },
        "Despesa Total Consolidada": {
            "Orcamento Corrigido": total_despesa_total_consolidada,
            "Execucao": total_despesa_consolidada_executada
        },
        "Despesa Efetiva Consolidada": {
            "Orcamento Corrigido": total_despesa_efetiva_consolidada,
            "Execucao": total_despesa_efetiva_consolidada_executada
        }
    },
    
    "sectors": all_data
}


# Print the data
print(f"All data:")
print(total_data)

# Save the data to a JSON file
with open(output_path, "w") as f:
    json.dump(total_data, f, indent=4)
print(f"Data saved to {output_path}")


