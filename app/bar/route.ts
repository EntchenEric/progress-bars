import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles GET requests to generate a customizable SVG progress bar image.
 *
 * Extracts query parameters from the request URL to configure the progress bar's appearance, including color, gradient, background, progress value, dimensions, border radius, striped and animated effects, and animation speeds. Returns an SVG image as the response.
 *
 * @returns A `NextResponse` containing the generated SVG progress bar with appropriate headers.
 */
const MAX_GRADIENT_LENGTH = 2000;

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
  const shouldAnimate = initialAnimationSpeed > 0;
  const initialAnimationDuration = (clampedProgress / 100) * (1 / initialAnimationSpeed);

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

  // Create CSS compatible linear-gradient string for foreignObject
  let cssGradient = '';
  if (safeColorGradientParts.length >= 2) {
    // We append the first color to the end so it loops seamlessly in CSS background panning
    cssGradient = `linear-gradient(90deg, ${safeColorGradientParts.join(', ')}, ${safeColorGradientParts[0]})`;
  }
  if (!cssGradient) {
    cssGradient = `linear-gradient(90deg, ${safeColor}, ${adjustColor(safeColor, 15)}, ${safeColor})`;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      ${createGradientDef()}
      
      ${striped ? `
      <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="${stripeSize}" height="${stripeSize}" patternTransform="rotate(45 0 0)">
        <rect width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0.15)" />
        <rect x="${stripeSize / 2}" width="${stripeSize / 2}" height="${stripeSize}" fill="rgba(255, 255, 255, 0)" />
        ${animated ? `<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${stripeSize} 0" dur="${stripeAnimationDurationString}s" repeatCount="indefinite" additive="sum" />` : ''}
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
      ${gradientAnimated ? `
      <foreignObject width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
          <div class="css-animated-gradient ${animated && !striped ? 'pulse-animated' : ''} ${shouldAnimate ? 'initial-animation' : ''}" style="width: 100%; height: 100%; background: ${cssGradient};"></div>
        </div>
      </foreignObject>
      ` : `
      <rect
        width="${width}"
        height="${height}"
        fill="url(#progressGradient)"
        ${animated && !striped ? 'class="pulse-animated"' : ''}
        ${shouldAnimate ? 'class="initial-animation"' : ''}
      />
      `}
      
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
      stroke="${safeBackgroundGradientParts.length >= 1 ? safeBackgroundGradientParts[0] : safeBackgroundColor}"
      stroke-width="1"
      opacity="0.5"
    />
    
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
  </svg>`;

  const format = searchParams.get('_format') || 'svg';

  if (format === 'png') {
    return new NextResponse('PNG conversion is not supported. Please use the .svg extension.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    });
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
 *
 * @param color - A hex color string in the format `#RRGGBB`.
 * @param amount - The integer value to add to each RGB channel; positive to lighten, negative to darken.
 * @returns The adjusted hex color string.
 *
 * @remark If the adjustment causes a channel to exceed 255 or drop below 0, it is clamped to the valid range.
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
 * Safely parses a string as an integer, returning a default value if parsing fails.
 *
 * @param value - The string to parse.
 * @param defaultValue - The value to return if {@link value} is null, empty, or not a valid integer.
 * @returns The parsed integer, or {@link defaultValue} if parsing is unsuccessful.
 */
function parseIntSafe(value: string | null, defaultValue: number): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parses a string as a floating-point number, returning a default value if parsing fails.
 *
 * @param value - The string to parse.
 * @param defaultValue - The value to return if {@link value} is null, empty, or not a valid number.
 * @returns The parsed floating-point number, or {@link defaultValue} if parsing is unsuccessful.
 */
function parseFloatSafe(value: string | null, defaultValue: number): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validates if the given string is a valid CSS color format.
 * Accepts hex (#RGB, #RRGGBB, #RGBA, #RRGGBBAA), whitelisted names, or strict rgba().
 * 
 * @param color - The color string to validate.
 * @returns True if the color is valid, false otherwise.
 */
function isValidColor(color: string | null): boolean {
  if (!color) return false;

  // 1. Strict Hex Regex (#RGB, #RRGGBB)
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  if (hexRegex.test(color)) return true;

  // 2. CSS Color Name Whitelist
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

  // 3. Strict RGB/RGBA Regex (0-255 for RGB, 0-1 for alpha)
  const rgbPart = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)';
  const alphaPart = '(?:0(?:\\.\\d+)?|1(?:\\.0+)?|\\.\\d+)';
  const rgbaRegex = new RegExp(`^rgba?\\(\\s*${rgbPart}\\s*,\\s*${rgbPart}\\s*,\\s*${rgbPart}\\s*(?:,\\s*${alphaPart}\\s*)?\\)$`, 'i');

  return rgbaRegex.test(color);
}

/**
 * Safely extracts valid CSS colors from a string.
 * Uses a manual parser to avoid ReDoS and handle nested commas in color functions.
 * Strips dangerous characters from each part.
 * 
 * @param input - The gradient string to parse.
 * @returns An array of validated color strings.
 */
function extractColors(input: string | null): string[] {
  if (!input || input.length > MAX_GRADIENT_LENGTH) {
    return [];
  }

  const results: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '(') depth++;
    if (char === ')') depth--;

    if (char === ',' && depth === 0) {
      const sanitized = current.trim().replace(/[<>"';]/g, '');
      if (isValidColor(sanitized)) {
        results.push(sanitized);
      }
      current = '';
    } else {
      current += char;
    }
  }

  const finalSanitized = current.trim().replace(/[<>"';]/g, '');
  if (isValidColor(finalSanitized)) {
    results.push(finalSanitized);
  }

  return results;
}

