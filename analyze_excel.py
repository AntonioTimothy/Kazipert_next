import pandas as pd
import os

file_path = 'Kazipert Salary Calculator.xlsx'

try:
    # Read all sheets
    xls = pd.ExcelFile(file_path)
    print(f"Sheets found: {xls.sheet_names}")

    for sheet_name in xls.sheet_names:
        print(f"\n--- Sheet: {sheet_name} ---")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        print(df.head(20))
        print("\nColumns:", df.columns.tolist())
        
except Exception as e:
    print(f"Error reading Excel file: {e}")
