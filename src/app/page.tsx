'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ChevronDown, 
  Github,
  Terminal,
  RefreshCw,
  Target,
  Scan,
  Layers,
  Cpu,
  Camera,
  Linkedin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Feature Card with Viewfinder Lock-On Effect.
 */
const FeatureCard = ({ children, icon: Icon, title, description, className }: { children?: React.ReactNode, icon: any, title: string, description: string, className?: string }) => {
  return (
    <div className={cn("group relative p-10 md:p-16 bg-white border border-black/[0.05] hover:border-black transition-all duration-700 shadow-2xl overflow-hidden cursor-default", className)}>
      {/* Viewfinder Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-black/10 group-hover:border-black group-hover:top-2 group-hover:left-2 transition-all duration-500" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-black/10 group-hover:border-black group-hover:top-2 group-hover:right-2 transition-all duration-500" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-black/10 group-hover:border-black group-hover:bottom-2 group-hover:left-2 transition-all duration-500" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-black/10 group-hover:border-black group-hover:bottom-2 group-hover:right-2 transition-all duration-500" />
      
      {/* Scanline Sweep */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.02] to-transparent h-[10%] w-full -translate-y-full group-hover:animate-[scan_1.5s_ease-in-out_infinite] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-50 border border-black/5 group-hover:bg-black group-hover:text-white transition-all duration-500">
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="font-black uppercase tracking-[0.4em] text-[12px] md:text-[14px]">{title}</h3>
        </div>
        <p className="text-[13px] md:text-[15px] leading-relaxed text-black/40 uppercase tracking-[0.3em] font-bold group-hover:text-black transition-colors">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};

/**
 * 3D Archival Style Cell.
 */
const FloatingStrip = ({ delay = 0, x = 0, y = 0, rotate = 0, scale = 1, opacity = 0.05 }) => (
  <div 
    className="absolute z-10 pointer-events-none transition-all duration-1000 hidden md:block [perspective:2000px] will-change-transform"
    style={{ 
      left: `${x}%`, 
      top: `${y}%`, 
      opacity: opacity
    }}
  >
    <div 
      className="animate-float-3d group/strip" 
      style={{ 
        animationDelay: `${delay}s`, 
        animationDuration: `${18 + (delay % 5)}s`,
        transform: `rotate(${rotate}deg) scale(${scale})`
      }}
    >
      <div className="bg-white p-2 shadow-[0_60px_120px_rgba(0,0,0,0.1)] border border-black/5 flex flex-col gap-2 w-40 md:w-60 [transform-style:preserve-3d]">
         {[1, 2, 3].map(i => (
           <div key={i} className="aspect-[3/4] bg-zinc-100 relative overflow-hidden">
              <Image 
                src={`https://picsum.photos/seed/strip-${delay}-${i}/600/800`} 
                alt="Studio Sample" 
                fill 
                className="object-cover grayscale"
                data-ai-hint="fashion portrait"
              />
           </div>
         ))}
      </div>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDeveloperFlipped, setIsDeveloperFlipped] = useState(false);
  const section2Ref = useRef<HTMLElement>(null);

  const architectImg = PlaceHolderImages.find(img => img.id === 'architect-profile');

  const headline1 = "PURE".split("");
  const headline2 = "CAPTURE".split("");

  const handleCaptureClick = () => {
    setIsCapturing(true);
    setTimeout(() => {
      router.push('/photobooth');
    }, 800);
  };

  const scrollToStage = () => {
    section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-black font-sans overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* SHUTTER OVERLAY */}
      <div className={cn(
        "fixed inset-0 z-[5000] pointer-events-none transition-all duration-300",
        isCapturing ? "bg-white/10 opacity-100" : "opacity-0"
      )}>
        <div className={cn(
          "absolute inset-0 bg-black transition-transform duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)]",
          isCapturing ? "scale-y-100" : "scale-y-0"
        )} style={{ transformOrigin: 'top' }} />
      </div>

      {/* STUDIO EFFECTS LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="scanline opacity-[0.03]" />
        <div className="grain-overlay opacity-[0.04]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.015]" />
      </div>

      {/* SECTION 1: THE ENTRANCE */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center px-6 md:px-10 overflow-hidden shutter-reveal">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="https://picsum.photos/seed/photornz-studio-white/1920/1080"
            alt="Elite Studio Stage"
            fill
            className="object-cover grayscale opacity-[0.08]"
            priority
            data-ai-hint="white studio"
          />
        </div>

        {/* KINETIC BACKGROUND STRIPS */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-[0.08]">
          <FloatingStrip x={10} y={10} rotate={-10} delay={0} scale={0.8} />
          <FloatingStrip x={80} y={5} rotate={15} delay={2} scale={1} />
          <FloatingStrip x={5} y={60} rotate={-5} delay={4} scale={0.7} />
          <FloatingStrip x={85} y={55} rotate={10} delay={6} scale={0.9} />
        </div>

        {/* ROAMING OPTICAL LINK BUTTON */}
        <div className="absolute inset-0 z-[60] pointer-events-none [perspective:2000px]">
          <div className="animate-roam-3d absolute top-[40%] left-[45%] pointer-events-auto">
            <Button 
              onClick={scrollToStage}
              className="h-20 w-20 md:h-32 md:w-32 bg-black text-white rounded-full shadow-[0_60px_150px_rgba(0,0,0,0.4)] hover:scale-125 active:scale-90 transition-all group flex flex-col items-center justify-center gap-1 border-4 border-white/20 backdrop-blur-sm"
            >
              <Camera className="h-8 w-8 md:h-12 md:w-12 group-hover:rotate-12 transition-transform" />
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Connect</span>
            </Button>
          </div>
        </div>

        {/* TOP NAV BAR */}
        <nav className="absolute top-0 w-full flex items-center justify-between p-8 md:p-12 md:px-24 z-[100]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-black flex items-center justify-center shadow-2xl">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-black">PHOTORNZ</span>
          </div>
        </nav>

        {/* HERO TYPOGRAPHY - PERFECTLY CENTERED */}
        <div className="relative z-50 w-full flex flex-col items-center justify-center text-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="font-headline text-6xl sm:text-8xl md:text-[15rem] font-bold leading-[0.8] tracking-tighter uppercase italic text-glow flex flex-col items-center">
              <div className="flex">
                {headline1.map((char, i) => (
                  <span 
                    key={i} 
                    className="animate-letter-snap inline-block"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex">
                {headline2.map((char, i) => (
                  <span 
                    key={i} 
                    className="animate-letter-snap inline-block text-black/5 not-italic"
                    style={{ animationDelay: `${(headline1.length + i) * 0.15}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h1>
          </div>
          
          <div className="mt-12 md:mt-24 flex flex-col items-center space-y-4">
             <div className="h-px w-20 bg-black/10" />
             <p className="text-[10px] md:text-[14px] font-bold uppercase tracking-[1em] text-black/20">Studio Ready</p>
          </div>
        </div>

        {/* BOTTOM INDICATOR */}
        <div className="absolute bottom-12 left-0 w-full flex justify-center z-10">
           <ChevronDown className="h-6 w-6 text-black/10 animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: THE STUDIO STAGE FOCUS */}
      <section ref={section2Ref} className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-24 md:py-40 bg-white overflow-hidden">
        <div className="w-full max-w-7xl relative z-10">
          
          <div 
            onClick={handleCaptureClick}
            className="group relative block w-full aspect-square sm:aspect-video md:aspect-[21/9] overflow-hidden bg-white border border-black/[0.04] shadow-3xl transition-all hover:border-black duration-1000 cursor-pointer"
          >
             <div className="absolute inset-8 md:inset-20 border border-black/[0.08] group-hover:inset-2 group-hover:border-black transition-all duration-1000 pointer-events-none z-20" />
             
             <div className="absolute top-8 left-8 md:top-20 md:left-20 w-16 h-16 md:w-28 md:h-28 border-t-[5px] border-l-[5px] border-black transition-all duration-700 z-30" />
             <div className="absolute top-8 right-8 md:top-20 md:right-20 w-16 h-16 md:w-28 md:h-28 border-t-[5px] border-r-[5px] border-black transition-all duration-700 z-30" />
             <div className="absolute bottom-8 left-8 md:bottom-20 md:left-20 w-16 h-16 md:w-28 md:h-28 border-b-[5px] border-l-[5px] border-black transition-all duration-700 z-30" />
             <div className="absolute bottom-8 right-8 md:bottom-20 md:right-20 w-16 h-16 md:w-28 md:h-28 border-b-[5px] border-r-[5px] border-black transition-all duration-700 z-30" />

             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-8 md:space-y-16 z-40">
                <Scan className="h-20 w-20 md:h-36 md:w-36 text-black animate-float-slow" />
                <h2 className="text-6xl md:text-[14rem] font-headline font-bold italic tracking-tighter uppercase leading-none group-hover:scale-[1.03] transition-transform duration-[1.5s]">Studio Stage</h2>
                <div className="inline-flex items-center gap-6 md:gap-16 h-20 md:h-28 px-16 md:px-32 bg-black text-white font-black uppercase tracking-[0.5em] md:tracking-[0.8em] text-[14px] md:text-[22px] group-hover:bg-zinc-900 transition-all shadow-3xl">
                   Enter Suite <ArrowRight className="h-5 w-5 md:h-8 md:w-8 group-hover:translate-x-12 transition-transform duration-700" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-24 md:mt-40">
             
             {/* SYNTHESIS CARD */}
             <FeatureCard 
               icon={Cpu} 
               title="Synthesis" 
               description="Next.js 15 & Firebase. Built for speed."
             />
             
             {/* ARCHITECT CARD */}
             <div className="group/flip relative h-full min-h-[450px] md:min-h-[550px] [perspective:2000px]">
               <div className={cn(
                 "relative h-full w-full transition-transform duration-[1.2s] [transform-style:preserve-3d]",
                 isDeveloperFlipped ? "[transform:rotateY(180deg)]" : ""
               )}>
                 <div className="absolute inset-0 p-10 md:p-16 bg-white border border-black/[0.1] shadow-3xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden]">
                    <button 
                      onClick={() => setIsDeveloperFlipped(true)}
                      className="group/btn absolute top-8 left-8 h-10 w-10 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform active:rotate-180 duration-700 z-50 rounded-full"
                    >
                        <RefreshCw className="h-4 w-4 transition-transform group-hover/btn:rotate-180 duration-1000" />
                    </button>
                    <div className="flex items-center gap-8 mb-10">
                       <div className="p-5 md:p-6 bg-black text-white shadow-3xl">
                          <Terminal className="h-8 w-8 md:h-10 md:w-10" />
                       </div>
                       <h3 className="font-black uppercase tracking-[0.5em] text-[12px] md:text-[14px]">Architect</h3>
                    </div>
                    <p className="text-[13px] md:text-[15px] leading-relaxed text-black/40 uppercase tracking-[0.3em] font-bold">
                       Designed by hand. Built for you.
                    </p>
                    <div className="mt-10 pt-10 border-t border-black/[0.1]">
                       <a href="https://github.com/lzyrnz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 hover:text-black transition-colors group/git">
                          <Github className="h-6 w-6 text-black" />
                          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-black/50 group-hover/git:text-black">github.com/lzyrnz</span>
                       </a>
                    </div>
                 </div>

                 <div className="absolute inset-0 bg-black border border-black [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                    <button 
                      onClick={() => setIsDeveloperFlipped(false)}
                      className="group/btn absolute top-8 left-8 h-10 w-10 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transition-transform active:rotate-180 duration-700 z-50 rounded-full"
                    >
                        <RefreshCw className="h-4 w-4 transition-transform group-hover/btn:rotate-180 duration-1000" />
                    </button>
                    <Image 
                       src="/images/image.jpg"
                        alt="Architect"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
                        />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    <div className="absolute bottom-10 left-10">
                       <p className="text-[13px] font-black uppercase tracking-[0.8em] text-white">lzyrnz.</p>
                    </div>
                 </div>
               </div>
             </div>

             {/* LENS CORE CARD */}
             <FeatureCard 
               icon={Layers} 
               title="Lens Core" 
               description="Pro visuals. Pure precision."
             />

          </div>
        </div>
      </section>

      {/* FOOTER - MINIMALIST TECHNICAL DESIGN */}
      <footer className="px-8 md:px-24 py-12 border-t border-black/[0.05] bg-white relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] font-black uppercase tracking-[1em] text-black">
               PHOTORNZ
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-black/20">Elite Studio Protocol // v5.0</p>
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
             <a href="https://www.linkedin.com/in/renze-alano-39019a289/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                <div className="h-8 w-8 bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">LinkedIn</span>
             </a>
             
             <div className="h-8 w-px bg-black/5 hidden md:block" />
             
             <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40">&copy; 2026 Photornz Studios.</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-black/10">All Rights Reserved.</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
