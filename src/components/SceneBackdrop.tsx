import React, { useState } from 'react';

interface SceneBackdropProps {
  imageSrc: string;
  alt: string;
  fallbackTint?: string;
  children?: React.ReactNode;
  heightClass?: string;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({
  imageSrc,
  alt,
  fallbackTint = 'from-amber-100 to-orange-100',
  children,
  heightClass = 'min-h-[210px] sm:min-h-[240px]',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-stone-200 bg-gradient-to-br ${fallbackTint}`}
    >
      {!imgFailed ? (
        <img
          src={imageSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <svg viewBox="0 0 120 80" className="w-28 h-20 text-orange-700" fill="currentColor" aria-hidden="true">
            <path d="M10 65 L60 22 L110 65 Z" opacity="0.35" />
            <rect x="28" y="42" width="64" height="28" rx="4" opacity="0.55" />
          </svg>
        </div>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-900/20 to-stone-900/10"
        aria-hidden="true"
      />
      <div className="relative z-10 h-full flex flex-col justify-end p-4">
        {children}
      </div>
    </div>
  );
};
