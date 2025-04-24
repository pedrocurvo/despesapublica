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


# === Definições de entrada/saída ===
year = 2023
excel_path = f"Quadros_{year}.xlsx"
output_path = f"../despesa_atual/{year}.json"

# Quadros - Despesa por medidas do Programa
sheet_name_list_azuis = {
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

# Quadro - Despesa consolidada da Administração Central por Programa Orçamental
sheet_name_list_laranjas = {
    2023: ["Quadro 4.1."],
    2022: ["Quadro 4.1."],
    2021: ["Quadro 135"],
    2020: ["Quadro 128"],
    2019: ["Quadro 120"],
    2018: ["Quadro 114"],
    2017: ["Quadro 111"],
    2016: ["Quadro 110"],
    2015: ["Quadro 114"],
    2014: ["Quadro 100"],
    2013: ["Quadro 116"],
}


# === Função para extrair dados dos quadros laranja ===
def extrair_programas_orcamentais(df):
    programas = {}
    for i in range(4, 21):  # Linhas 6 a 22 (0-indexed)
        nome = str(df.iloc[i, 1]).strip()  # Nome do setor da coluna 
        if pd.notna(nome) and nome != "Sub-Total":
            try:
                # Corrigindo a conversão de string para float
                orcamentada = float(df.iloc[i, 4])  # Despesa orçamentada (coluna 5)
                executada = float(df.iloc[i, 7])  # Despesa executada (coluna 8)
                percentagem_execucao = float(df.iloc[i, 8]) # Percentagem de execução (coluna 9)
                programas[nome] = {
                    "despesa_orcamentada": orcamentada,
                    "despesa_executada": executada,
                    "grau_execução": percentagem_execucao,
                    "medidas": {}
                }
            except Exception as e:
                continue
    return programas


# === Script principal ===
def processar_excel(path_excel, ano, path_output):
    output = {}

    # === Processar Quadro Laranja (programas orçamentais) ===
    quadro_laranja = sheet_name_list_laranjas[ano]
    df_laranja = pd.read_excel(path_excel, sheet_name=quadro_laranja[0], header=0)
    programas_orcamentais = extrair_programas_orcamentais(df_laranja)
    
    output[ano] = {
        "despesa_orcamentada": float(str(df_laranja.iloc[23, 4]).replace(".", "").replace(",", ".")),  # Exemplo: valor da célula E25
        "despesa_executada": float(str(df_laranja.iloc[23, 7]).replace(".", "").replace(",", ".")),  # Exemplo: valor da célula H25
        "setores": programas_orcamentais  # Adiciona os setores extraídos
    }

   

    # === Guardar JSON ===
    with open(path_output, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


# === Executar ===
processar_excel(excel_path, year, output_path)
