/**
 * @jest-environment jsdom
 */

global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = new Map();
    for (const [key, value] of Object.entries(init)) {
      this._headers.set(key.toLowerCase(), value);
    }
  }

  get(key) {
    return this._headers.get(key.toLowerCase());
  }

  set(key, value) {
    this._headers.set(key.toLowerCase(), value);
  }
};

jest.mock('next/server', () => {
  class MockNextResponse {
    constructor(body, init = {}) {
      this.body = body;
      this.headers = new Headers(init.headers || {});
      this.cookies = new Map();
    }

    text() {
      return Promise.resolve(this.body);
    }
  }

  return {
    NextResponse: MockNextResponse
  };
});

global.window = undefined;
global.document = undefined;

describe('GET /bar', () => {
  const createMockRequest = (searchParams = {}) => ({
    nextUrl: {
      searchParams: {
        get: (key) => searchParams[key],
      }
    }
  });

  it('returns an SVG with default parameters', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({});
    const res = await GET(req);
    const content = await res.text();

    expect(res.headers.get('content-type')).toBe('image/svg+xml');
    expect(content).toContain('<svg');
    expect(content).toContain('stop-color:#2563eb');
    expect(content).toContain('fill="#f3f4f6"');
  });

  it('returns an SVG with custom parameters', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      progress: '50',
      color: '#16a34a',
      height: '100',
      width: '200'
    });
    const res = await GET(req);
    const content = await res.text();

    expect(content).toContain('width="200"');
    expect(content).toContain('height="100"');
    expect(content).toContain('stop-color:#16a34a');
  });

  it('handles invalid parameters gracefully', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      progress: 'invalid',
      height: 'invalid',
      width: 'invalid'
    });
    const res = await GET(req);
    const content = await res.text();

    expect(content).toContain('width="10"');
    expect(content).toContain('height="5"');
  });

  it('clamps progress value between 0 and 100', async () => {
    const { GET } = require('../../app/bar/route');
    const reqOver = createMockRequest({ progress: '150' });
    const resOver = await GET(reqOver);
    const contentOver = await resOver.text();
    
    expect(contentOver).toMatch(/width="[^"]*" height="[^"]*"/);

    const reqUnder = createMockRequest({ progress: '-50' });
    const resUnder = await GET(reqUnder);
    const contentUnder = await resUnder.text();
    
    expect(contentUnder).toMatch(/width="0"/);
  });

  it('handles striped and animated parameters correctly', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      striped: 'true',
      animated: 'true',
      animationSpeed: '2'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('<pattern id="stripePattern"');
    expect(content).toContain('<animateTransform');
    expect(content).toContain('dur="0.25s"');
  });

  it('respects dimension limits', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      height: '1000',
      width: '4000',
      borderRadius: '2000'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('width="3000"');
    expect(content).toContain('height="500"');
    expect(content).toContain('rx="1000"');
  });

  it('handles custom background color', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      backgroundColor: '#ff0000'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('fill="#ff0000"');
  });

  it('validates cache control headers', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({});
    const res = await GET(req);
    
    expect(res.headers.get('cache-control')).toBe('public, max-age=60');
  });

  it('handles empty string parameters correctly', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      progress: '',
      height: '',
      width: '',
      color: '',
      backgroundColor: '',
      borderRadius: '',
      animationSpeed: ''
    });
    const res = await GET(req);
    const content = await res.text();

    expect(content).toContain('width="10"');
    expect(content).toContain('height="5"');
    expect(content).toContain('stop-color:#2563eb');
  });

  it('properly adjusts animation speed limits', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      animated: 'true',
      animationSpeed: '0.01'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toMatch(/animation:[^}]*100\.00s/);
  });

  it('handles various color formats correctly', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      color: '#ABC',
      backgroundColor: '#AABBCC'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('stop-color:#ABC');
    expect(content).toContain('fill="#AABBCC"');
  });

  it('properly calculates progress width based on total width', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      width: '200',
      progress: '50'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toMatch(/<clipPath[^>]*>[^<]*<rect[^>]*width="100"[^>]*>/);
  });

  it('handles border radius with different progress values', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      borderRadius: '20',
      progress: '10',
      width: '200',
      height: '40'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toMatch(/rx="10"/);
  });

  it('generates proper gradient with color adjustment', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      color: '#808080'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('stop-color:#808080');
    expect(content).toMatch(/stop-color:#[8-9][0-9a-f][8-9][0-9a-f][8-9][0-9a-f]/i);
  });

  it('handles combinations of striped, animated, and progress', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      striped: 'true',
      animated: 'true',
      progress: '75',
      animationSpeed: '1.5'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('<pattern id="stripePattern"');
    expect(content).toContain('<animateTransform');
    expect(content).toMatch(/dur="0\.[0-9]+s"/);
    expect(content).toMatch(/width="[^"]*" height="[^"]*"/);
  });

  it('validates SVG structure and required elements', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({});
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('<defs>');
    expect(content).toContain('<linearGradient');
    expect(content).toContain('<filter id="shadow"');
    expect(content).toContain('<style>');
    expect(content).toMatch(/<rect[^>]*filter="url\(#shadow\)"/);
  });

  it('handles null parameter values gracefully', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      progress: null,
      height: null,
      width: null,
      color: null,
      backgroundColor: null,
      borderRadius: null,
      animationSpeed: null,
      striped: null,
      animated: null
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toContain('stop-color:#2563eb');
    expect(content).toContain('fill="#f3f4f6"');
    expect(content).toMatch(/width="10"/);
    expect(content).toMatch(/height="5"/);
  });

  it('enforces minimum size constraints', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      height: '-50',
      width: '-100',
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toMatch(/width="10"/);
    expect(content).toMatch(/height="5"/);

    expect(content).toMatch(/<clipPath[^>]*>[^<]*<rect[^>]*width="0"[^>]*>/);
  });

  it('enforces minimum progress constraints', async () => {
    const { GET } = require('../../app/bar/route');
    const req = createMockRequest({
      progress: '-50'
    });
    const res = await GET(req);
    const content = await res.text();
    
    expect(content).toMatch(/width="10"/);
    expect(content).toMatch(/height="5"/);

    expect(content).toMatch(/<clipPath[^>]*>[^<]*<rect[^>]*width="0"[^>]*>/);
  });
});
