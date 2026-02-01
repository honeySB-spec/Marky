import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-dot-grid">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50 bg-background backdrop-blur-sm border-b border-border">
        <div className="text-xl font-bold tracking-tighter">MARK.Y</div>
        <Button asChild size="default" className="text-sm px-6 h-10 rounded-md font-medium">
          <Link href="/app">
            Launch App
          </Link>
        </Button>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 uppercase max-w-6xl">
            Highlight Smarter <br /> Not Harder.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed mb-12">
            Stop wasting time scanning through endless pages. upload your notes and let our AI identify exactly what matters most. Instant. Accurate. Minimal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="text-base px-8 h-14 rounded-none border border-primary font-medium group">
              <Link href="/app">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 h-14 rounded-none border-primary font-medium hover:bg-primary hover:text-primary-foreground">
              <Link href="/demo">
                View Demo
              </Link>
            </Button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border w-full">
            {/* Feature 01 */}
            <div className="p-12 md:p-16 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1">01</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Instant Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your PDF and get results in seconds. Our optimized engine handles large documents with ease.
                </p>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="p-12 md:p-16 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1">02</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Smart Context</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don't just match keywords. We understand context to highlight concepts that are actually important.
                </p>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="p-12 md:p-16 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1">03</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Export Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download your highlighted documents immediately. Compatible with all standard PDF readers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs font-medium uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-[10px]">N</div>
          <span>© 2024 MARKY. All rights reserved.</span>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="#" className="hover:underline">Privacy</Link>
          <Link href="#" className="hover:underline">Terms</Link>
          <Link href="#" className="hover:underline">Twitter</Link>
        </div>
      </footer>
    </div>
  );
}
