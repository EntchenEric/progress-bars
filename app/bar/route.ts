import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get parameters with defaults
  const color = searchParams.get('color') || '#2563eb';
  const progress = parseInt(searchParams.get('progress') || '0');
  const height = parseInt(searchParams.get('height') || '20');
  const width = parseInt(searchParams.get('width') || '200');
  const borderRadius = parseInt(searchParams.get('borderRadius') || '50');
  const striped = searchParams.get('striped') === 'true';
  const animated = searchParams.get('animated') === 'true';

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Create SVG for the progress bar
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect
      width="${width}"
      height="${height}"
      rx="${borderRadius}"
      ry="${borderRadius}"
      fill="#f3f4f6"
    />
    <rect
      width="${(clampedProgress / 100) * width}"
      height="${height}"
      rx="${borderRadius}"
      ry="${borderRadius}"
      fill="${color}"
      ${striped ? `mask="url(#stripeMask)"` : ''}
      ${animated ? 'class="animated"' : ''}
    />
    ${striped ? `
    <defs>
      <pattern id="stripes" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
        <rect width="10" height="20" fill="rgba(255, 255, 255, 0.15)" />
      </pattern>
      <mask id="stripeMask">
        <rect width="${(clampedProgress / 100) * width}" height="${height}" fill="white" />
        <rect width="${(clampedProgress / 100) * width}" height="${height}" fill="url(#stripes)" />
      </mask>
    </defs>
    ` : ''}
    ${animated ? `
    <style>
      .animated {
        animation: progress-animation 2s linear infinite;
      }
      @keyframes progress-animation {
        0% {
          opacity: 0.8;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.8;
        }
      }
    </style>
    ` : ''}
  </svg>`;

  // Return the SVG with appropriate headers
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
} 