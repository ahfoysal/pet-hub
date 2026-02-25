"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface PostMediaProps {
  media: string[];
  alt?: string;
}

export function PostMedia({ media, alt = "Post media" }: PostMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!media || media.length === 0) return null;

  const hasMultiple = media.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsLoaded(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsLoaded(false);
  };

  const isVideo = (url: string) => {
    return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full">
        {isVideo(currentMedia) ? (
          <div className="relative w-full h-full">
            <video
              src={currentMedia}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                <Play size={32} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={currentMedia}
              alt={`${alt} ${currentIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
            />
          </>
        )}
      </div>

      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight size={18} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsLoaded(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter Badge */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1}/{media.length}
        </div>
      )}
    </div>
  );
}

export default PostMedia;
