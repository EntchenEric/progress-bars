import '@testing-library/jest-dom'
import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react'
import Page from '../app/page'

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
})

window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
}))

jest.useFakeTimers()

describe('Progress Bar Generator', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.clearAllTimers()
    })

    describe('Initial Rendering', () => {
        it('renders the main heading', () => {
            render(<Page />)
            expect(screen.getByText('Progress Bar Generator')).toBeInTheDocument()
        })

        it('renders with default values', () => {
            render(<Page />)
            const progressValue = screen.getByText('75%')
            expect(progressValue).toBeInTheDocument()
        })

        it('renders all preset color buttons', () => {
            render(<Page />)
            const presetColors = ['Blue', 'Green', 'Purple', 'Red', 'Orange', 'Pink']
            presetColors.forEach(color => {
                expect(screen.getByText(color)).toBeInTheDocument()
            })
        })
    })

    describe('Progress Bar Customization', () => {
        it("updates progress value when slider changes", async () => {
            render(<Page />)

            const sliderInput = screen.getByTestId("progress-slider-input")
            const initialProgressValue = screen.getByLabelText('progress-value')
            expect(initialProgressValue).toHaveTextContent('75%')

            await act(async () => {
                fireEvent.change(sliderInput, { target: { value: "50" } })
            })

            const updatedProgressValue = screen.getByLabelText('progress-value')
            expect(updatedProgressValue).toHaveTextContent('50%')
        })

        it('updates color when preset color is clicked', async () => {
            render(<Page />)
            const greenButton = screen.getByText('Green')

            await act(async () => {
                fireEvent.click(greenButton)
            })

            const url = screen.getByDisplayValue(/^https:.*/)
            expect(url.value).toContain('color=%2316a34a')
        })

        it('validates and constrains width input', async () => {
            render(<Page />)
            const widthInput = screen.getByRole('spinbutton', { name: /width/i })

            await act(async () => {
                fireEvent.change(widthInput, { target: { value: '4000' } })
            })

            const url = screen.getByDisplayValue(/^https:.*/)
            expect(url.value).toContain('width=3000')
        })

        it('toggles animation speed slider when animation is enabled', async () => {
            render(<Page />)
            const animatedCheckbox = screen.getByRole('checkbox', { name: /animated/i })

            expect(screen.queryByText(/^animation speed$/i)).not.toBeInTheDocument()

            await act(async () => {
                fireEvent.click(animatedCheckbox)
            })

            expect(screen.getByText(/^animation speed$/i)).toBeInTheDocument()
        })
    })

    describe('Theme Switching', () => {
        it('toggles between light and dark theme', async () => {
            render(<Page />)
            const themeButton = screen.getByRole('button', { name: /toggle theme/i })

            await act(async () => {
                fireEvent.click(themeButton)
            })

            const mainElement = screen.getByRole('main')
            expect(mainElement.className).toContain('from-gray-900')
        })
    })

    describe('URL Generation and Copying', () => {
        it('generates correct URL with current parameters', () => {
            render(<Page />)
            const urlInput = screen.getByDisplayValue(/^https:\/\/progress-bars-eight\.vercel\.app\/bar\?/)
            expect(urlInput.value).toContain('progress=75')
            expect(urlInput.value).toContain('color=%232563eb')
        })

        it('copies URL to clipboard when copy button is clicked', async () => {
            render(<Page />)
            const copyButton = screen.getByRole('button', { name: /copy url/i })

            await act(async () => {
                fireEvent.click(copyButton)
            })

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                expect.stringMatching(/^https:\/\/progress-bars-eight\.vercel\.app\/bar\?/)
            )
        })

        it('shows success icon after copying', async () => {
            render(<Page />)
            const copyButton = screen.getByRole('button', { name: /copy url/i })

            await act(async () => {
                fireEvent.click(copyButton)
            })

            expect(screen.getByTestId('check-icon')).toBeInTheDocument()

            act(() => {
                jest.advanceTimersByTime(2000)
            })

            expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument()
        })
    })
    
    describe('Error Handling', () => {
        it('shows warning for large width values', async () => {
            render(<Page />)
            const widthInput = screen.getByRole('spinbutton', { name: /width/i })

            await act(async () => {
                fireEvent.change(widthInput, { target: { value: '1500' } })
            })

            expect(screen.getByText(/You've set a large width/)).toBeInTheDocument()
        })

        it('handles invalid color inputs gracefully', async () => {
            render(<Page />)
            const colorInput = screen.getByRole('textbox', { name: /bar color/i })

            await act(async () => {
                fireEvent.change(colorInput, { target: { value: 'invalid-color' } })
            })

            const url = screen.getByDisplayValue(/^https:.*/)
            expect(url.value).toContain('color=%232563eb')
        })
    })

    describe('Initial Animation', () => {
        it('updates initial animation speed when slider changes', async () => {
            render(<Page />)
            
            // Find the initial animation speed slider by its label text
            const initialAnimSpeedSlider = screen.getByTestId("initial-animation-speed-slider-input")
            expect(initialAnimSpeedSlider).toBeInTheDocument()
            
            // Check default value in URL
            const url = screen.getByDisplayValue(/^https:.*/)
            expect(url.value).toContain('initialAnimationSpeed=1')

            // Change the value
            await act(async () => {
                fireEvent.change(initialAnimSpeedSlider, { target: { value: "2" } })
            })

            // Check if URL updated
            const updatedUrl = screen.getByDisplayValue(/^https:.*/)
            expect(updatedUrl.value).toContain('initialAnimationSpeed=2')
        })

        it('disables initial animation when speed is set to 0', async () => {
            render(<Page />)
            
            const initialAnimSpeedSlider = screen.getByTestId("initial-animation-speed-slider-input")
            
            await act(async () => {
                fireEvent.change(initialAnimSpeedSlider, { target: { value: "0" } })
            })

            const url = screen.getByDisplayValue(/^https:.*/)
            expect(url.value).toContain('initialAnimationSpeed=0')
        })
    })
})
