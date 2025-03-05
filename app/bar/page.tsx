import { Metadata } from 'next';

interface PageProps {
  searchParams: {
    color?: string;
    backgroundColor?: string;
    progress?: string;
    height?: string;
    width?: string;
    borderRadius?: string;
    striped?: string;
    animated?: string;
    animationSpeed?: string;
  };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const progress = parseIntSafe(searchParams.progress, 0);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const title = `Progress Bar - ${clampedProgress}%`;
  const description = `A customizable progress bar showing ${clampedProgress}% completion`;
  const width = Math.min(3000, Math.max(200, parseIntSafe(searchParams.width, 200)));
  const height = Math.min(500, Math.max(50, parseIntSafe(searchParams.height, 50)));

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{
        url: '/bar',
        width,
        height,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/bar'],
    },
  };
}

export default function ProgressBarPage({ searchParams }: PageProps) {
  const color = searchParams.color || '#2563eb';
  const backgroundColor = searchParams.backgroundColor || '#f3f4f6';
  const progress = parseIntSafe(searchParams.progress, 0);
  const height = Math.min(500, Math.max(50, parseIntSafe(searchParams.height, 50)));
  const width = Math.min(3000, Math.max(200, parseIntSafe(searchParams.width, 200)));
  const borderRadius = Math.min(1000, Math.max(0, parseIntSafe(searchParams.borderRadius, 0)));
  const striped = searchParams.striped === 'true';
  const animated = searchParams.animated === 'true';
  const animationSpeed = parseFloatSafe(searchParams.animationSpeed, 0);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressWidth = (clampedProgress / 100) * width;
  const safeAnimationSpeed = Math.max(animationSpeed, 0.1);

  const animationDuration = Math.pow(1 / safeAnimationSpeed, 2);
  const animationDurationString = animationDuration.toFixed(2);

  const stripeSize = Math.max(10, Math.min(40, 20 * safeAnimationSpeed));

  return (
    <svg 
      width={width} 
      height={height} 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: adjustColor(color, 15), stopOpacity: 1 }} />
        </linearGradient>
        
        {striped && (
          <pattern 
            id="stripePattern" 
            patternUnits="userSpaceOnUse" 
            width={stripeSize} 
            height={stripeSize} 
            patternTransform="rotate(45 0 0)"
          >
            <rect width={stripeSize / 2} height={stripeSize} fill="rgba(255, 255, 255, 0.15)" />
            <rect x={stripeSize / 2} width={stripeSize / 2} height={stripeSize} fill="rgba(255, 255, 255, 0)" />
            {animated && (
              <animateTransform 
                attributeName="patternTransform" 
                type="translate" 
                from="0 0" 
                to={`${stripeSize} 0`} 
                dur={`${animationDurationString}s`} 
                repeatCount="indefinite" 
                additive="sum" 
              />
            )}
          </pattern>
        )}
        
        <clipPath id="progressClip">
          <rect
            width={progressWidth}
            height={height}
            rx={Math.min(borderRadius, height / 2, progressWidth / 2)}
            ry={Math.min(borderRadius, height / 2, progressWidth / 2)}
          />
        </clipPath>
        
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
        </filter>
      </defs>
      
      {/* Background */}
      <rect
        width={width}
        height={height}
        rx={Math.min(borderRadius, height / 2)}
        ry={Math.min(borderRadius, height / 2)}
        fill={backgroundColor}
        filter="url(#shadow)"
      />
      
      {/* Progress bar */}
      <g clipPath="url(#progressClip)">
        {/* Main fill */}
        <rect
          width={width}
          height={height}
          fill="url(#progressGradient)"
          className={animated && !striped ? 'pulse-animated' : ''}
        />
        
        {striped && (
          <rect
            width={progressWidth}
            height={height}
            fill="url(#stripePattern)"
          />
        )}
      </g>
      
      {/* Rounded corners overlay */}
      <rect
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth="1"
        opacity="0.5"
      />
      
      <style>
        {`
          @keyframes progress-stripes {
            from { background-position: ${50 * safeAnimationSpeed}px 0; }
            to { background-position: 0 0; }
          }
          
          .progress-animated {
            animation: progress-stripes ${animationDurationString}s linear infinite;
          }
          
          .pulse-animated {
            animation: pulse ${(animationDuration * 1.2).toFixed(2)}s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
        `}
      </style>
    </svg>
  );
}

function adjustColor(color: string, amount: number): string {
  color = color.replace('#', '');

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const newR = Math.min(255, Math.max(0, r + amount));
  const newG = Math.min(255, Math.max(0, g + amount));
  const newB = Math.min(255, Math.max(0, b + amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function parseIntSafe(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseFloatSafe(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
} 