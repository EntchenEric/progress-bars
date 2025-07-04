import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const color = searchParams.get('color') || '#3b82f6';
  const colorGradient = searchParams.get('colorGradient');
  const backgroundColor = searchParams.get('backgroundColor') || '#e5e7eb';
  const progress = parseIntSafe(searchParams.get('progress'), 65);
  const height = Math.min(500, Math.max(5, parseIntSafe(searchParams.get('height'), 24)));
  const width = Math.min(3000, Math.max(10, parseIntSafe(searchParams.get('width'), 400)));
  const borderRadius = Math.min(1000, Math.max(0, parseIntSafe(searchParams.get('borderRadius'), 12)));
  const striped = searchParams.get('striped') === 'true';
  const animated = searchParams.get('animated') === 'true';
  const animationSpeed = parseFloatSafe(searchParams.get('animationSpeed'), 0);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressWidth = (clampedProgress / 100) * width;
  const safeAnimationSpeed = Math.max(animationSpeed, 0.1);
  
  const animationDuration = Math.pow(1 / safeAnimationSpeed, 2);
  const animationDurationString = animationDuration.toFixed(2);
  
  const stripeSize = Math.max(10, Math.min(40, 20 * safeAnimationSpeed));

  const initialAnimationSpeed = parseFloatSafe(searchParams.get('initialAnimationSpeed'), 1);
  const shouldAnimate = initialAnimationSpeed > 0;
  const initialAnimationDuration = (clampedProgress / 100) * (1 / initialAnimationSpeed);
  
  const createGradientDef = () => {
    if (colorGradient) {
      const matches = colorGradient.match(/(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|rgba?\([^)]+\))/g) || [];
      if (matches.length >= 2) {
        return `
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            ${matches.map((color, index) => 
              `<stop offset="${(index * 100) / (matches.length - 1)}%" style="stop-color:${color}; stop-opacity:1" />`
            ).join('\n')}
          </linearGradient>
        `;
      }
    }
    return `
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${color}; stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustColor(color, 15)}; stop-opacity:1" />
      </linearGradient>
    `;
  };

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      ${createGradientDef()}
      
      ${striped ? `
      <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="${stripeSize}" height="${stripeSize}" patternTransform="rotate(45 0 0)">
        <rect width="${stripeSize/2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0.15)" />
        <rect x="${stripeSize/2}" width="${stripeSize/2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0)" />
        ${animated ? `<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${stripeSize} 0" dur="${animationDurationString}s" repeatCount="indefinite" additive="sum" />` : ''}
      </pattern>
      ` : ''}
      
      <clipPath id="progressClip">
        <rect
          width="${progressWidth}"
          height="${height}"
          rx="${Math.min(borderRadius, height/2, progressWidth/2)}"
          ry="${Math.min(borderRadius, height/2, progressWidth/2)}"
        />
      </clipPath>
      
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.2" />
      </filter>
    </defs>
    
    <rect
      width="${width}"
      height="${height}"
      rx="${Math.min(borderRadius, height/2)}"
      ry="${Math.min(borderRadius, height/2)}"
      fill="${backgroundColor}"
      filter="url(#shadow)"
    />
    <g clip-path="url(#progressClip)">
      <rect
        width="${width}"
        height="${height}"
        fill="url(#progressGradient)"
        ${animated && !striped ? 'class="pulse-animated"' : ''}
        ${shouldAnimate ? 'class="initial-animation"' : ''}
      />
      
      ${striped ? `
      <rect
        width="${progressWidth}"
        height="${height}"
        fill="url(#stripePattern)"
        ${shouldAnimate ? 'class="initial-animation"' : ''}
      />
      ` : ''}
    </g>
    
    <rect
      width="${width}"
      height="${height}"
      rx="${borderRadius}"
      ry="${borderRadius}"
      fill="none"
      stroke="${backgroundColor}"
      stroke-width="1"
      opacity="0.5"
    />
    
    <style>
      @keyframes progress-stripes {
        from { background-position: ${50 * safeAnimationSpeed}px 0; }
        to { background-position: 0 0; }
      }
      
      @keyframes initial-fill {
        from { width: 0; }
        to { width: ${progressWidth}px; }
      }
      
      .initial-animation {
        animation: initial-fill ${initialAnimationDuration.toFixed(2)}s ease-out forwards;
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
    </style>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
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

function parseIntSafe(value: string | null, defaultValue: number): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseFloatSafe(value: string | null, defaultValue: number): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
} 