'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { VideoOff, Camera as CameraIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { LayoutConfig } from './layout-selector';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface CameraViewProps {
  layout: LayoutConfig;
  selectedDeviceId: string;
  onComplete: (images: string[]) => void;
  onCancel: () => void;
  isLandscape?: boolean;
  isMirrored?: boolean;
  onStartSequence?: () => void;
}

export function CameraView({ 
  layout, 
  selectedDeviceId, 
  onComplete, 
  onCancel, 
  isLandscape = false,
  isMirrored = true,
  onStartSequence
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | undefined>(undefined);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      cleanup();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 3840 }, 
            height: { ideal: 2160 },
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined 
          }
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
        toast({ variant: 'destructive', title: 'HARDWARE_LINK_ERROR', description: 'Failed to access camera sensor.' });
      }
    };
    init();
    return cleanup;
  }, [selectedDeviceId, toast, cleanup]);

  const capture = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    return canvas.toDataURL('image/jpeg', 1.0);
  }, [isMirrored]);

  const startSequence = () => {
    onStartSequence?.();
    setShots([]);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const shot = capture();
      if (shot) {
        setShots(prev => {
          const next = [...prev, shot];
          if (next.length < layout.slots) {
            setTimeout(() => setCountdown(3), 1200);
          } else {
            setCountdown(null);
            setTimeout(() => onComplete(next), 0);
          }
          return next;
        });
      }
    }
  }, [countdown, layout.slots, capture, onComplete]);

  return (
    <div className="relative h-full w-full bg-white flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
      
      <div className={cn(
        "relative w-full max-w-5xl bg-zinc-50 studio-border overflow-hidden transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.1)]",
        isLandscape ? "aspect-video" : "aspect-[4/5]",
        countdown !== null ? "scale-[1.02] md:scale-[1.05]" : "scale-100"
      )}>
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            isMirrored && "scale-x-[-1]"
          )}
          autoPlay muted playsInline
        />

        {countdown !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <span className={cn(
              "font-sans font-black text-black leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] animate-in zoom-in-50 duration-300",
              isMobile ? "text-[12rem]" : "text-[25rem]"
            )}>
              {countdown > 0 ? countdown : ''}
            </span>
          </div>
        )}

        <div className="scanline" />
      </div>

      <div className={cn(
        "mt-8 md:mt-12 transition-all duration-700",
        countdown !== null ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}>
        {shots.length === 0 && (
          <Button 
            onClick={startSequence} 
            className="h-20 md:h-24 px-10 md:px-16 rounded-none bg-black text-white font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-2xl text-base md:text-lg"
          >
            <CameraIcon className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4" /> Initialize Capture
          </Button>
        )}
      </div>

      <div className={cn("fixed inset-0 bg-white z-[1000] pointer-events-none transition-opacity duration-150", flash ? "opacity-100" : "opacity-0")} />

      {hasPermission === false && (
        <div className="absolute inset-0 z-[2000] bg-white flex items-center justify-center p-8 md:p-20 text-center">
          <div className="space-y-8 max-w-md">
            <VideoOff className="h-16 w-16 md:h-20 md:w-20 text-black/10 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-headline font-bold italic uppercase tracking-tighter">Hardware Fault</h2>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-black/30">Could not initialize optical sensor.</p>
            <Button onClick={onCancel} variant="outline" className="rounded-none border-black/10 uppercase tracking-widest h-12 md:h-14">Return to Base</Button>
          </div>
        </div>
      )}
    </div>
  );
}
