'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const router = useRouter();

  useEffect(() => {
    // Permanent redirect as gallery is removed for privacy
    router.replace('/photobooth');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
        Redirecting to Studio Stage...
      </div>
    </div>
  );
}
