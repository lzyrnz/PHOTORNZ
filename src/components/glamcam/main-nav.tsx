'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Sparkles, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-black/5">
      <SidebarHeader className="p-8">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 bg-black rounded-none flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-black">PHOTORNZ</span>
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold mt-1">v5.0 Enterprise</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-8">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Studio Hub</SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/photobooth'}
                className={cn(
                  "h-14 px-4 rounded-none transition-all duration-200 border-l-2",
                  pathname === '/photobooth' ? "bg-zinc-50 text-black border-black" : "text-black/30 border-transparent hover:text-black"
                )}
              >
                <Link href="/photobooth" className="flex items-center gap-4">
                  <Camera className="h-5 w-5" />
                  <span className="text-xs tracking-[0.2em] uppercase font-black">Studio Stage</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-auto px-4 py-8">
           <div className="p-6 bg-zinc-50 border border-black/5 flex flex-col gap-3">
              <Shield className="h-4 w-4 text-black/20" />
              <p className="text-[8px] font-black uppercase tracking-widest text-black/40">Privacy Status</p>
              <p className="text-[7px] uppercase tracking-[0.2em] leading-relaxed text-black/30">Session-only mode active. No data will be stored after closure.</p>
           </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-8">
        <Link href="/" className="flex items-center gap-4 text-black/20 hover:text-black transition-all">
          <LogOut className="h-4 w-4" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Exit Console</span>
        </Link>
      </SidebarFooter>
    </div>
  );
}
