"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner"; // <--- Import from sonner

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first"); // <--- Error Toast
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/highlight-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Processing failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);

      toast.success("PDF highlighted successfully!"); // <--- Success Toast

    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze PDF. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            AI Note Highlighter
          </h1>
          <p className="text-slate-500">
            Upload your notes and let AI mark the most important concepts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing & Highlighting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {pdfUrl && (
          <Card className="h-[800px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Highlighted Result
              </CardTitle>
              <a href={pdfUrl} download={`highlighted_${file?.name}`}>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </a>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden bg-slate-100">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}