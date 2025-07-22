# FAST API
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse


# CORE
from core.analyze_tender import analyze_tender
from core.extract_to_excel import generate_excel_from_result
from core.downloader import download_prozorro_tenders
from core.claude_client import get_claude_client
from core.data_extractor import extract_text_from_pdf
from core.analyze_link import analyze_tender_from_hash
from core.uploader import handle_uploaded_tender
from core.company_profile import CompanyProfile
from core.generate_template import generate_filled_template


# Libraries
from pydantic import BaseModel
import tempfile
import shutil
import json
import os
from typing import List, Dict, Any


app = FastAPI(title="AI Tender Optimizer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LinkRequest(BaseModel):
    link: str


class DownloadTendersRequest(BaseModel):
    topic: str
    total_to_download: int = 10
    days_back: int = 30


class EstimateRequest(BaseModel):
    materials: dict
    labor: dict
    equipment: dict


class ComplianceRequest(BaseModel):
    required_docs: list[str]


class ProfitabilityRequest(BaseModel):
    tender_data: dict
    company_resources: dict


class TenderHashRequest(BaseModel):
    tender_hash: str


class TextRequest(BaseModel):
    text: str


class BudgetRequest(BaseModel):
    budget_raw: str

class TemplateRequest(BaseModel):
    template_name: str
    values: dict


app.get("/")


def root():
    return {"message": "TenderAI API is running"}


@app.post("/download_prozorro_tenders")
def download_endpoint(request: DownloadTendersRequest):
    try:
        tenders = download_prozorro_tenders(
            topic=request.topic,
            total_to_download=request.total_to_download,
            days_back=request.days_back,
        )
        return {"count": len(tenders), "tenders": tenders}
    except Exception as e:
        print("❌ Error in download_endpoint:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload_tenders")
async def upload_tenders(files: List[UploadFile] = File(...)):
    # 1) enforce max 5
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Максимум 5 файлов за раз.")

    all_results: List[Dict[str, Any]] = []

    for file in files:
        contents = await file.read()
        filename = file.filename or "untitled"

        # 2) first save + metadata via your existing function
        meta = handle_uploaded_tender(contents, filename)
        if meta.get("status") != "success":
            all_results.append(meta)
            continue

        # 3) if it was JSON, we’re done
        if filename.lower().endswith(".json"):
            all_results.append(meta)
            continue

        # 4) for PDFs/DOCXs → write temp, extract, analyze
        suffix = os.path.splitext(filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            text = extract_text_from_pdf(tmp_path)
            client = get_claude_client()
            analysis = analyze_tender(text, client)
            all_results.append(
                {"status": "success", "source": filename, "analysis": analysis}
            )
        except Exception as e:
            all_results.append(
                {"status": "error", "source": filename, "message": str(e)}
            )

    return {"status": "success", "files": all_results}


def merge_single_tender(raw: list[dict]) -> dict:
    """
    raw: [
      {"status": "...", "source": "...", "analysis": {...}},
      {"status": "...", "source": "...", "analysis": {...}},
      ...
    ]
    Returns one merged dict of all analysis fields + 'filename'.
    """
    analyses = [item["analysis"] for item in raw]
    merged: dict = {}

    # list of all keys we expect in analysis
    keys = analyses[0].keys()

    for key in keys:
        vals = [a.get(key) for a in analyses]
        example = vals[0]

        if isinstance(example, list):
            # union of all lists
            merged[key] = list({v for sub in vals for v in sub})
        elif isinstance(example, bool):
            # true if any file said true
            merged[key] = any(vals)
        else:
            # pick first non‑“не вказано” or non‑empty
            picked = next(
                (
                    v
                    for v in vals
                    if isinstance(v, str)
                    and v.strip()
                    and not v.lower().startswith("не вказано")
                ),
                None,
            )
            merged[key] = picked if picked is not None else vals[0]

    # join all source filenames
    merged["filename"] = "; ".join(item["source"] for item in raw)
    return merged


@app.post("/download_excel")
async def download_excel(request: Request):
    try:
        payload = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    # If user sent the array of raw results, merge into one dict
    if isinstance(payload, list) and payload and "analysis" in payload[0]:
        data_to_write = merge_single_tender(payload)
    else:
        data_to_write = payload  # already a single merged object

    # Generate Excel (this function takes either dict or list of dict)
    stream = generate_excel_from_result(data_to_write, filename="analyzed_tender.xlsx")
    headers = {"Content-Disposition": 'attachment; filename="analyzed_tender.xlsx"'}
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )


@app.post("/analyze_tender")
def analyze_tender_endpoint(request: TenderHashRequest):
    try:
        result = analyze_tender_from_hash(request.tender_hash)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_company_profile")
def get_company_profile():
    profile = CompanyProfile()
    return profile.get_profile()


@app.post("/update_company_profile")
async def update_company_profile(request: Request):
    data = await request.json()
    profile = CompanyProfile()
    profile.update_profile(data)
    return {"status": "ok"}

@app.post("/generate_template")
async def generate_template(request: TemplateRequest):
    buffer = generate_filled_template(request.template_name, request.values)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={request.template_name}_filled.docx"}
    )