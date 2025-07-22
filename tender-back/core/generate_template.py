from docx import Document
from io import BytesIO
from typing import Dict

TEMPLATE_FOLDER = "../templates"

def generate_filled_template(template_filename: str, values: Dict[str, str]) -> BytesIO:
    path = f"{TEMPLATE_FOLDER}/{template_filename}.docx"
    doc = Document(path)

    for p in doc.paragraphs:
        for key, val in values.items():
            if f"<{key}>" in p.text:
                p.text = p.text.replace(f"<{key}>", val)

    # Replace placeholders in tables too (optional)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for key, val in values.items():
                    if f"<{key}>" in cell.text:
                        cell.text = cell.text.replace(f"<{key}>", val)

    output = BytesIO()
    doc.save(output)
    output.seek(0)
    return output
