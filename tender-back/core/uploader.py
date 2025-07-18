import os
import json
from typing import Dict, Any

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../uploaded")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def handle_uploaded_tender(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Save uploaded tender file and return metadata.
    Supports .json and .pdf files.

    Args:
        file_bytes: Raw bytes of the uploaded file
        filename: Name of the uploaded file (e.g. tender123.json)

    Returns:
        Dictionary with analysis info or status
    """
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save the file
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Handle JSON file (parse & return metadata)
    if filename.endswith(".json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            tender_id = os.path.splitext(filename)[0]
            return {
                "status": "success",
                "source": "json",
                "tender": {
                    "id": tender_id,
                    "title": data.get("title", "Без назви"),
                    "date": data.get("dateModified", ""),
                    "budget": data.get("value", {}).get("amount", 0),
                    "file": filename
                }
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"❌ Failed to parse JSON: {e}"
            }

    elif filename.endswith(".pdf") or filename.endswith(".docx"):
        return {
            "status": "success",
            "source": "file",
            "message": f"📄 {filename} uploaded. PDF/DOCX analysis coming soon.",
            "file": filename
        }

    else:
        return {
            "status": "error",
            "message": "❌ Unsupported file type"
        }
