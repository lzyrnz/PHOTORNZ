'use client';

import { useState, useEffect } from 'react';
import { CameraView } from '@/components/glamcam/camera-view';
import { EditorView } from '@/components/glamcam/editor-view';
import { LayoutSelector, LayoutConfig, LAYOUTS } from '@/components/glamcam/layout-selector';
import { ProgressStepper } from '@/components/glamcam/progress-stepper';
import { 
  Maximize,
  Monitor,
  Layout,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  RotateCcw,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

export type BoothStep = 'layout' | 'capture' | 'review' | 'finish';

export default function PhotoboothPage() {
  const [step, setStep] = useState<BoothStep>('layout');
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutConfig>(LAYOUTS[1]); 
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [deviceId, setDeviceId] = useState<string>('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [eventTitle, setEventTitle] = useState(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 100);
    if (isMobile) setIsSidebarOpen(false);

    const fetchDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const all = await navigator.mediaDevices.enumerateDevices();
        const vids = all.filter(d => d.kind === 'videoinput');
        setDevices(vids);
        if (vids.length > 0 && !deviceId) setDeviceId(vids[0].deviceId);
        stream.getTracks().forEach(track => track.stop());
      } catch (e) {}
    };
    fetchDevices();
    return () => clearTimeout(timer);
  }, [deviceId, isMobile]);

  const toggleFull = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const reset = () => {
    setImages([]);
    setStep('layout');
  };

  const handleCaptureComplete = (newImages: string[]) => {
    setImages(prev => {
      const combined = [...prev, ...newImages];
      return combined.slice(0, layout.slots);
    });
    setStep('review');
  };

  return (
    <div className="relative h-screen w-full flex bg-white font-sans overflow-hidden select-none">
      
      {/* SHUTTER TRANSITION */}
      <div className={cn(
        "fixed inset-0 z-[6000] bg-black pointer-events-none transition-transform duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)]",
        isInitializing ? "scale-y-100" : "scale-y-0"
      )} style={{ transformOrigin: 'top' }} />

      {/* INTEGRATED CONSOLE */}
      <div className={cn(
        "bg-white border-r border-black/5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[5000] flex flex-col overflow-hidden shrink-0",
        isMobile ? "fixed inset-0 w-full" : "relative h-full shadow-2xl",
        isSidebarOpen 
          ? (isMobile ? "translate-x-0" : "w-[350px]") 
          : (isMobile ? "-translate-x-full" : "w-0")
      )}>
        <div className={cn(
          "flex-1 overflow-y-auto no-scrollbar p-8 md:p-10 space-y-10 transition-opacity duration-300",
          isMobile ? "w-full" : "w-[350px]",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                 <Shield className="h-4 w-4" />
                 <h2 className="text-lg font-headline font-bold italic uppercase tracking-tighter">Console</h2>
               </div>
               <p className="text-[7px] font-black uppercase tracking-[0.4em] text-black/20">SESSION_ACTIVE // LINK_STABLE</p>
            </div>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="rounded-none">
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Session Identity</Label>
              <Input 
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="UNNAMED_SESSION"
                className="bg-white border-black/10 h-10 font-headline italic font-bold uppercase tracking-tight focus:ring-black rounded-none placeholder:text-black/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2">
                <Layout className="h-3 w-3" /> Grid Architecture
              </Label>
              <LayoutSelector onSelect={(l) => { setLayout(l); if(isMobile) setIsSidebarOpen(false); }} selectedId={layout.id} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2 p-3 bg-zinc-50 border border-black/5">
                <div className="flex items-center justify-between">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-black/40">Mirror</Label>
                  <Switch checked={isMirrored} onCheckedChange={setIsMirrored} className="scale-75 data-[state=checked]:bg-black" />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-zinc-50 border border-black/5">
                <div className="flex items-center justify-between">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-black/40">Landscape</Label>
                  <Switch checked={isLandscape} onCheckedChange={setIsLandscape} className="scale-75 data-[state=checked]:bg-black" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2">
                <Monitor className="h-3 w-3" /> Optical Link
              </Label>
              <div className="flex flex-col gap-1">
                {devices.map(d => (
                  <button 
                    key={d.deviceId}
                    onClick={() => { setDeviceId(d.deviceId); if(isMobile) setIsSidebarOpen(false); }}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 text-[8px] font-bold border transition-all rounded-none uppercase tracking-widest",
                      deviceId === d.deviceId ? "bg-black border-black text-white" : "bg-white border-black/5 text-black/30 hover:text-black"
                    )}
                  >
                    <span className="truncate max-w-[150px]">{d.label || `LENS_${d.deviceId.slice(0, 4)}`}</span>
                    {deviceId === d.deviceId && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 space-y-3">
            {!isMobile && (
              <Button variant="outline" onClick={toggleFull} className="w-full h-10 rounded-none border-black/10 text-[8px] font-black uppercase tracking-widest">
                <Maximize className="h-3 w-3 mr-2" /> Fullscreen
              </Button>
            )}
            <Button onClick={reset} variant="ghost" className="w-full h-8 text-[7px] font-black text-black/20 hover:text-black uppercase tracking-[0.3em]">
              <RotateCcw className="h-3 w-3 mr-2" /> System Reset
            </Button>
            <Link href="/" className="flex items-center justify-center gap-2 h-8 text-[7px] font-black text-black/20 hover:text-black uppercase tracking-[0.3em] transition-colors">
              <LogOut className="h-3 w-3" /> Exit Console
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-full bg-white flex flex-col overflow-hidden">
        
        {/* CONSOLE TOGGLE */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-20 w-8 bg-white border border-black/5 border-l-0 flex items-center justify-center hover:bg-zinc-50 transition-all shadow-xl z-[1000]",
            isMobile ? (isSidebarOpen ? "hidden" : "left-0") : "left-0"
          )}
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* STABLE HEADER */}
        <div className="w-full z-[900] px-4 md:px-10 py-6 md:py-12 shrink-0 border-b border-black/5 bg-white">
          <ProgressStepper currentStep={step} />
        </div>

        {/* DYNAMIC STAGE AREA */}
        <div className="flex-1 relative overflow-hidden bg-white">
          {step === 'layout' && (
            <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-20">
              <div className="max-w-4xl text-center space-y-10 md:space-y-16">
                <div className="space-y-2 md:space-y-4">
                  <h1 className="font-headline text-5xl sm:text-7xl md:text-[10rem] italic font-bold tracking-tighter uppercase leading-none text-glow">
                    Studio<br />
                    <span className="not-italic text-black/5">Entrance.</span>
                  </h1>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-2 md:-inset-4 border border-black/5 group-hover:border-black/20 transition-all duration-700" />
                  <Button 
                    onClick={() => setStep('capture')}
                    className="h-20 md:h-24 px-12 md:px-20 bg-black text-white font-black uppercase tracking-[0.4em] md:tracking-[0.6em] rounded-none shadow-3xl text-lg md:text-xl hover:bg-zinc-900 transition-all relative z-10"
                  >
                    Enter Stage
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'capture' && (
            <CameraView 
              layout={{...layout, slots: layout.slots - images.length}} 
              selectedDeviceId={deviceId}
              onComplete={handleCaptureComplete}
              onCancel={reset}
              isLandscape={isLandscape}
              isMirrored={isMirrored}
              onStartSequence={() => { if(!isMobile) setIsSidebarOpen(false); }}
            />
          )}

          {step === 'review' && (
            <EditorView 
              images={images} 
              layout={layout}
              onLayoutChange={setLayout}
              onBack={() => { setImages([]); setStep('capture'); }}
              onAddMore={() => setStep('capture')}
              onFinish={reset}
              eventTitle={eventTitle || ''}
              isLandscape={isLandscape}
            />
          )}
        </div>
      </div>
    </div>
  );
}