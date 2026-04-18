'use client';

import { useState, useEffect } from 'react';
import { Download, Printer, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface QrDownloadProps {
  compositeUrl: string;
  onDone: () => void;
}

export function QrDownload({ compositeUrl, onDone }: QrDownloadProps) {
  const [qrPattern, setQrPattern] = useState<boolean[]>([]);

  useEffect(() => {
    // Generate stable pattern on client to avoid hydration mismatch
    setQrPattern(Array.from({ length: 25 }, () => Math.random() > 0.5));
  }, []);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `PHOTORNZ-${Date.now()}.png`;
    link.href = compositeUrl;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><body style="margin:0;display:flex;justify-content:center;background:white;"><img src="${compositeUrl}" style="max-height:100vh;"></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center p-20 animate-in fade-in slide-in-from-bottom-20 duration-1000">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        
        {/* Visual Preview */}
        <div className="relative aspect-[4/5] bg-zinc-50 shadow-2xl border border-black/5 overflow-hidden">
           <Image src={compositeUrl} alt="Final Composite" fill className="object-contain" />
        </div>

        {/* Smart Features Tray */}
        <div className="space-y-16">
          <div className="space-y-6">
            <h1 className="font-headline text-8xl font-bold italic tracking-tighter leading-none">Complete.</h1>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-black/30">Session finalized and archived</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* QR Code Simulation */}
            <div className="p-10 border-2 border-black flex items-center gap-10 bg-white shadow-xl group">
               <div className="h-32 w-32 bg-zinc-100 border border-black/5 flex items-center justify-center relative">
                  <div className="p-4 grid grid-cols-5 gap-1 w-full h-full opacity-30">
                     {qrPattern.map((isDark, i) => (
                       <div key={i} className={cn("h-full w-full", isDark ? "bg-black" : "bg-transparent")} />
                     ))}
                  </div>
                  <Share2 className="absolute h-10 w-10 text-black" />
               </div>
               <div className="space-y-2">
                  <p className="text-xl font-headline font-bold italic tracking-tight">Digital Sync</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/40 max-w-[180px]">Scan to download high-res files instantly to your mobile device.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={downloadImage} className="h-20 bg-black text-white font-black uppercase tracking-widest rounded-none shadow-xl border-none">
                <Download className="h-5 w-5 mr-3" /> Save File
              </Button>
              <Button onClick={handlePrint} variant="outline" className="h-20 border-black/10 text-black font-black uppercase tracking-widest rounded-none hover:bg-zinc-50">
                <Printer className="h-5 w-5 mr-3" /> Print
              </Button>
            </div>

            <Button onClick={onDone} variant="ghost" className="h-16 w-full text-black/30 hover:text-black font-black uppercase tracking-[0.4em] text-[10px] group">
              Start New Session <ArrowRight className="h-4 w-4 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}