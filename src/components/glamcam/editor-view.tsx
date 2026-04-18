'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Download, 
  Trash2, 
  Layout, 
  Palette, 
  Layers,
  Plus,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LayoutConfig, LAYOUTS } from './layout-selector';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditorViewProps {
  images: string[];
  layout: LayoutConfig;
  onLayoutChange: (layout: LayoutConfig) => void;
  onBack: () => void;
  onAddMore: () => void;
  onFinish: () => void;
  eventTitle: string;
  isLandscape?: boolean;
}

const STRIP_COLORS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Onyx Black', value: '#121212' },
  { name: 'Studio Gray', value: '#f4f4f5' },
  { name: 'Sepia Film', value: '#f4ecd8' },
  { name: 'Modern Rose', value: '#ffeadb' },
  { name: 'Tech Azure', value: '#e3f2fd' },
];

const FONTS = [
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Inter Tight', value: "'Inter', sans-serif" },
  { name: 'Space Mono', value: "'Space Mono', monospace" },
  { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
];

export function EditorView({ 
  images, 
  layout, 
  onLayoutChange, 
  onBack, 
  onAddMore,
  onFinish, 
  eventTitle, 
  isLandscape = false 
}: EditorViewProps) {
  const [stripColor, setStripColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [localTitle, setLocalTitle] = useState(eventTitle);
  const [fontFamily, setFontFamily] = useState(FONTS[0].value);
  const [fontSize, setFontSize] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textColor, setTextColor] = useState('#000000');
  const [isItalic, setIsItalic] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const isDark = stripColor === '#121212' || stripColor.toLowerCase() === '#000000';
    setTextColor(isDark ? '#ffffff' : '#000000');
  }, [stripColor]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
        toast({
          title: "SURFACE_TEXTURE_UPLOADED",
          description: "Custom background image successfully mapped to strip.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let sx, sy, sw, sh;

    if (imgRatio > targetRatio) {
      sh = img.height; sw = sh * targetRatio; sx = (img.width - sw) / 2; sy = 0;
    } else {
      sw = img.width; sh = sw / targetRatio; sx = 0; sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  const generateAndDownload = async () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const baseWidth = isLandscape ? 1600 : 1200;
    const baseHeight = isLandscape ? 900 : 1500;
    const padding = 60;
    const headerHeight = localTitle ? 300 : 100;
    
    let cols = layout.id === '2x2' ? 2 : 1;
    let rows = Math.ceil(layout.slots / cols);

    canvas.width = (baseWidth * cols) + (padding * (cols + 1));
    canvas.height = (baseHeight * rows) + (padding * (rows + 1)) + headerHeight;

    ctx.fillStyle = stripColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (bgImage) {
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          drawImageCover(ctx, img, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        img.src = bgImage;
      });
    }

    if (localTitle) {
      ctx.fillStyle = textColor;
      ctx.font = `${isItalic ? 'italic' : 'normal'} 900 ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(localTitle.toUpperCase(), canvas.width / 2, 180);
    }

    const promises = images.slice(0, layout.slots).map((src, i) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = async () => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = padding + (col * (baseWidth + padding));
          const y = headerHeight + padding + (row * (baseHeight + padding));
          drawImageCover(ctx, img, x, y, baseWidth, baseHeight);
          resolve();
        };
        img.src = src;
      });
    });

    await Promise.all(promises);

    const link = document.createElement('a');
    link.download = `PHOTORNZ-STUDIO-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    setIsProcessing(false);
    onFinish();
    
    toast({
      title: "COMPOSITE_EXPORTED",
      description: "Session successfully archived to local storage.",
    });
  };

  const slotsNeeded = layout.slots - images.length;

  return (
    <div className="h-full w-full bg-white flex flex-col md:flex-row p-4 md:p-12 gap-6 md:gap-12 animate-in fade-in duration-1000 overflow-y-auto md:overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
        {!isMobile && (
          <div className="absolute top-0 left-0 flex items-center gap-4 opacity-20">
            <Layers className="h-4 w-4" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Live_Render_Output</span>
          </div>
        )}
        
        <div className={cn(
          "relative w-full max-w-4xl studio-border overflow-hidden p-4 md:p-8 flex flex-col shadow-3xl transition-all duration-700",
          isLandscape ? "aspect-video" : "aspect-[4/5]"
        )} style={{ backgroundColor: stripColor }}>
          
          {bgImage && (
            <div className="absolute inset-0 pointer-events-none">
              <Image src={bgImage} alt="Background Texture" fill className="object-cover" />
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full">
            {localTitle && (
              <div className="w-full text-center pb-4 md:pb-8 pt-2 md:pt-4">
                <h3 
                  className="font-bold uppercase tracking-tighter"
                  style={{ 
                    fontFamily: fontFamily,
                    fontSize: isMobile ? `${fontSize / 4}px` : `${fontSize / 2.5}px`,
                    letterSpacing: `${letterSpacing / 2.5}px`,
                    color: textColor,
                    fontStyle: isItalic ? 'italic' : 'normal'
                  }}
                >
                  {localTitle}
                </h3>
              </div>
            )}

            <div className={cn(
              "grid gap-2 md:gap-4 flex-1 w-full",
              layout.id === '2x2' ? 'grid-cols-2' : 'grid-cols-1'
            )}>
              {Array.from({ length: layout.slots }).map((_, i) => {
                const src = images[i];
                return (
                  <div key={i} className="relative bg-black/5 shadow-lg overflow-hidden border border-black/5 group flex items-center justify-center">
                    {src ? (
                      <>
                        <Image src={src} alt={`Shot ${i}`} fill className="object-cover" />
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/80 text-white px-2 md:px-3 py-0.5 md:py-1 text-[6px] md:text-[8px] font-black uppercase tracking-widest">
                          CAM_0{i + 1}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        <Plus className="h-6 w-6 md:h-8 md:w-8 text-black" />
                        <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-black">EMPTY_SLOT</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        </div>

        {slotsNeeded > 0 && (
          <div className="mt-6 md:mt-8">
            <Button 
              onClick={onAddMore}
              variant="outline"
              className="h-10 md:h-12 px-6 md:px-8 border-black text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-black hover:text-white transition-all rounded-none"
            >
              <Plus className="h-3.5 w-3.5 mr-2 md:mr-3" /> Grid Architecture ({slotsNeeded} slots)
            </Button>
          </div>
        )}
      </div>

      <div className="w-full md:w-[450px] flex flex-col h-auto md:h-full bg-white space-y-6 md:space-y-8 z-50 overflow-y-auto no-scrollbar pb-10 md:pb-20">
        <div className="space-y-1 md:space-y-2">
          <h1 className="font-headline text-4xl md:text-6xl font-bold italic tracking-tighter leading-none">Darkroom.</h1>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-black/20">POST_PROCESS // COMPOSITE_MODULE</p>
        </div>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="w-full bg-zinc-50 rounded-none h-10 md:h-12 border-black/5 p-1">
             <TabsTrigger value="design" className="flex-1 rounded-none text-[8px] md:text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white">
              <Palette className="h-3 w-3 mr-2" /> Design
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex-1 rounded-none text-[8px] md:text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white">
              <Layout className="h-3 w-3 mr-2" /> Grid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="pt-4 md:pt-8 space-y-6 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Surface Texture (Image)</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 h-10 md:h-12 border-black/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-none hover:bg-zinc-50"
                  >
                    <Upload className="h-3 w-3 mr-2" /> {bgImage ? 'Replace Photo' : 'Import Photo'}
                  </Button>
                  {bgImage && (
                    <Button 
                      onClick={() => setBgImage(null)}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 md:h-12 md:w-12 border-black/10 rounded-none hover:bg-zinc-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleBgUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Surface Color</Label>
                  <div className="flex items-center gap-2">
                     <div className="relative h-6 w-6">
                       <input 
                        type="color" 
                        value={stripColor}
                        onChange={(e) => setStripColor(e.target.value)}
                        className="h-full w-full opacity-0 absolute cursor-pointer z-10"
                       />
                       <div className="absolute inset-0 border border-black/10">
                         <div className="w-full h-full" style={{ backgroundColor: stripColor }} />
                       </div>
                     </div>
                     <span className="text-[7px] font-mono text-black/40 uppercase">{stripColor}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STRIP_COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setStripColor(c.value)}
                      className={cn(
                        "group relative h-14 md:h-20 w-full border transition-all flex flex-col items-center justify-center gap-1",
                        stripColor === c.value ? "border-black bg-zinc-50 shadow-inner" : "border-black/5 hover:border-black/20"
                      )}
                    >
                      <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border border-black/5" style={{ backgroundColor: c.value }} />
                      <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8 bg-zinc-50 border border-black/5 space-y-6 md:space-y-8">
               <div className="space-y-2 md:space-y-4">
                 <Input 
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="UNNAMED_SESSION"
                  className="bg-transparent border-none p-0 h-auto text-lg md:text-xl font-bold italic text-black/80 focus-visible:ring-0 placeholder:text-black/10"
                  style={{ fontFamily: fontFamily, color: textColor, fontStyle: isItalic ? 'italic' : 'normal' }}
                 />
                 <div className="h-px w-full bg-black/5" />
               </div>

               <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-10 rounded-none border-black/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                        <SelectValue placeholder="Select Font" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-black/10">
                        {FONTS.map(f => (
                          <SelectItem key={f.name} value={f.value} className="text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-none">
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Font Size</Label>
                        <span className="text-[7px] md:text-[8px] font-mono font-bold">{fontSize}</span>
                      </div>
                      <Slider value={[fontSize]} onValueChange={(val) => setFontSize(val[0])} min={40} max={200} step={1} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Spacing</Label>
                        <span className="text-[7px] md:text-[8px] font-mono font-bold">{letterSpacing}</span>
                      </div>
                      <Slider value={[letterSpacing]} onValueChange={(val) => setLetterSpacing(val[0])} min={-10} max={50} step={1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between p-2 md:p-3 border border-black/5 bg-white">
                      <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Italic</Label>
                      <Switch checked={isItalic} onCheckedChange={setIsItalic} className="scale-75" />
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3 border border-black/5 bg-white">
                      <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Color</Label>
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-6 w-6 border border-black/10 cursor-pointer" />
                    </div>
                  </div>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="pt-4 md:pt-8 space-y-4">
            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Grid Architecture</Label>
            <div className="grid grid-cols-1 gap-2">
              {LAYOUTS.map(l => (
                <button
                  key={l.id}
                  onClick={() => onLayoutChange(l)}
                  className={cn(
                    "flex items-center justify-between p-4 md:p-5 border transition-all text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-none",
                    layout.id === l.id ? "bg-black border-black text-white" : "bg-white border-black/5 text-black/40 hover:text-black"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <l.icon className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{l.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-auto pt-6 md:pt-10 border-t border-black/10 space-y-4">
          <Button 
            onClick={generateAndDownload} 
            disabled={isProcessing}
            className="w-full h-16 md:h-24 bg-black text-white font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-lg md:text-xl rounded-none shadow-3xl hover:bg-zinc-900 transition-all group"
          >
            <Download className="h-6 w-6 md:h-7 md:w-7 mr-4 md:mr-6 group-hover:scale-110 transition-transform" /> 
            {isProcessing ? "SYNTHESIZING..." : "GENERATE STRIP"}
          </Button>
          
          <div className="flex gap-2 pb-6 md:pb-10">
            <Button onClick={onBack} variant="outline" className="flex-1 h-12 md:h-14 border-black/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-none">
              <Trash2 className="h-4 w-4 mr-2" /> Discard
            </Button>
            <Button onClick={onFinish} variant="ghost" className="flex-1 h-12 md:h-14 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/30 hover:text-black rounded-none">
              System Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}