
"use client";

import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GalleryContextType {
  images: GalleryImage[];
  addImage: (image: { src: string; alt: string }) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  const addImage = useCallback((image: { src: string; alt: string }) => {
    setImages((prevImages) => [
      { ...image, id: `img-${Date.now()}-${prevImages.length}` },
      ...prevImages,
    ]);
  }, []);

  return (
    <GalleryContext.Provider value={{ images, addImage }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
