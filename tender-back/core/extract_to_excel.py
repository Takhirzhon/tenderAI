from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def format_excel(ws):
    header_font = Font(bold=True, size=11)
    header_alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border = Border(left=Side(style='thin'), right=Side(style='thin'),
                         top=Side(style='thin'), bottom=Side(style='thin'))

    col_widths = [40, 30, 15, 15, 20, 25, 40, 15, 50, 30, 40, 20, 20, 30]
    columns = [
    "Назва тендеру",
    "Замовник",
    "Кінцевий термін подачі",
    "Очікуваний бюджет (грн)",
    "Локація проєкту",
    "Тип проєкту",
    "Необхідні документи",
    "Потрібен АВК-5",
    "Технічні вимоги",
    "Умови оплати",
    "Ресурси та матеріали",
    "Реалістичність строків",
    "Оцінка рентабельності",
    "Назва файлу"
]


    
    for col_num, (column_title, width) in enumerate(zip(columns, col_widths), 1):
        cell = ws.cell(row=1, column=col_num, value=column_title)
        cell.font = header_font
        cell.alignment = header_alignment
        cell.border = thin_border
        ws.column_dimensions[get_column_letter(col_num)].width = width
    return ws, columns