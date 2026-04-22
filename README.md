# Progress Bars

A modern web service to generate and embed customizable progress bars anywhere! Create beautiful progress bars with an intuitive UI and embed them in your projects.

🌐 **[Try it live](https://progress-bars.entcheneric.com)**

![Progress Bar Generator](https://progress-bars.entcheneric.com/bar.svg?progress=75&color=%232563eb&backgroundColor=%23f3f4f6&height=50&width=800&borderRadius=10&striped=false&animated=false&animationSpeed=1&initialAnimationSpeed=1&colorGradient=linear-gradient%2890deg%2C+%23ec4899%2C+%23d946ef%2C+%23a855f7%29)

## Features

- **Interactive UI**: Customize your progress bars with our user-friendly interface
- **Live Preview**: See your changes in real-time
- **Dark/Light Mode**: Switch between themes for comfortable editing
- **High Contrast Mode**: Accessible editing for users with visual impairments
- **Preset Colors & Gradients**: Choose from beautiful preset colors and gradient combinations
- **Multi-Color Support**: Add multiple colors to create custom gradients
- **Background Gradients**: Apply gradients to the background as well
- **Custom Styling**: Adjust progress, color, background color, height, width, and border radius
- **Special Effects**: Add striped and animated effects to your progress bars
- **Animated Gradients**: Make gradients move and shimmer
- **Initial Animation**: Control how the progress bar fills on first load
- **PNG & SVG Export**: Choose between static PNG or animated SVG
- **Easy Embedding**: Copy URL, Markdown, or HTML code with a single click

## Quick Start

Simply use our URL with query parameters (supports `.svg` and `.png` extensions):

```text
https://progress-bars.entcheneric.com/bar.svg?progress=75&color=%232563eb&width=800&height=50
```

Or visit our [web interface](https://progress-bars.entcheneric.com) to customize your progress bar visually.

## API

### GET Endpoint

Generate a progress bar via URL parameters:

```
GET /bar.svg?progress=75&color=%232563eb&width=800&height=50
```

### POST Endpoint

Generate a progress bar via JSON body (useful for programmatic access):

```
POST /bar
Content-Type: application/json

{
  "progress": 75,
  "color": "#2563eb",
  "width": 800,
  "height": 50
}
```

## Usage Examples

### Basic Progress Bar (75% Complete)
```text
https://progress-bars.entcheneric.com/bar.svg?progress=75&width=800&height=50
```

![Basic Progress](https://progress-bars.entcheneric.com/bar.svg?progress=75&width=800&height=50)

### Animated Gradient with Stripes
```text
https://progress-bars.entcheneric.com/bar.svg?progress=75&width=800&height=50&colorGradient=red,blue,green&striped=true&animated=true&animationSpeed=1.5
```

### Custom Styled Progress Bar
```text
https://progress-bars.entcheneric.com/bar.svg?progress=80&color=%232563eb&backgroundColor=%23f8fafc&height=50&width=800&borderRadius=10&striped=true&animated=true&animationSpeed=1.5
```

### Use in Markdown
```markdown
![Progress](https://progress-bars.entcheneric.com/bar.svg?progress=75&color=%2316a34a&width=800&height=50)
```

### Use in HTML
```html
<img src="https://progress-bars.entcheneric.com/bar.svg?progress=75&color=%232563eb&width=800&height=50" alt="Progress Bar">
```

## Customization Parameters

All parameters are optional and have sensible defaults:

| Parameter | Default | Description | Example |
|-----------|---------|-------------|---------|
| progress | 0 | Progress value (0-100) | `progress=75` |
| color | #2563eb | Color of the progress bar (when not using gradient) | `color=%232563eb` |
| colorGradient | - | Comma-separated colors for gradient | `colorGradient=red,blue,green` |
| backgroundColor | #f3f4f6 | Background color of the bar | `backgroundColor=%23f8fafc` |
| backgroundGradient | - | Comma-separated colors for background gradient | `backgroundGradient=red,blue` |
| height | 20 | Height in pixels (5-500) | `height=30` |
| width | 200 | Width in pixels (10-3000) | `width=200` |
| borderRadius | 10 | Border radius in pixels (0-1000) | `borderRadius=20` |
| striped | false | Add striped effect | `striped=true` |
| animated | false | Animate the stripes | `animated=true` |
| gradientAnimated | false | Animate the gradient | `gradientAnimated=true` |
| animationSpeed | 1 | Speed multiplier for stripe/pulse animation | `animationSpeed=2.5` |
| stripeAnimationSpeed | 1 | Speed multiplier for stripe animation | `stripeAnimationSpeed=2` |
| gradientAnimationSpeed | 1 | Speed multiplier for gradient animation | `gradientAnimationSpeed=3` |
| initialAnimationSpeed | 1 | Speed of initial fill animation (0 = instant) | `initialAnimationSpeed=0.5` |
| format | svg | Output format: `svg` or `png` | `format=png` |

## Common Use Cases

### GitHub README Progress
```markdown
![Project Status](https://progress-bars.entcheneric.com/bar.svg?progress=80&color=%2316a34a&width=800&height=50)
```

### Documentation Status
```markdown
Documentation: ![60% Complete](https://progress-bars.entcheneric.com/bar.svg?progress=60&color=%23ea580c&width=800&height=50)
```

### Project Milestones
```markdown
Phase 1: ![Complete](https://progress-bars.entcheneric.com/bar.svg?progress=100&color=%2316a34a&width=800&height=50)
Phase 2: ![In Progress](https://progress-bars.entcheneric.com/bar.svg?progress=45&color=%232563eb&width=800&height=50)
Phase 3: ![Not Started](https://progress-bars.entcheneric.com/bar.svg?progress=0&color=%236b7280&width=800&height=50)
```

## Tips
- Use URL encoding for special characters in colors (e.g., `%232563eb` for `#2563eb`)
- For gradients, you can use named colors (`red`, `blue`, `green`) or hex values
- The service is stateless - perfect for dynamic content
- Works in any environment that can display images from URLs
- Use the web interface to visually design your perfect progress bar
- Large widths (>1000px) may require horizontal scrolling in some containers
- Choose PNG for platforms that don't support SVG animations (e.g., Discord, Slack)
- Choose SVG for animated progress bars with stripe movement and gradient effects

## Contributing

Feel free to contribute! Open issues and PRs are welcome.

## License

MIT License - Use it anywhere you like!

## Advanced Features

### Gradient Colors
Use gradients instead of solid colors for more dynamic progress bars:
```markdown
![Gradient Progress](https://progress-bars.entcheneric.com/bar.svg?progress=80&width=800&height=50&colorGradient=red,blue,green)
```

### Animated Gradient
Make the gradient pan and shimmer:
```markdown
![Animated Gradient](https://progress-bars.entcheneric.com/bar.svg?progress=75&width=800&height=50&colorGradient=red,blue&gradientAnimated=true)
```

### Initial Animation
Control how the progress bar fills initially:
- Set `initialAnimationSpeed=0` for instant fill
- Use higher values for faster fill animation
- Use lower values for slower fill animation
```markdown
![Animated Fill](https://progress-bars.entcheneric.com/bar.svg?progress=75&initialAnimationSpeed=0.5&width=800&height=50)
```

### Animation Effects
The progress bar can have animated stripes that move:
1. First enable stripes with `striped=true`
2. Then add animation with `animated=true`
3. Control the animation speed with `animationSpeed` (default: 1)

```markdown
![Striped Animated](https://progress-bars.entcheneric.com/bar.svg?progress=75&striped=true&animated=true&animationSpeed=1.5&width=800&height=50)
```

### Size Constraints
- Height: 5px to 500px
- Width: 10px to 3000px
- Border Radius: 0px to 1000px (automatically adjusted for height)

### Different Styles

High contrast:
![High Contrast](https://progress-bars.entcheneric.com/bar.svg?progress=60&color=%23000000&backgroundColor=%23ffffff&width=800&height=50)

Extra rounded:
![Extra Rounded](https://progress-bars.entcheneric.com/bar.svg?progress=85&borderRadius=30&width=800&height=50)

Thin line:
![Thin Line](https://progress-bars.entcheneric.com/bar.svg?progress=45&height=50&width=800&borderRadius=2)

Sunset gradient with stripes:
![Sunset Gradient](https://progress-bars.entcheneric.com/bar.svg?progress=90&width=800&height=50&colorGradient=red,orange,purple&striped=true)
