from docx import Document
from io import BytesIO
from typing import Dict
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FOLDER = os.path.join(BASE_DIR, "../templates")


def generate_filled_template(template_filename: str, values: Dict[str, str]) -> BytesIO:
    path = os.path.join(TEMPLATE_FOLDER, f"{template_filename}.docx")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Template not found: {path}")

    doc = Document(path)

    for p in doc.paragraphs:
        for key, val in values.items():
            for run in p.runs:
                if f"<{key}>" in run.text:
                    run.text = run.text.replace(f"<{key}>", val)


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

