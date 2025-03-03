import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get parameters with defaults
  const color = searchParams.get('color') || '#2563eb';
  const backgroundColor = searchParams.get('backgroundColor') || '#f3f4f6';
  const progress = parseInt(searchParams.get('progress') || '0');
  const height = parseInt(searchParams.get('height') || '20');
  const width = parseInt(searchParams.get('width') || '200');
  const borderRadius = parseInt(searchParams.get('borderRadius') || '10');
  const striped = searchParams.get('striped') === 'true';
  const animated = searchParams.get('animated') === 'true';

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Calculate actual progress width
  const progressWidth = (clampedProgress / 100) * width;
  
  // Create SVG for the progress bar
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${color}; stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustColor(color, 15)}; stop-opacity:1" />
      </linearGradient>
      
      ${striped ? `
      <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="20" height="${height}" patternTransform="rotate(45)">
        <rect width="10" height="${height * 2}" fill="rgba(255, 255, 255, 0.15)" />
      </pattern>
      ` : ''}
      
      <clipPath id="progressClip">
        <rect
          width="${progressWidth}"
          height="${height}"
          rx="${borderRadius}"
          ry="${borderRadius}"
        />
      </clipPath>
      
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.2" />
      </filter>
    </defs>
    
    <!-- Background -->
    <rect
      width="${width}"
      height="${height}"
      rx="${borderRadius}"
      ry="${borderRadius}"
      fill="${backgroundColor}"
      filter="url(#shadow)"
    />
    
    <!-- Progress bar -->
    <g clip-path="url(#progressClip)">
      <!-- Main fill -->
      <rect
        width="${width}"
        height="${height}"
        fill="url(#progressGradient)"
        ${animated && !striped ? 'class="pulse-animated"' : ''}
      />
      
      ${striped ? `
      <!-- Striped overlay -->
      <rect
        width="${width}"
        height="${height}"
        fill="url(#stripePattern)"
        ${animated ? 'class="stripe-animated"' : ''}
      />
      ` : ''}
    </g>
    
    <!-- Rounded corners overlay to ensure proper rounding -->
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
    
    <!-- Animation definitions -->
    <style>
      .pulse-animated {
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0% { opacity: 0.85; }
        50% { opacity: 1; }
        100% { opacity: 0.85; }
      }
      
      .stripe-animated {
        animation: stripe-animation 2s linear infinite;
      }
      @keyframes stripe-animation {
        from { transform: translateX(0); }
        to { transform: translateX(-20px); }
      }
    </style>
  </svg>`;

  // Return the SVG with appropriate headers
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Remove # if present
  color = color.replace('#', '');
  
  // Parse the color
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Adjust brightness
  const newR = Math.min(255, Math.max(0, r + amount));
  const newG = Math.min(255, Math.max(0, g + amount));
  const newB = Math.min(255, Math.max(0, b + amount));
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
} 