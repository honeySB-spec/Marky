# backend/main.py
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

def get_important_sentences(full_text):
    """Sends text to LLM and asks for the most important distinct sentences."""
    prompt = f"""
    Read the following text. Identify the 5-10 most important sentences or key concepts that a student should highlight for revision.
    Return ONLY the exact sentences from the text, separated by a new line. Do not rewrite them.
    
    Text:
    {full_text[:10000]} 
    """ 
    # Note: We limit text to 10k chars for this demo to save tokens.
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.split('\n')

@app.post("/highlight-pdf")
async def highlight_pdf(file: UploadFile = File(...)):
    # 1. Read the uploaded PDF file
    pdf_data = await file.read()
    doc = fitz.open(stream=pdf_data, filetype="pdf")
    
    # 2. Extract text to send to AI
    full_text = ""
    for page in doc:
        full_text += page.get_text()

    # 3. Get important phrases from AI
    important_lines = get_important_sentences(full_text)
    print("AI selected lines:", important_lines)

    # 4. Highlight lines in the PDF
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

    # 5. Save and return the modified PDF
    output_pdf = doc.tobytes()
    return Response(content=output_pdf, media_type="application/pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)