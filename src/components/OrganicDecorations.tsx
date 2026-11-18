import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function FloatingStar({
  className = '',
  color = '#F57923',
  size = 22,
  delay = 0,
}: {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
      animate={
        prefersReduced
          ? undefined
          : {
              y: [0, -5, 0],
              rotate: [0, 6, 0],
            }
      }
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <path
        d="M14 2C14.7 9.1 18.9 13.3 26 14C18.9 14.7 14.7 18.9 14 26C13.3 18.9 9.1 14.7 2 14C9.1 13.3 13.3 9.1 14 2Z"
        fill={color}
      />
    </motion.svg>
  );
}

export function BotanicalSprig({
  className = '',
  color = '#F57923',
  accentColor = '#3E3028',
}: {
  className?: string;
  color?: string;
  accentColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M28 128C40 92 58 60 92 22"
        stroke={accentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M52 84C34 80 22 66 26 52C40 54 52 68 52 84Z"
        fill={color}
        fillOpacity="0.88"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M64 64C82 64 96 52 96 38C80 38 66 49 64 64Z"
        fill="#F6B36A"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M72 44C56 36 52 20 60 10C73 16 78 30 72 44Z"
        fill="#F7C99D"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="96" cy="18" r="3.5" fill={color} />
    </svg>
  );
}

export function HandDrawnUnderline({
  className = '',
  color = '#F57923',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 18"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 12.5C58 4.5 142 3.5 216 11.5"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M28 15.5C86 10.5 154 9.5 198 14.2"
        stroke="#F6B36A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandDrawnDoodleArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 44"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 34C24 14 54 10 86 20"
        stroke="#3E3028"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 5"
      />
      <path
        d="M77 12L88 20.5L75 26.5"
        stroke="#F57923"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EthicsCardIllustration({
  iconKey,
}: {
  iconKey: 'authorship' | 'privacy' | 'verification' | 'agreements' | 'interactive' | 'declaration';
}) {
  switch (iconKey) {
    case 'authorship':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <path
            d="M20 44L25 27L42 14L48 20L35 37L20 44Z"
            fill="#F6B36A"
            stroke="#3E3028"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M37 18L44 25" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 48H44" stroke="#F57923" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'privacy':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <path
            d="M32 14L46 20V31C46 40 39.5 46.8 32 50C24.5 46.8 18 40 18 31V20L32 14Z"
            fill="#F7C99D"
            stroke="#3E3028"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="30" r="4" fill="#F57923" stroke="#3E3028" strokeWidth="1.8" />
          <path d="M32 34V39" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'verification':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <circle cx="29" cy="29" r="11" fill="#F6B36A" fillOpacity="0.45" stroke="#3E3028" strokeWidth="2" />
          <path d="M37 37L46 46" stroke="#3E3028" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M24 29L27.5 32.5L34.5 25.5" stroke="#F57923" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'agreements':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <rect x="19" y="16" width="26" height="32" rx="5" fill="#F7C99D" stroke="#3E3028" strokeWidth="2" />
          <path d="M25 26H39" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 33H36" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
          <circle cx="39" cy="40" r="4.5" fill="#F57923" stroke="#3E3028" strokeWidth="1.6" />
        </svg>
      );
    case 'interactive':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <rect x="15" y="19" width="34" height="26" rx="5" fill="#F7C99D" stroke="#3E3028" strokeWidth="2" />
          <path d="M28 27L38 32L28 37V27Z" fill="#F57923" stroke="#3E3028" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'declaration':
      return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="w-12 h-12">
          <circle cx="32" cy="32" r="28" fill="#FAF7F0" stroke="#F7C99D" strokeWidth="1.5" />
          <path
            d="M21 15H37L44 22V48C44 49.1 43.1 50 42 50H21C19.9 50 19 49.1 19 48V17C19 15.9 19.9 15 21 15Z"
            fill="#F6B36A"
            fillOpacity="0.65"
            stroke="#3E3028"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M37 15V22H44" stroke="#3E3028" strokeWidth="2" strokeLinejoin="round" />
          <path d="M25 30H38" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 36H38" stroke="#3E3028" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 42H33" stroke="#F57923" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export function ResilientImage({
  src,
  alt,
  className = '',
  containerClassName = '',
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF0DE] via-[#FAF7F0] to-[#F7C99D]/50 text-[#3E3028] p-6 text-center ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <BotanicalSprig className="w-16 h-16 mb-2 opacity-80" />
        <p className="text-xs font-medium text-[#6C584C] max-w-[20ch]">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
