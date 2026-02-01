import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Use the internal backend URL if available, otherwise localhost
    // Note: On Render, we might construct the URL from a service variable
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Ensure protocol is present
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
        backendUrl = `http://${backendUrl}`;
    }

    console.log(`[Proxy] Forwarding request to backend: ${backendUrl}/highlight-pdf`);

    try {
        const formData = await req.formData();

        // Forward the request to the Python backend
        const response = await fetch(`${backendUrl}/highlight-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Backend returned error: ${response.status} ${response.statusText}`);
            console.error(`[Proxy] Backend response body: ${errorText}`);
            return NextResponse.json(
                { error: `Backend processing failed: ${response.status}`, details: errorText },
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
        console.error('[Proxy] Critical error:', error);
        return NextResponse.json(
            { error: 'Internal server error processing PDF', details: String(error) },
            { status: 500 }
        );
    }
}
