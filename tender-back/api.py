
from pydantic import BaseModel
from core.claude_text_extractor import build_tender_text, ask_claude, format_excel as format_excel_claude, save_to_excel
from core.downloader import setup_environment, download_prozorro_tenders
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.uploader import handle_uploaded_tender


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

class AnalyzeTenderRequest(BaseModel):
    text: str

class TextRequest(BaseModel):
    text: str

class BudgetRequest(BaseModel):
    budget_raw: str



app.get("/")
def root():
    return {"message": "TenderAI API is running"}

@app.post("/download_prozorro_tenders")
def download_endpoint(request: DownloadTendersRequest):
    try:
        tenders = download_prozorro_tenders(
            topic=request.topic,
            total_to_download=request.total_to_download,
            days_back=request.days_back
        )
        return {"count": len(tenders), "tenders": tenders}
    except Exception as e:
        print("❌ Error in download_endpoint:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload_tender")
async def upload_tender(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename or "uploaded_file"
    result = handle_uploaded_tender(contents, filename)
    return result


