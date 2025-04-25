import pandas as pd
import json

# === Definições de entrada/saída ===
year = 2
excel_path = f"Quadros_{year}.xls"
output_path = f"../despesa_atual/{year}.json"

# Quadros - Despesa por medidas do Programa
sheet_name_list_azuis = {
    2023: ["Quadro 4.7.", "Quadro 4.9.", "Quadro 4.16.", "Quadro 4.18.", "Quadro 4.20.", "Quadro 4.22.", "Quadro 4.24.", "Quadro 4.26.", "Quadro 4.29.", "Quadro 4.32.", "Quadro 4.36.", "Quadro 4.46.", "Quadro 4.48.", "Quadro 4.54.", "Quadro 4.59.", "Quadro 4.62.", "Quadro 4.66."],
    2022: ["Quadro 4.7.", "Quadro 4.9.", "Quadro 4.14.", "Quadro 4.16.", "Quadro 4.21.", "Quadro 4.23.", "Quadro 4.26.", "Quadro 4.28.", "Quadro 4.31.", "Quadro 4.34.", "Quadro 4.38.", "Quadro 4.48.", "Quadro 4.50.", "Quadro 4.56.", "Quadro 4.60.", "Quadro 4.63.", "Quadro 4.67."],
    2021: ["Quadro 141", "Quadro 143", "Quadro 150", "Quadro 154", "Quadro 156","Quadro 158", "Quadro 161", "Quadro 163", "Quadro 165", "Quadro 168", "Quadro 172", "Quadro 180", "Quadro 182", "Quadro 188", "Quadro 193", "Quadro 197", "Quadro 201", "Quadro 203"],
    2020: ["Quadro 133", "Quadro 135", "Quadro 142", "Quadro 146", "Quadro 148", "Quadro 150", "Quadro 152", "Quadro 154", "Quadro 156", "Quadro 159", "Quadro 163", "Quadro 169", "Quadro 171", "Quadro 174", "Quadro 182", "Quadro 186", "Quadro 190", "Quadro 192"],
    2019: ["Quadro 125", "Quadro 127", "Quadro 131", "Quadro 133", "Quadro 135", "Quadro 138", "Quadro 140", "Quadro 143", "Quadro 147", "Quadro 153", "Quadro 155 ", "Quadro 158", "Quadro 165 ", "Quadro 170", "Quadro 176", "Quadro 179 ", "Quadro 182"],
    2018: ["Quadro 119", "Quadro 121", "Quadro 126", "Quadro 128", "Quadro 130", "Quadro 132", "Quadro 134", "Quadro 136", "Quadro 139", "Quadro 143", "Quadro 149", "Quadro 151", "Quadro 159  ", "Quadro 162 ", "Quadro 167 ", "Quadro 173 ", "Quadro 175 ", "Quadro 178 "],
    2017: ["Quadro 122", "Quadro 124", "Quadro 129", "Quadro 131", "Quadro 133", "Quadro 136", "Quadro 138", "Quadro 140", "Quadro 142", "Quadro 145", "Quadro 151", "Quadro 153", "Quadro 160 ", "Quadro 162 ", "Quadro 166 ", "Quadro 170", "Quadro 176", "Quadro 179 "],
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

def limpar_valor(valor):
    if isinstance(valor, str):
        # Remove espaços normais e não separáveis, e troca vírgula por ponto
        valor_limpo = valor.replace('\xa0', '').replace(' ', '').replace(' ', '').replace(',', '.')
        try:
            return float(valor_limpo)
        except ValueError:
            return 0.0
    elif isinstance(valor, (int, float)):
        return float(valor)
    else:
        return 0.0



# === Função para extrair medidas por setor (quadros azuis) ===
def extrair_medidas_por_programa(sheet_names, path_excel):
    medidas_por_programa = {}
    for sheet in sheet_names:
        print(sheet)
        try:
            df = pd.read_excel(path_excel, sheet_name=sheet, header=0)
            medidas = {}

            inicio_leitura = False
            for i in range(len(df)):
                linha_atual = str(df.iloc[i, 1]).strip()
                

                # Ativa a leitura após encontrar a linha-chave
                if not inicio_leitura and "Estado, SFA e EPR" in linha_atual:
                    inicio_leitura = True
                    continue  # Ir para a próxima linha

                if inicio_leitura:
                    if "DESPESA TOTAL CONSOLIDADA" in linha_atual.upper():
                        break  # Parar a leitura ao encontrar essa linha

                    if pd.notna(linha_atual) and linha_atual.lower() != "sub-total":
                        """valor_raw = df.iloc[i, 3] if pd.notna(df.iloc[i, 3]) else 0
                        print(valor_raw)
                        valor_limpo = limpar_valor(valor_raw)
                        medidas[linha_atual] = valor_limpo"""
                        print(f"linha {i}, valor bruto: {repr(df.iloc[i, 3])}")
                        # 4 NO CASDO DO 2016
                        valor_raw = df.iloc[i, 3]
                        valor = limpar_valor(valor_raw)
                        medidas[linha_atual] = valor

                        """valor = df.iloc[i, 3] if pd.notna(df.iloc[i, 3]) else 0
                        print(valor)
                        medidas[linha_atual] = valor"""

            medidas_por_programa[sheet] = medidas
        except Exception as e:
            print(f"Erro ao processar {sheet}: {e}")
    return medidas_por_programa


# === Função para extrair dados do quadro laranja ===
def extrair_programas_orcamentais(df_laranja, medidas_programas):
    programas = {}
    indice_medidas = 5  # Novo índice para medidas

    for i in range(3, 23):  # Linhas 6 a 22 (0-indexed)
        nome_setor = str(df_laranja.iloc[i, 1]).strip()
        print(nome_setor)
        if pd.notna(nome_setor) and nome_setor.lower() != "sub-total":
            try:
                orcamentada = float(df_laranja.iloc[i, 4])
                executada = float(df_laranja.iloc[i, 7])
                percentagem_execucao = float(df_laranja.iloc[i, 8])

              
                if nome_setor== "005 - Gestão da Dívida Pública":
                    print("NETRA")
                # Se o setor tiver medidas, associa as medidas
                
                    programas[nome_setor] = {
                        "despesa_orcamentada": orcamentada,
                        "despesa_executada_efetiva_consolidada": executada,
                        "despesa_executada_total_nao_consolidada": None,
                        "grau_execução": percentagem_execucao,
                        "medidas":  None,
                    }

                else:
                    print(i)
                    # Se o setor tiver medidas, associa as medidas
                    quadro_azul = list(medidas_programas.values())[indice_medidas - 5] if indice_medidas - 5 < len(medidas_programas) else {}
                    indice_medidas += 1 
                    medidas_finais  = {k: v for k, v in quadro_azul.items() if k != "DESPESA TOTAL NÃO CONSOLIDADA"}
                
                    programas[nome_setor] = {
                        "despesa_orcamentada": orcamentada,
                        "despesa_executada_efetiva_consolidada": executada,
                        "despesa_executada_total_nao_consolidada": quadro_azul["DESPESA TOTAL NÃO CONSOLIDADA"],
                        "grau_execução": percentagem_execucao,
                        "medidas":  medidas_finais,
                    }
 
            except Exception as e:
                print(f"Erro no setor {nome_setor}: {e} {i}")
                continue
    return programas


# === Script principal ===
def processar_excel(path_excel, ano, path_output):
    output = {}

    quadro_laranja = sheet_name_list_laranjas[ano][0]
    quadros_azuis = sheet_name_list_azuis[ano]

    df_laranja = pd.read_excel(path_excel, sheet_name=quadro_laranja, header=0)
    medidas_programas = extrair_medidas_por_programa(quadros_azuis, path_excel)
    programas_orcamentais = extrair_programas_orcamentais(df_laranja, medidas_programas)

    output[ano] = {
        "despesa_orcamentada": float(df_laranja.iloc[23, 4]),
        "despesa_executada_efetiva_consolidada": float(df_laranja.iloc[23, 7]),
        "grau_execução": float(df_laranja.iloc[23, 8]),
        "setores": programas_orcamentais
    }

    with open(path_output, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


# === Executar ===
processar_excel(excel_path, year, output_path)
