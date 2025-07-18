import os
import fitz
import pandas as pd
import pathlib

TENDER_DIR = "C:/Users/tashmatov/tender/uploaded/"
TEXT_DIR = "C:/Users/tashmatov/tender/extracted/"
os.makedirs(TEXT_DIR, exist_ok=True)


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file using PyMuPDF (fitz).
    Returns the full text as a string.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"❌ PDF not found at: {pdf_path}")

    full_text = ""
    with fitz.open(pdf_path) as doc:
        for page_num, page in enumerate(doc): # type: ignore
            text = page.get_text("text")
            print(f"Page {page_num+1} text:\n{text}")
            full_text += text + "\n"

    filename = os.path.basename(pdf_path).replace(".pdf", ".txt")
    txt_path = os.path.join(TEXT_DIR, filename)
    pathlib.Path(txt_path).write_text(full_text, encoding="utf-8")

    return full_text.strip()
