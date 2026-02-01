import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Use the internal backend URL if available, otherwise localhost
    // Note: On Render, we might construct the URL from a service variable
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Ensure protocol is present
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
        backendUrl = `http://${backendUrl}`;
    }

    try {
        const formData = await req.formData();

        // Forward the request to the Python backend
        const response = await fetch(`${backendUrl}/highlight-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error("Backend error:", response.status, response.statusText);
            return NextResponse.json(
                { error: 'Backend processing failed' },
                { status: response.status }
            );
        }

        // Get the PDF blob from the backend
        const pdfBlob = await response.blob();

        // Return the PDF to the client
        return new NextResponse(pdfBlob, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="highlighted.pdf"',
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error processing PDF' },
            { status: 500 }
        );
    }
}
