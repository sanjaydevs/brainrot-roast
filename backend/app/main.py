from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.services.gemini_service import extract_screen_time

load_dotenv()

app = FastAPI(title="Brain rot Roaster API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",],
    allow_methods=['POST','GET'],
    allow_headers=["*"]
)

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_screenshot(file:UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Upload Jpeg, Png or Webp image"
        )
    
    image_bytes = await file.read(MAX_FILE_SIZE + 1)
    
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The file is empty.")

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 10 MB.",
        )
    try:
        extracted_data = extract_screen_time(
            image_bytes=image_bytes,
            mime_type=file.content_type,
        )

        return extracted_data.model_dump()

    except Exception as exc:
        print(f"Gemini analysis error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Screenshot analysis failed. Check the backend terminal.",
        ) from exc
        