# backend/main.py
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import os
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from dotenv import load_dotenv
load_dotenv()

# Configure Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("Error: GEMINI_API_KEY not found in environment variables")
    client = None
else:
    try:
        client = genai.Client(api_key=api_key)
        logger.info("Gemini Client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {e}")
        client = None

@app.get("/health")
def health_check():
    return {"status": "ok", "python_version": os.sys.version}

def get_important_sentences(full_text):
    """Sends text to Gemini and asks for the most important distinct sentences."""
    if not client:
        logger.error("Gemini client is not initialized.")
        return []

    prompt = f"""
    Read the following text. Identify the 5-10 most important sentences or key concepts that a student should highlight for revision.
    Return ONLY the exact sentences from the text, separated by a new line. Do not rewrite them.
    
    Text:
    {full_text[:30000]} 
    """ 

    try:
        # Use a model that definitely exists
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        
        if not response.text:
             logger.warning("Gemini returned empty response.")
             return []
        return response.text.strip().split('\n')
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        traceback.print_exc()
        return []

@app.post("/highlight-pdf")
async def highlight_pdf(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file upload: {file.filename}")
        
        # 1. Read the uploaded PDF file
        try:
            pdf_data = await file.read()
            logger.info(f"Read {len(pdf_data)} bytes")
            doc = fitz.open(stream=pdf_data, filetype="pdf")
            logger.info(f"Opened PDF with {len(doc)} pages")
        except Exception as e:
            logger.error(f"Failed to open PDF: {e}")
            return JSONResponse(status_code=400, content={"error": "Invalid PDF file", "details": str(e)})

        # 2. Extract text to send to AI
        full_text = ""
        for page in doc:
            full_text += page.get_text()

        if not full_text.strip():
            logger.warning("No text found in PDF. It might be a scanned image.")
            # Return original PDF if no text found, but maybe warn?
            return Response(content=pdf_data, media_type="application/pdf")

        # 3. Get important phrases from AI
        logger.info("Sending text to Gemini...")
        important_lines = get_important_sentences(full_text)
        logger.info(f"Gemini returned {len(important_lines)} lines")

        # 4. Highlight lines in the PDF
        count = 0
        for page in doc:
            for line in important_lines:
                line = line.strip()
                if len(line) < 5: continue # Skip empty/short noise
                
                # search_for returns a list of rectangles (coordinates) where the text appears
                quads = page.search_for(line) 
                
                # Add a highlight annotation for each occurrence
                for quad in quads:
                    annot = page.add_highlight_annot(quad)
                    annot.update()
                    count += 1

        logger.info(f"Highlighted {count} instances.")

        # 5. Save and return the modified PDF
        output_pdf = doc.tobytes()
        return Response(content=output_pdf, media_type="application/pdf")

    except Exception as e:
        logger.critical(f"Unhandled error in /highlight-pdf: {e}")
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": "Internal Server Error", "details": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)