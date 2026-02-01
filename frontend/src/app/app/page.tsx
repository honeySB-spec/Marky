"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload } from "lucide-react";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPdfUrl(null); // Reset previous analysis
        }
    };

    const handleStartAnalysis = async () => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        setLoading(true);
        setPdfUrl(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/highlight", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = "Analysis failed";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.details || errorData.error || `Server Error: ${response.status}`;
                } catch (e) {
                    errorMessage = `Analysis failed: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create object URL for display
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);

            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Error analyzing PDF:", error);
            toast.error(error instanceof Error ? error.message : "Failed to analyze PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50 border-b border-border bg-background backdrop-blur-sm text-foreground">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
                <div className="text-xl font-bold tracking-tighter absolute left-1/2 -translate-x-1/2">MARK.Y</div>
                <div className="w-[100px]" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12 w-full max-w-7xl mx-auto">

                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">New Analysis</h1>
                    <p className="text-muted-foreground text-lg">
                        Upload a PDF to get started with AI highlighting.
                    </p>
                </div>

                {/* Upload Box */}
                <div className="w-full max-w-2xl border-2 border-primary p-8 bg-background relative mb-12">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Upload Document</h2>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="w-full h-12 px-4 py-2 border-2 border-black bg-white text-sm flex items-center file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                                // Custom styles to match the mock which looks like a simple box
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            />
                            {/* Overlay for custom styling if needed, but native input might be enough for now. 
                   The mock shows "Choose File No file chosen" inside a box. 
               */}
                        </div>

                        <Button
                            onClick={handleStartAnalysis}
                            disabled={loading}
                            className="w-full h-14 bg-neutral-500 hover:bg-neutral-600 text-white rounded-none flex items-center justify-center gap-2 text-base font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5" />
                                    Start Analysis
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* PDF Previewer */}
                {pdfUrl && (
                    <div className="w-full h-[800px] border-2 border-border shadow-lg animate-in fade-in duration-500">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="Highlighted PDF"
                        />
                    </div>
                )}

            </main>

            {/* Footer Logo */}
            <div className="fixed bottom-8 left-8">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">N</div>
            </div>
        </div>
    );
}
