import os
import fitz
import pandas as pd
import pathlib

TENDER_DIR = "C:/Users/tashmatov/tender/uploaded/"
TEXT_DIR = "C:/Users/tashmatov/tender/extracted/"
os.makedirs(TEXT_DIR, exist_ok=True)


def extract_text_from_pdf(input_pdf) -> str:
    """
    Extracts text from a PDF file using PyMuPDF (fitz).
    Accepts either file path (str) or bytes.
    """
    if isinstance(input_pdf, str):
        if not os.path.exists(input_pdf):
            raise FileNotFoundError(f"❌ PDF not found at: {input_pdf}")
        doc = fitz.open(input_pdf)
        filename = os.path.basename(input_pdf).replace(".pdf", ".txt")
    else:
        # Assume it's bytes
        doc = fitz.open(stream=input_pdf, filetype="pdf")
        filename = "extracted_from_bytes.txt"

    full_text = ""
    for page_num, page in enumerate(doc):  # type: ignore
        text = page.get_text("text")
        print(f"Page {page_num+1} text:\n{text}")
        full_text += text + "\n"

    txt_path = os.path.join(TEXT_DIR, filename)
    pathlib.Path(txt_path).write_text(full_text, encoding="utf-8")

    return full_text.strip()
