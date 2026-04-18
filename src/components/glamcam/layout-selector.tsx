'use client';

import { Square, LayoutGrid, RectangleVertical, Grid3X3, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LayoutConfig {
  id: string;
  label: string;
  slots: number;
  icon: any;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

export const LAYOUTS: LayoutConfig[] = [
  { id: 'solo', label: 'SOLO PORTRAIT (1x1)', slots: 1, icon: Square, aspectRatio: 'portrait' },
  { id: '2x2', label: 'QUAD SQUARE (2x2)', slots: 4, icon: LayoutGrid, aspectRatio: 'square' },
  { id: '1x3', label: 'FILM STRIP (1x3)', slots: 3, icon: RectangleVertical, aspectRatio: 'portrait' },
  { id: 'hero3', label: 'DIRECTOR (1L + 3S)', slots: 4, icon: Grid3X3, aspectRatio: 'square' },
];

interface LayoutSelectorProps {
  onSelect: (layout: LayoutConfig) => void;
  selectedId?: string;
}

export function LayoutSelector({ onSelect, selectedId }: LayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout)}
            className={cn(
              "group relative flex items-center justify-between p-4 border transition-all duration-300 rounded-none text-left",
              selectedId === layout.id 
                ? "bg-black border-black text-white" 
                : "bg-white border-black/5 text-black/40 hover:border-black/20 hover:text-black"
            )}
          >
            <div className="flex items-center gap-3 relative z-10">
              <layout.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", selectedId === layout.id ? "text-white" : "text-black/20")} />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest">{layout.label}</p>
                <p className="text-[8px] uppercase tracking-widest opacity-40">{layout.slots} SHOT{layout.slots > 1 ? 'S' : ''}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}