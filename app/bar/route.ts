import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_GRADIENT_LENGTH = 2000;

/**
 * Handles POST requests to generate a customizable progress bar image (SVG or PNG) from JSON body.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid JSON',
          details: 'Request body must be valid JSON',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Validate that body is an object
    if (body === null || typeof body !== 'object') {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid input',
          details: 'Request body must be a JSON object',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Extract and validate parameters from body
    const input = body as {
      progress?: number | string;
      color?: string;
      colorGradient?: string;
      backgroundColor?: string;
      backgroundGradient?: string;
      height?: number | string;
      width?: number | string;
      borderRadius?: number | string;
      format?: 'svg' | 'png' | 'image/svg+xml' | 'image/png';
      striped?: boolean | string;
      animated?: boolean | string;
      gradientAnimated?: boolean | string;
      animationSpeed?: number | string;
      stripeAnimationSpeed?: number | string;
      gradientAnimationSpeed?: number | string;
      initialAnimationSpeed?: number | string;
    };

    // Parse and validate progress
    const progressValue = input.progress ?? 0;
    if (typeof progressValue === 'string') {
      if (!/^-?[0-9]+\.?[0-9]*$/.test(progressValue.trim())) {
        return new NextResponse(
          JSON.stringify({
            error: 'Invalid progress value',
            details: 'Progress must be a number between 0 and 100',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }
    }
    const progress = Math.min(Math.max(parseFloat(progressValue as string) || 0, 0), 100);
    const widthValue = input.width ?? 10;
    const width = Math.min(3000, Math.max(10, typeof widthValue === 'string' ? parseInt(widthValue, 10) || 10 : widthValue));
    const progressWidth = (progress / 100) * width;

    // Parse and validate color
    const colorValue = input.color ?? '#2563eb';
    const sanitize = (val: string) => val ? val.replace(/[<>"';]/g, '') : '#2563eb';
    const safeColor = isValidColor(sanitize(colorValue as string)) ? sanitize(colorValue as string) : '#2563eb';

    // Parse and validate backgroundColor
    const backgroundColorValue = input.backgroundColor ?? '#f3f4f6';
    const safeBackgroundColor = isValidColor(sanitize(backgroundColorValue as string)) ? sanitize(backgroundColorValue as string) : '#f3f4f6';

    // Parse and validate colorGradient
    const colorGradientParts = extractColors(sanitize(input.colorGradient as string ?? null));
    const safeColorGradientParts = colorGradientParts.filter((c: string) => isValidColor(c));

    // Parse and validate backgroundGradient
    const backgroundGradientParts = extractColors(sanitize(input.backgroundGradient as string ?? null));
    const safeBackgroundGradientParts = backgroundGradientParts.filter((c: string) => isValidColor(c));

    // Parse and validate dimensions
    const heightValue = input.height ?? 10;
    const height = Math.min(500, Math.max(5, typeof heightValue === 'string' ? parseInt(heightValue, 10) || 5 : heightValue));

    const borderRadiusValue = input.borderRadius ?? 10;
    const borderRadius = Math.min(1000, Math.max(0, typeof borderRadiusValue === 'string' ? parseInt(borderRadiusValue, 10) || 10 : borderRadiusValue));

    // Detect format
    const formatValue = input.format ?? 'svg';
    const format = (formatValue as string).toLowerCase() === 'png' ? 'png' : 'svg';
    const isStatic = format === 'png';

    // Parse and validate boolean flags
    const striped = (input.striped ?? false) === true || (input.striped ?? false) === 'true';
    const animated = (input.animated ?? false) === true || (input.animated ?? false) === 'true';
    const gradientAnimated = (input.gradientAnimated ?? false) === true || (input.gradientAnimated ?? false) === 'true';

    // Parse and validate animation speeds
    const animationSpeedValue = input.animationSpeed ?? 1;
    const animationSpeed = typeof animationSpeedValue === 'string' ? parseFloat(animationSpeedValue) || 1 : animationSpeedValue;

    const stripeAnimationSpeedValue = input.stripeAnimationSpeed ?? animationSpeed;
    const stripeAnimationSpeed = typeof stripeAnimationSpeedValue === 'string' ? parseFloat(stripeAnimationSpeedValue) || animationSpeed : stripeAnimationSpeedValue;
    const safeStripeAnimationSpeed = Math.max(stripeAnimationSpeed, 0.1);

    const gradientAnimationSpeedValue = input.gradientAnimationSpeed ?? animationSpeed;
    const gradientAnimationSpeed = typeof gradientAnimationSpeedValue === 'string' ? parseFloat(gradientAnimationSpeedValue) || animationSpeed : gradientAnimationSpeedValue;
    const safeGradientAnimationSpeed = Math.max(gradientAnimationSpeed, 0.1);

    const stripeAnimationDuration = Math.pow(1 / safeStripeAnimationSpeed, 2);
    const stripeAnimationDurationString = stripeAnimationDuration.toFixed(2);

    const gradientAnimationDuration = Math.pow(1 / safeGradientAnimationSpeed, 2);
    const gradientAnimationDurationString = gradientAnimationDuration.toFixed(2);

    const stripeSize = Math.max(10, Math.min(40, 20 * safeStripeAnimationSpeed));

    const initialAnimationSpeedValue = input.initialAnimationSpeed ?? 1;
    const initialAnimationSpeed = typeof initialAnimationSpeedValue === 'string' ? parseFloat(initialAnimationSpeedValue) || 1 : initialAnimationSpeedValue;
    const shouldAnimate = !isStatic && initialAnimationSpeed > 0;
    const initialAnimationDuration = (progress / 100) * (1 / initialAnimationSpeed);

    const finalAnimated = !isStatic && animated;
    const finalGradientAnimated = !isStatic && gradientAnimated;
    const finalStriped = striped;

    // Create gradient definitions
    const createGradientDef = () => {
      let gradientInner = '';
      if (safeColorGradientParts.length >= 2) {
        gradientInner = safeColorGradientParts.map((c: string, index: number) =>
          `<stop offset="${(index * 100) / (safeColorGradientParts.length - 1)}%" style="stop-color:${c}; stop-opacity:1" />`
        ).join('\n');
      }

      if (!gradientInner) {
        gradientInner = `
          <stop offset="0%" style="stop-color:${safeColor}; stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(safeColor, 15)}; stop-opacity:1" />
        `;
      }

      let defs = `
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          ${gradientInner}
        </linearGradient>
      `;

      return defs;
    };

    const createBackgroundGradientDef = () => {
      if (safeBackgroundGradientParts.length < 2) return '';
      const gradientInner = safeBackgroundGradientParts.map((color, index) =>
        `<stop offset="${(index * 100) / (safeBackgroundGradientParts.length - 1)}%" style="stop-color:${color}; stop-opacity:1" />`
      ).join('\n');

      return `
        <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          ${gradientInner}
        </linearGradient>
      `;
    };

    let cssGradient = '';
    if (safeColorGradientParts.length >= 2) {
      cssGradient = `linear-gradient(90deg, ${safeColorGradientParts.join(', ')}, ${safeColorGradientParts[0]})`;
    }
    if (!cssGradient) {
      cssGradient = `linear-gradient(90deg, ${safeColor}, ${adjustColor(safeColor, 15)}, ${safeColor})`;
    }

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        ${createGradientDef()}

        ${finalStriped ? `
        <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="${stripeSize}" height="${stripeSize}" patternTransform="rotate(45 0 0)">
          <rect width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0.15)" />
          <rect x="${stripeSize / 2}" width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0)" />
          ${finalAnimated ? `<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${stripeSize} 0" dur="${stripeAnimationDurationString}s" repeatCount="indefinite" additive="sum" />` : ''}
        </pattern>
        ` : ''}

        <clipPath id="progressClip">
          <rect
            width="${progressWidth}"
            height="${height}"
            rx="${Math.min(borderRadius, height / 2, progressWidth / 2)}"
            ry="${Math.min(borderRadius, height / 2, progressWidth / 2)}"
          />
        </clipPath>

        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.2" />
        </filter>

        ${createBackgroundGradientDef()}
      </defs>

      <rect
        width="${width}"
        height="${height}"
        rx="${Math.min(borderRadius, height / 2)}"
        ry="${Math.min(borderRadius, height / 2)}"
        fill="${safeBackgroundGradientParts.length >= 2 ? 'url(#backgroundGradient)' : safeBackgroundColor}"
        filter="url(#shadow)"
      />
      <g clip-path="url(#progressClip)">
        ${finalGradientAnimated ? `
        <foreignObject width="${width}" height="${height}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
            <div class="css-animated-gradient ${finalAnimated && !finalStriped ? 'pulse-animated' : ''} ${shouldAnimate ? 'initial-animation' : ''}" style="width: 100%; height: 100%; background: ${cssGradient};"></div>
          </div>
        </foreignObject>
        ` : `
        <rect
          width="${isStatic ? progressWidth : width}"
          height="${height}"
          fill="url(#progressGradient)"
          ${finalAnimated && !finalStriped ? 'class="pulse-animated"' : ''}
          ${shouldAnimate ? 'class="initial-animation"' : ''}
        />
        `}

        ${finalStriped ? `
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
        stroke="${safeBackgroundGradientParts.length >= 1 ? safeBackgroundGradientParts[0] : safeBackgroundColor}"
        stroke-width="1"
        opacity="0.5"
      />

      ${isStatic ? '' : `
      <style>
        @keyframes progress-stripes {
          from { background-position: ${50 * safeStripeAnimationSpeed}px 0; }
          to { background-position: 0 0; }
        }

        @keyframes css-gradient-pan {
          0% { background-position: 0 0; }
          100% { background-position: -${width}px 0; }
        }

        .css-animated-gradient {
          background-size: 100% 100% !important;
          animation: css-gradient-pan ${parseFloat(gradientAnimationDurationString) * 2}s linear infinite !important;
        }

        @keyframes initial-fill {
          from { width: 0; }
          to { width: ${progressWidth}px; }
        }

        .initial-animation {
          animation: initial-fill ${initialAnimationDuration.toFixed(2)}s ease-out forwards;
        }

        .progress-animated {
          animation: progress-stripes ${stripeAnimationDurationString}s linear infinite;
        }

        .pulse-animated {
          animation: pulse ${(gradientAnimationDuration * 1.2).toFixed(2)}s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      </style>
      `}
    </svg>`;

    if (format === 'png') {
      try {
        const pngBuffer = await sharp(Buffer.from(svg))
          .png()
          .toBuffer();

        return new NextResponse(new Uint8Array(pngBuffer), {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=60',
          },
        });
      } catch (error) {
        console.error('PNG conversion error:', error);
        return new NextResponse('Error generating PNG image', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('POST error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

/**
 * Handles GET requests to generate a customizable progress bar image (SVG or PNG).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const color = searchParams.get('color') || '#2563eb';
  const colorGradient = searchParams.get('colorGradient');
  const backgroundColor = searchParams.get('backgroundColor') || '#f3f4f6';
  const backgroundGradient = searchParams.get('backgroundGradient');

  // Sanitize and validate inputs
  const sanitize = (val: string | null) => val ? val.replace(/[<>"';]/g, '') : '';

  const safeColor = isValidColor(sanitize(color)) ? sanitize(color) : '#2563eb';
  const safeBackgroundColor = isValidColor(sanitize(backgroundColor)) ? sanitize(backgroundColor) : '#f3f4f6';

  const safeColorGradientParts = extractColors(colorGradient);
  const safeBackgroundGradientParts = extractColors(backgroundGradient);

  const progress = parseIntSafe(searchParams.get('progress'), 0);
  const height = Math.min(500, Math.max(5, parseIntSafe(searchParams.get('height'), 5)));
  const width = Math.min(3000, Math.max(10, parseIntSafe(searchParams.get('width'), 10)));
  const borderRadius = Math.min(1000, Math.max(0, parseIntSafe(searchParams.get('borderRadius'), 10)));

  // Detect format from query param or extension
  const formatQuery = searchParams.get('_format');
  const pathname = request.nextUrl.pathname;
  let format = 'svg';

  if (formatQuery) {
    format = formatQuery.toLowerCase();
  } else if (pathname.endsWith('.png')) {
    format = 'png';
  } else if (pathname.endsWith('.svg')) {
    format = 'svg';
  }

  const isStatic = format === 'png';

  const striped = searchParams.get('striped') === 'true';
  const animated = searchParams.get('animated') === 'true';
  const gradientAnimated = searchParams.get('gradientAnimated') === 'true';
  const animationSpeed = parseFloatSafe(searchParams.get('animationSpeed'), 1);
  const stripeAnimationSpeed = parseFloatSafe(searchParams.get('stripeAnimationSpeed'), animationSpeed);
  const gradientAnimationSpeed = parseFloatSafe(searchParams.get('gradientAnimationSpeed'), animationSpeed);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressWidth = (clampedProgress / 100) * width;

  const safeStripeAnimationSpeed = Math.max(stripeAnimationSpeed, 0.1);
  const safeGradientAnimationSpeed = Math.max(gradientAnimationSpeed, 0.1);

  const stripeAnimationDuration = Math.pow(1 / safeStripeAnimationSpeed, 2);
  const stripeAnimationDurationString = stripeAnimationDuration.toFixed(2);

  const gradientAnimationDuration = Math.pow(1 / safeGradientAnimationSpeed, 2);
  const gradientAnimationDurationString = gradientAnimationDuration.toFixed(2);

  const stripeSize = Math.max(10, Math.min(40, 20 * safeStripeAnimationSpeed));

  const initialAnimationSpeed = parseFloatSafe(searchParams.get('initialAnimationSpeed'), 1);
  const shouldAnimate = !isStatic && initialAnimationSpeed > 0;
  const initialAnimationDuration = (clampedProgress / 100) * (1 / initialAnimationSpeed);

  const finalAnimated = !isStatic && animated;
  const finalGradientAnimated = !isStatic && gradientAnimated;
  const finalStriped = striped;

  const createGradientDef = () => {
    let gradientInner = '';
    if (safeColorGradientParts.length >= 2) {
      gradientInner = safeColorGradientParts.map((c: string, index: number) =>
        `<stop offset="${(index * 100) / (safeColorGradientParts.length - 1)}%" style="stop-color:${c}; stop-opacity:1" />`
      ).join('\n');
    }

    if (!gradientInner) {
      gradientInner = `
        <stop offset="0%" style="stop-color:${safeColor}; stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustColor(safeColor, 15)}; stop-opacity:1" />
      `;
    }

    let defs = `
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        ${gradientInner}
      </linearGradient>
    `;

    return defs;
  };

  const createBackgroundGradientDef = () => {
    if (safeBackgroundGradientParts.length < 2) return '';
    const gradientInner = safeBackgroundGradientParts.map((color, index) =>
      `<stop offset="${(index * 100) / (safeBackgroundGradientParts.length - 1)}%" style="stop-color:${color}; stop-opacity:1" />`
    ).join('\n');

    return `
      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        ${gradientInner}
      </linearGradient>
    `;
  };

  let cssGradient = '';
  if (safeColorGradientParts.length >= 2) {
    cssGradient = `linear-gradient(90deg, ${safeColorGradientParts.join(', ')}, ${safeColorGradientParts[0]})`;
  }
  if (!cssGradient) {
    cssGradient = `linear-gradient(90deg, ${safeColor}, ${adjustColor(safeColor, 15)}, ${safeColor})`;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      ${createGradientDef()}

      ${finalStriped ? `
      <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="${stripeSize}" height="${stripeSize}" patternTransform="rotate(45 0 0)">
        <rect width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0.15)" />
        <rect x="${stripeSize / 2}" width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0)" />
        ${finalAnimated ? `<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${stripeSize} 0" dur="${stripeAnimationDurationString}s" repeatCount="indefinite" additive="sum" />` : ''}
      </pattern>
      ` : ''}

      <clipPath id="progressClip">
        <rect
          width="${progressWidth}"
          height="${height}"
          rx="${Math.min(borderRadius, height / 2, progressWidth / 2)}"
          ry="${Math.min(borderRadius, height / 2, progressWidth / 2)}"
        />
      </clipPath>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.2" />
      </filter>

      ${createBackgroundGradientDef()}
    </defs>

    <rect
      width="${width}"
      height="${height}"
      rx="${Math.min(borderRadius, height / 2)}"
      ry="${Math.min(borderRadius, height / 2)}"
      fill="${safeBackgroundGradientParts.length >= 2 ? 'url(#backgroundGradient)' : safeBackgroundColor}"
      filter="url(#shadow)"
    />
    <g clip-path="url(#progressClip)">
      ${finalGradientAnimated ? `
      <foreignObject width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
          <div class="css-animated-gradient ${finalAnimated && !finalStriped ? 'pulse-animated' : ''} ${shouldAnimate ? 'initial-animation' : ''}" style="width: 100%; height: 100%; background: ${cssGradient};"></div>
        </div>
      </foreignObject>
      ` : `
      <rect
        width="${isStatic ? progressWidth : width}"
        height="${height}"
        fill="url(#progressGradient)"
        ${finalAnimated && !finalStriped ? 'class="pulse-animated"' : ''}
        ${shouldAnimate ? 'class="initial-animation"' : ''}
      />
      `}

      ${finalStriped ? `
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
      stroke="${safeBackgroundGradientParts.length >= 1 ? safeBackgroundGradientParts[0] : safeBackgroundColor}"
      stroke-width="1"
      opacity="0.5"
    />

    ${isStatic ? '' : `
    <style>
      @keyframes progress-stripes {
        from { background-position: ${50 * safeStripeAnimationSpeed}px 0; }
        to { background-position: 0 0; }
      }

      @keyframes css-gradient-pan {
        0% { background-position: 0 0; }
        100% { background-position: -${width}px 0; }
      }

      .css-animated-gradient {
        background-size: 100% 100% !important;
        animation: css-gradient-pan ${parseFloat(gradientAnimationDurationString) * 2}s linear infinite !important;
      }

      @keyframes initial-fill {
        from { width: 0; }
        to { width: ${progressWidth}px; }
      }

      .initial-animation {
        animation: initial-fill ${initialAnimationDuration.toFixed(2)}s ease-out forwards;
      }

      .progress-animated {
        animation: progress-stripes ${stripeAnimationDurationString}s linear infinite;
      }

      .pulse-animated {
        animation: pulse ${(gradientAnimationDuration * 1.2).toFixed(2)}s ease-in-out infinite;
      }

      @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
    </style>
    `}
  </svg>`;

  if (format === 'png') {
    try {
      const pngBuffer = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();

      return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch (error) {
      console.error('PNG conversion error:', error);
      return new NextResponse('Error generating PNG image', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

/**
 * Returns a hex color string with its RGB channels lightened or darkened by a specified amount.
 */
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

