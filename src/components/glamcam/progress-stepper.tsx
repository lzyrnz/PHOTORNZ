'use client';

import { BoothStep } from '@/app/(app)/photobooth/page';
import { cn } from '@/lib/utils';
import { Layout, Camera, Palette, CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressStepperProps {
  currentStep: BoothStep;
}

const STEPS = [
  { id: 'layout', label: 'LAYOUT', icon: Layout },
  { id: 'capture', label: 'CAPTURE', icon: Camera },
  { id: 'review', label: 'DARKROOM', icon: Palette },
  { id: 'finish', label: 'FINALIZE', icon: CheckCircle2 },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex items-center justify-center gap-4 md:gap-8 transition-all duration-500">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={step.id} className="flex items-center gap-2 md:gap-4">
            <div className={cn(
              "flex flex-col items-center gap-1.5 md:gap-2 transition-all duration-500",
              isActive ? "opacity-100 translate-y-0" : "opacity-20 -translate-y-1"
            )}>
              <div className={cn(
                "h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-none border-2 transition-all duration-500",
                isActive ? "bg-black text-white border-black scale-110 shadow-xl" : "bg-white text-black border-black/10"
              )}>
                <step.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              {!isMobile && (
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase">
                  {step.label}
                </span>
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn(
                "h-px w-6 md:w-16 transition-all duration-1000",
                isCompleted ? "bg-black" : "bg-black/5"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
