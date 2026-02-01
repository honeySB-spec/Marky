import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Log the configuration to the server logs
    console.log(`[Debug] Checking connection to: ${backendUrl}`);

    try {
        // Try to hit the backend health endpoint
        // Note: We need to ensure the backend URL has the protocol
        const target = backendUrl.startsWith('http') ? backendUrl : `http://${backendUrl}`;

        const startTime = Date.now();
        const response = await fetch(`${target}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Fast timeout for debugging
            signal: AbortSignal.timeout(5000),
        });
        const duration = Date.now() - startTime;

        const data = await response.json().catch(() => null);
        const text = !data ? await response.text().catch(() => 'No body') : null;

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            backendUrl: target, // Returning this so we can see what Render set it to
            duration: `${duration}ms`,
            response: data || text,
            envVarSet: !!process.env.BACKEND_URL
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
            backendUrl: process.env.BACKEND_URL || 'http://localhost:8000 (default)',
            envVarSet: !!process.env.BACKEND_URL
        }, { status: 500 });
    }
}
