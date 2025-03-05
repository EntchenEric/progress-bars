import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const progress = parseInt(searchParams.get('progress') || '0');
  const color = searchParams.get('color') || '#2563eb';
  const backgroundColor = searchParams.get('backgroundColor') || '#f3f4f6';
  const height = Math.min(500, Math.max(50, parseInt(searchParams.get('height') || '50')));
  const width = Math.min(3000, Math.max(200, parseInt(searchParams.get('width') || '200')));
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: backgroundColor,
          width: '100%',
          height: '100%',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: backgroundColor,
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${progress}%`,
              height: '100%',
              background: color,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  )
} 