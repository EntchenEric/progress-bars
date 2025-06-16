# Progress Bars

A modern web service to generate and embed customizable progress bars anywhere! Create beautiful progress bars with our intuitive UI and embed them in your projects.

🌐 **[Try it live](https://progress-bars.entcheneric.com)**

![Progress Bar Generator](https://progress-bars.entcheneric.com/bar?progress=75&color=%232563eb&backgroundColor=%23f3f4f6&height=50&width=800&borderRadius=10&striped=false&animated=false&animationSpeed=1&initialAnimationSpeed=1&colorGradient=linear-gradient%2890deg%2C+%23ec4899%2C+%23d946ef%2C+%23a855f7%29)

## Features

- **Interactive UI**: Customize your progress bars with our user-friendly interface
- **Live Preview**: See your changes in real-time
- **Dark/Light Mode**: Switch between themes for comfortable editing
- **Preset Colors**: Choose from a selection of beautiful preset colors
- **Custom Styling**: Adjust progress, color, background color, height, width, and border radius
- **Special Effects**: Add striped and animated effects to your progress bars
- **Easy Embedding**: Copy URL, Markdown, or HTML code with a single click

## Quick Start

Simply use our URL with query parameters to create your progress bar:

```
https://progress-bars.entcheneric.com/bar?progress=75&color=%232563eb&width=800&height=50
```

Or visit our [web interface](https://progress-bars.entcheneric.com) to customize your progress bar visually.

## Usage Examples

### Basic Progress Bar (75% Complete, Animated Gradient)
```
https://progress-bars.entcheneric.com/bar?progress=75&width=800&height=50&colorGradient=linear-gradient(90deg,%20%230ea5e9,%20%232563eb,%20%234f46e5)&striped=true&animated=true&animationSpeed=1.5
```

![Awesome Progress](https://progress-bars.entcheneric.com/bar?progress=75&width=800&height=50&colorGradient=linear-gradient(90deg,%20%230ea5e9,%20%232563eb,%20%234f46e5)&striped=true&animated=true&animationSpeed=1.5)

### Custom Styled Progress Bar
```
https://progress-bars.entcheneric.com/bar?progress=80&color=%232563eb&backgroundColor=%23f8fafc&height=50&width=800&borderRadius=10&striped=true&animated=true&animationSpeed=1.5
```

![Custom Style](https://progress-bars.entcheneric.com/bar?progress=80&color=%232563eb&backgroundColor=%23f8fafc&height=50&width=800&borderRadius=10&striped=true&animated=true&animationSpeed=1.5)

### Use in Markdown
```markdown
![Progress](https://progress-bars.entcheneric.com/bar?progress=75&color=%2316a34a&width=800&height=50)
```

### Use in HTML
```html
<img src="https://progress-bars.entcheneric.com/bar?progress=75&color=%232563eb&width=800&height=50" alt="Progress Bar">
```

## Customization Parameters

All parameters are optional and have sensible defaults:

| Parameter             | Default | Description                                            | Example                                                                             |
| --------------------- | ------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| progress              | 0       | Progress value (0-100)                                 | `progress=75`                                                                       |
| color                 | #2563eb | Color of the progress bar                              | `color=%232563eb`                                                                   |
| colorGradient         | -       | Custom gradient for the progress bar                   | `colorGradient=linear-gradient(90deg%2C%20%230ea5e9%2C%20%232563eb%2C%20%234f46e5)` |
| backgroundColor       | #f3f4f6 | Background color of the bar                            | `backgroundColor=%23f8fafc`                                                         |
| height                | 20      | Height in pixels (5-500)                               | `height=30`                                                                         |
| width                 | 200     | Width in pixels (10-3000)                              | `width=200`                                                                         |
| borderRadius          | 10      | Border radius in pixels (0-1000)                       | `borderRadius=20`                                                                   |
| striped               | false   | Add striped effect                                     | `striped=true`                                                                      |
| animated              | false   | Add animation to stripes or pulse effect               | `animated=true`                                                                     |
| animationSpeed        | 1       | Speed multiplier for stripe/pulse animation            | `animationSpeed=2.5`                                                                |
| initialAnimationSpeed | 1       | Speed of initial progress fill animation (0 = instant) | `initialAnimationSpeed=0.5`                                                         |

## Common Use Cases

### GitHub README Progress
```markdown
![Project Status](https://progress-bars.entcheneric.com/bar?progress=80&color=%2316a34a&width=800&height=50)
```

### Documentation Status
```markdown
Documentation: ![60% Complete](https://progress-bars.entcheneric.com/bar?progress=60&color=%23ea580c&width=800&height=50)
```

### Project Milestones
```markdown
Phase 1: ![Complete](https://progress-bars.entcheneric.com/bar?progress=100&color=%2316a34a&width=800&height=50)
Phase 2: ![In Progress](https://progress-bars.entcheneric.com/bar?progress=45&color=%232563eb&width=800&height=50)
Phase 3: ![Not Started](https://progress-bars.entcheneric.com/bar?progress=0&color=%236b7280&width=800&height=50)
```

## Tips
- Use URL encoding for special characters in colors (e.g., `%232563eb` for `#2563eb`)
- For gradients, encode spaces as `%20` and commas as `%2C`
- The service is stateless - perfect for dynamic content
- Works in any environment that can display images from URLs
- Use the web interface to visually design your perfect progress bar
- Large widths (>1000px) may require horizontal scrolling in some containers

## Contributing

Feel free to contribute! Open issues and PRs are welcome.

## License

MIT License - Use it anywhere you like!

## Advanced Features

### Gradient Colors
You can use gradients instead of solid colors for more dynamic progress bars:
```markdown
![Gradient Progress](https://progress-bars.entcheneric.com/bar?progress=80&width=800&height=50&colorGradient=linear-gradient(90deg,%20%230ea5e9,%20%232563eb,%20%234f46e5))
```

Example:
![Gradient Progress](https://progress-bars.entcheneric.com/bar?progress=80&width=800&height=50&colorGradient=linear-gradient(90deg,%20%230ea5e9,%20%232563eb,%20%234f46e5))

### Initial Animation
Control how the progress bar fills initially:
- Set `initialAnimationSpeed=0` for instant fill
- Use higher values for faster fill animation
- Use lower values for slower fill animation
```markdown
![Animated Fill](https://progress-bars.entcheneric.com/bar?progress=75&initialAnimationSpeed=0.5&width=800&height=50)
```

Example:
![Animated Fill](https://progress-bars.entcheneric.com/bar?progress=75&initialAnimationSpeed=0.5&width=800&height=50)

### Animation Effects
The progress bar can have animated stripes that move from right to left:
1. First enable stripes with `striped=true`
2. Then add animation with `animated=true`
3. Control the animation speed with `animationSpeed` (default: 1)

```markdown
![Striped Animated](https://progress-bars.entcheneric.com/bar?progress=75&striped=true&animated=true&animationSpeed=1.5&width=800&height=50)
```

Example:
![Striped Animated](https://progress-bars.entcheneric.com/bar?progress=75&striped=true&animated=true&animationSpeed=1.5&width=800&height=50)

Note: The `animated` parameter only affects the stripe animation and requires `striped=true` to work.

### Size Constraints
- Height: 5px to 500px
- Width: 10px to 3000px
- Border Radius: 0px to 1000px (automatically adjusted for height)

### Different Styles

Here are some example combinations:

High contrast:
![High Contrast](https://progress-bars.entcheneric.com/bar?progress=60&color=%23000000&backgroundColor=%23ffffff&width=800&height=50)

Extra rounded:
![Extra Rounded](https://progress-bars.entcheneric.com/bar?progress=85&borderRadius=30&width=800&height=50)

Thin line:
![Thin Line](https://progress-bars.entcheneric.com/bar?progress=45&height=50&width=800&borderRadius=2)

Sunset gradient with stripes:
![Sunset Gradient](https://progress-bars.entcheneric.com/bar?progress=90&width=800&height=50&colorGradient=linear-gradient(90deg,%20%23f97316,%20%23db2777,%20%237c3aed)&striped=true)
