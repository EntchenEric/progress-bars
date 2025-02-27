'use client'
 
import { useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

export default function Home() {
  const searchParams = useSearchParams()

  const color = searchParams.get('color') ?? 'red'
  const backgroundColor = searchParams.get('backgroundColor') ?? 'white'
  const progress = parseInt(searchParams.get('progress') ?? '0')
  const height = parseInt(searchParams.get('height') ?? '20')
  const width = parseInt(searchParams.get('width') ?? '100')
  const borderRadius = parseInt(searchParams.get('borderRadius') ?? '50')

  return (
    <div>
      <Progress 
        value={progress} 
        color={color} 
        backgroundColor={backgroundColor}
        style={{ height: `${height}px`, width: `${width}px`, borderRadius: `${borderRadius}px` }}
      />
    </div>
  );
}
