// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

// Mock Headers class with factory
global.Headers = class Headers {
  constructor(init) {
    this._init = init
  }
  get(name) {
    // Mock implementation - returns undefined or the header value
    return this._init?.[name.toLowerCase()] || undefined
  }
  has(name) {
    return this._init?.hasOwnProperty(name.toLowerCase()) || false
  }
  [Symbol.iterator]() {
    return this
  }
  next() {
    return { done: true, value: undefined }
  }
}

// Mock Next.js global Request
global.Request = class Request {}

// Mock Node.js built-in modules before they're used
global.fetch = global.fetch || (() => {
  // Store the real implementation
  const realFetch = global.fetch || (() => null)
  return async (url, options = {}) => {
    try {
      return await realFetch(url, options)
    } catch (e) {
      // If real fetch throws, return a mock response
      if (options.method !== 'GET') {
        throw e
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => (options.body || {}),
        text: async () => options.body || ''
      })
    }
  }
})()

// Mock FormData
global.FormData = class FormData {
  constructor() {
    this.data = {}
  }
  append(name, value) {
    this.data[name] = value
  }
  get(name) {
    return this.data[name]
  }
  getAll(name) {
    return this.data[name] || []
  }
}

// Mock Next.js Response - this must be done before Next.js imports it
class MockResponse {
  constructor(body, init = {}) {
    this._body = body
    this._text = typeof body === 'string' ? body : JSON.stringify(body)
    this.status = init.status || 200
    this.headers = new Headers(init.headers || {})

    // Parse JSON body if it's a valid JSON string
    this._json = (() => {
      if (typeof body === 'string') {
        try {
          const parsed = JSON.parse(body)
          return parsed
        } catch {
          return null
        }
      }
      return body || {}
    })()

    this.getSetCookie = () => []
    this.clone = () => this.clone()
    this.text = async () => this._text
    this.json = async () => {
      const contentType = this.headers.get('Content-Type') || ''
      // Return parsed JSON if available, otherwise return text
      const result = this._json !== null ? this._json : this._text
      console.log('MockResponse.json called', { _json: this._json, _text: this._text, result })
      return result
    }
  }
  clone() {
    const cloned = new MockResponse(this._body, { status: this.status, headers: this.headers })
    cloned._text = this._text
    cloned._json = this._json
    cloned.status = this.status
    return cloned
  }
}

// Override the Response class globally
global.Response = MockResponse

// Mock NextResponse
global.NextResponse = class NextResponse extends MockResponse {
  static redirect(url, status = 308) {
    return new MockResponse('', { status })
  }
}

// Mock Next.js global fetch with minimal implementation
global.fetch = async (url, init) => {
  // Minimal mock for fetch
  return {
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '{}',
    headers: new Headers()
  }
}
