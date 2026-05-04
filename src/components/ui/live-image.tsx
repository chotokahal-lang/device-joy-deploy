import React from "react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { LiveText } from "@/components/ui/live-text";
import { ImagePlus } from "lucide-react";
import { motion } from "framer-motion";

interface LiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  id: string;
  defaultSrc: string;
}

export function LiveImage({ id, defaultSrc, className, alt, ...props }: LiveImageProps) {
  const { isEditMode, images, setImage, activeElementId, setActiveElementId } = useLiveEditStore();
  
  const currentSrc = images[id] || defaultSrc;
  const isActive = isEditMode && activeElementId === id;
  const hasActiveElement = isEditMode && activeElementId !== null;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveElementId(id);
  };

  return (
    <div 
      id={id}
      className={`relative inline-block w-full h-full transition-all duration-300 ${isEditMode ? "group cursor-pointer rounded-xl overflow-hidden" : ""} ${
        isActive ? "ring-2 ring-primary shadow-[0_0_20px_rgba(249,115,22,0.4)] z-[50]" : ""
      } ${hasActiveElement && !isActive ? "opacity-20 grayscale pointer-events-none" : ""}`}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          e.stopPropagation();

          // Sync current src to store if empty
          if (images[id] === undefined) {
             setImage(id, currentSrc);
          }

          setActiveElementId(id);
        }
      }}
      onMouseDown={(e) => isEditMode && e.stopPropagation()}
      onMouseUp={(e) => isEditMode && e.stopPropagation()}
    >
      <img
        src={currentSrc}
        alt={alt || "Image"}
        className={`transition-all duration-300 w-full h-full object-contain ${className || ""} ${
          isEditMode && !hasActiveElement ? "group-hover:opacity-50 group-hover:blur-[2px] ring-2 ring-transparent group-hover:ring-primary/50 rounded-xl" : ""
        }`}
        {...props}
      />
      
      {isEditMode && !isActive && !hasActiveElement && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl opacity-0 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl mb-2">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
            <LiveText as="span" id="live-image-overlay-hint" defaultText="Edit Gambar" />
          </span>
        </motion.div>
      )}
    </div>
  );
}