/**
 * Safely parses a string as an integer.
 */
function parseIntSafe(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parses a string as a float.
 */
function parseFloatSafe(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validates CSS colors.
 */
function isValidColor(color: string | null): boolean {
  if (!color) return false;
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  if (hexRegex.test(color)) return true;
  const ALLOWED_COLOR_NAMES = new Set([
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond',
    'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue',
    'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
    'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
    'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
    'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
    'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink',
    'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
    'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink',
    'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue',
    'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue',
    'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
    'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace',
    'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
    'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple',
    'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
    'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan',
    'teal', 'thistle', 'tomato', 'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke',
    'yellow', 'yellowgreen'
  ]);
  if (ALLOWED_COLOR_NAMES.has(color.toLowerCase())) return true;
  const rgbPart = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)';
  const alphaPart = '(?:0(?:\\.\\d+)?|1(?:\\.0+)?|\\.\\d+)';
  const rgbaRegex = new RegExp(`^rgba?\\(\\s*${rgbPart}\\s*,\\s*${rgbPart}\\s*,\\s*${rgbPart}\\s*(?:,\\s*${alphaPart}\\s*)?\\)$`, 'i');
  return rgbaRegex.test(color);
}

/**
 * Extracts colors from gradient string.
 */
function extractColors(input: string | null): string[] {
  if (!input || input.length > MAX_GRADIENT_LENGTH) return [];
  const results: string[] = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      const sanitized = current.trim().replace(/[<>"';]/g, '');
      if (isValidColor(sanitized)) results.push(sanitized);
      current = '';
    } else {
      current += char;
    }
  }
  const finalSanitized = current.trim().replace(/[<>"';]/g, '');
  if (isValidColor(finalSanitized)) results.push(finalSanitized);
  return results;
}
