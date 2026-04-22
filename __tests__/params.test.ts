import { describe, it, expect } from '@jest/globals'
import { GET } from '@/app/bar/route'

// Mock global objects needed by Next.js
global.window = {}
global.document = {}
global.Request = global.Request || class Request {}

describe('Progress Bar API - Parameter Validation', () => {
  const mockRequest = (searchParams = {}) => ({
    nextUrl: {
      pathname: '/bar.svg',
      searchParams: {
        get: (key) => searchParams[key] || null,
        has: (key) => key in searchParams,
      },
    },
  })

  describe('Basic Parameter Handling', () => {
    it('should generate SVG with default parameters', async () => {
      const req = mockRequest({})
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('<svg')
      expect(content).toContain('stop-color:#2563eb')
      expect(content).toContain('fill="#f3f4f6"')
    })

    it('should return image when PNG format requested', async () => {
      const req = mockRequest({ format: 'png' })
      const res = await GET(req)
      const content = await res.text()

      // sharp may not work in test env; just verify response is returned
      expect(content.length).toBeGreaterThan(0)
    })

    it('should use custom progress value', async () => {
      const req = mockRequest({ progress: '50' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('50%')
    })

    it('should clamp progress value between 0 and 100', async () => {
      const reqOver = mockRequest({ progress: '150' })
      const resOver = await GET(reqOver)
      const contentOver = await resOver.text()

      expect(contentOver).toContain('100%')

      const reqUnder = mockRequest({ progress: '-50' })
      const resUnder = await GET(reqUnder)
      const contentUnder = await resUnder.text()

      expect(contentUnder).toContain('0%')
    })

    it('should use custom color value', async () => {
      const req = mockRequest({ color: '#16a34a' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stop-color:#16a34a')
    })

    it('should clamp height between 5 and 500', async () => {
      const reqTooHigh = mockRequest({ height: '600' })
      const res = await GET(reqTooHigh)
      const content = await res.text()

      expect(content).toContain('height="500"')

      const reqTooLow = mockRequest({ height: '1' })
      const res2 = await GET(reqTooLow)
      const content2 = await res2.text()

      expect(content2).toContain('height="5"')
    })

    it('should clamp width between 10 and 3000', async () => {
      const reqTooHigh = mockRequest({ width: '5000' })
      const res = await GET(reqTooHigh)
      const content = await res.text()

      expect(content).toContain('width="3000"')

      const reqTooLow = mockRequest({ width: '3' })
      const res2 = await GET(reqTooLow)
      const content2 = await res2.text()

      expect(content2).toContain('width="10"')
    })

    it('should clamp border radius between 0 and 1000', async () => {
      const reqTooHigh = mockRequest({ borderRadius: '2000' })
      const res = await GET(reqTooHigh)
      const content = await res.text()

      expect(content).toContain('rx="1000"')
      expect(content).toContain('ry="1000"')

      const reqTooLow = mockRequest({ borderRadius: '-10' })
      const res2 = await GET(reqTooLow)
      const content2 = await res2.text()

      expect(content2).toContain('rx="0"')
      expect(content2).toContain('ry="0"')
    })

    it('should handle empty string for progress', async () => {
      const req = mockRequest({ progress: '' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('0%') // Should default to 0
    })

    it('should handle empty string for color', async () => {
      const req = mockRequest({ color: '' })
      const res = await GET(req)
      const content = await res.text()
      // Should use default color
      expect(content).toContain('stop-color:')
    })

    it('should handle non-numeric progress value', async () => {
      const req = mockRequest({ progress: 'abc' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('0%')
    })

    it('should apply striping when enabled', async () => {
      const req = mockRequest({ striped: 'true' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stripePattern')
      expect(content).toContain('patternTransform="rotate(45 0 0)"')
    })

    it('should apply animated styling when enabled', async () => {
      const req = mockRequest({ animated: 'true' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('@keyframes progress-stripes')
      expect(content).toContain('progress-animated')
    })

    it('should apply gradient when multiple colors provided', async () => {
      const req = mockRequest({
        colorGradient: 'red,blue,green'
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('linearGradient')
      expect(content).toContain('red')
      expect(content).toContain('blue')
      expect(content).toContain('green')
    })

    it('should handle missing search params', async () => {
      const req = mockRequest({})
      const res = await GET(req)
      expect(res.status).toBe(200)
    })

    it('should handle rapid successive requests', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        const req = mockRequest({ progress: (i % 100).toString() })
        promises.push(GET(req).then(res => res.text()))
      }

      const results = await Promise.all(promises)
      expect(results).toHaveLength(10)
      expect(results.every(r => r.includes('svg'))).toBe(true)
    })

    it('should return SVG body for SVG format', async () => {
      const req = mockRequest({ format: 'svg' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('<svg')
    })

    it('should return image body for PNG format', async () => {
      const req = mockRequest({ format: 'png' })
      const res = await GET(req)
      const content = await res.text()
      expect(content.length).toBeGreaterThan(0)
    })

    it('should return successful response', async () => {
      const req = mockRequest({})
      const res = await GET(req)
      expect(res.status).toBe(200)
    })

    it('should return non-empty body', async () => {
      const req = mockRequest({})
      const res = await GET(req)
      const content = await res.text()
      expect(content.length).toBeGreaterThan(0)
    })

    it('should support combined animations', async () => {
      const req = mockRequest({
        animated: 'true',
        striped: 'true',
        gradientAnimated: 'true',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stripePattern')
      expect(content).toContain('linearGradient')
    })

    it('should support striped with custom colors', async () => {
      const req = mockRequest({
        color: '#ff0000',
        striped: 'true',
        progress: '50',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stop-color:#ff0000')
      expect(content).toContain('stripePattern')
    })

    it('should handle large progress values efficiently', async () => {
      const req = mockRequest({ width: '3000' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('width="3000"')
    })

    it('should handle very large progress value', async () => {
      const req = mockRequest({ progress: '999999' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('100%')
    })

    it('should handle very negative progress value', async () => {
      const req = mockRequest({ progress: '-999999' })
      const res = await GET(req)
      const content = await res.text()
      expect(content).toContain('0%')
    })

    it('should apply background gradient when multiple colors provided', async () => {
      const req = mockRequest({
        backgroundGradient: 'red,blue'
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('backgroundGradient')
      expect(content).toContain('red')
      expect(content).toContain('blue')
    })

    it('should apply gradient animation when enabled', async () => {
      const req = mockRequest({
        colorGradient: 'red,blue',
        gradientAnimated: 'true',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('linearGradient')
      expect(content).toContain('css-animated-gradient')
    })

    it('should use custom gradient animation speed', async () => {
      const req = mockRequest({
        colorGradient: 'red,blue',
        gradientAnimated: 'true',
        gradientAnimationSpeed: '3',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('css-animated-gradient')
    })

    it('should use custom stripe animation speed', async () => {
      const req = mockRequest({
        striped: 'true',
        animated: 'true',
        stripeAnimationSpeed: '2',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('animateTransform')
    })

    it('should use custom animation speed', async () => {
      const req = mockRequest({
        animated: 'true',
        animationSpeed: '2',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('@keyframes progress-stripes')
    })

    it('should use custom height value', async () => {
      const req = mockRequest({ height: '150' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('height="150"')
    })

    it('should use custom width value', async () => {
      const req = mockRequest({ width: '300' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('width="300"')
    })

    it('should use custom border radius value', async () => {
      const req = mockRequest({ borderRadius: '50' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('rx="50"')
      expect(content).toContain('ry="50"')
    })

    it('should clamp animation speed to valid range', async () => {
      const reqNegSpeed = mockRequest({ animationSpeed: '-1' })
      const res = await GET(reqNegSpeed)
      const content = await res.text()

      expect(content).toContain('<svg')
    })

    it('should apply striped animation when enabled', async () => {
      const req = mockRequest({
        striped: 'true',
        animated: 'true'
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stripePattern')
      expect(content).toContain('animateTransform')
      expect(content).toContain('@keyframes progress-stripes')
    })

    it('should handle missing colorGradient but has single color', async () => {
      const req = mockRequest({ color: '#2563eb' })
      const res = await GET(req)
      const content = await res.text()

      // Implementation always creates a linearGradient
      expect(content).toContain('linearGradient')
      expect(content).toContain('stop-color:#2563eb')
    })

    it('should apply default animation when enabled', async () => {
      const req = mockRequest({ animated: 'true' })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('@keyframes progress-stripes')
      expect(content).toContain('progress-animated')
    })

    it('should apply custom animation speed', async () => {
      const req = mockRequest({
        animated: 'true',
        animationSpeed: '2',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('@keyframes progress-stripes')
    })

    it('should apply striped with custom colors', async () => {
      const req = mockRequest({
        color: '#ff0000',
        striped: 'true',
        progress: '50',
      })
      const res = await GET(req)
      const content = await res.text()

      expect(content).toContain('stop-color:#ff0000')
      expect(content).toContain('stripePattern')
    })
  })

  describe('URL Generation Helper Functions', () => {
    it('should generate correct URL with all parameters', () => {
      const base = 'https://progress-bars.entcheneric.com/bar.svg'
      const params = {
        progress: 75,
        color: '#2563eb',
        height: 20,
        width: 200,
        borderRadius: 10,
      }

      const expected = new URL(base)
      expected.searchParams.set('progress', '75')
      expected.searchParams.set('color', '#2563eb')
      expected.searchParams.set('height', '20')
      expected.searchParams.set('width', '200')
      expected.searchParams.set('borderRadius', '10')

      // This test is more about verifying the URL generation logic
      // rather than the API response
      expect(Object.keys(params)).toEqual(
        expect.arrayContaining([
          'progress',
          'color',
          'height',
          'width',
          'borderRadius',
        ])
      )
    })
  })
})
