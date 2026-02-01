# backend/main.py
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import os

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from dotenv import load_dotenv
import os

load_dotenv()

# Configure Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in environment variables")
    
client = genai.Client(api_key=api_key)

def get_important_sentences(full_text):
    """Sends text to Gemini and asks for the most important distinct sentences."""
    
    prompt = f"""
    Read the following text. Identify the 5-10 most important sentences or key concepts that a student should highlight for revision.
    Return ONLY the exact sentences from the text, separated by a new line. Do not rewrite them.
    
    Text:
    {full_text[:30000]} 
    """ 
    # Gemini 1.5 Flash has a huge context window, so we can send more text (30k chars) safely.

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        # The new SDK returns a GenerateContentResponse object. 
        # Accessing .text is similar, but let's be safe.
        if not response.text:
             return []
        return response.text.strip().split('\n')
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return []

@app.post("/highlight-pdf")
async def highlight_pdf(file: UploadFile = File(...)):
    # 1. Read the uploaded PDF file
    pdf_data = await file.read()
    doc = fitz.open(stream=pdf_data, filetype="pdf")
    
    # 2. Extract text to send to AI
    full_text = ""
    for page in doc:
        full_text += page.get_text()

    if not full_text.strip():
        print("Warning: No text found in PDF. It might be a scanned image.")
        return Response(content=pdf_data, media_type="application/pdf")

    # 3. Get important phrases from AI
    print("Sending text to Gemini...")
    important_lines = get_important_sentences(full_text)
    print("Gemini selected lines:", important_lines)

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
                # Optional: Set color (Yellow is default, but here is Green for reference)
                # annot.set_colors(stroke=(0.5, 1, 0.5)) 
                annot.update()
                count += 1

    print(f"Highlighted {count} instances.")

    # 5. Save and return the modified PDF
    output_pdf = doc.tobytes()
    return Response(content=output_pdf, media_type="application/pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)