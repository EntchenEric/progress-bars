# Progress Bars

A modern web service to generate and embed customizable progress bars anywhere! Create beautiful progress bars with our intuitive UI and embed them in your projects.

🌐 **[Try it live](https://progress-bars-eight.vercel.app)**

![Progress Bar Generator](https://progress-bars-eight.vercel.app/bar?progress=75&color=%232563eb&height=20&width=200&borderRadius=10)

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
https://progress-bars-eight.vercel.app/bar?progress=75&color=%232563eb
```

Or visit our [web interface](https://progress-bars-eight.vercel.app) to customize your progress bar visually.

## Usage Examples

### Basic Progress Bar (75% Complete)
```
https://progress-bars-eight.vercel.app/bar?progress=75
```

### Custom Styled Progress Bar
```
https://progress-bars-eight.vercel.app/bar?progress=80&color=%232563eb&backgroundColor=%23f8fafc&height=30&width=200&borderRadius=10&striped=true&animated=true&animationSpeed=1.5
```

### Use in Markdown
```markdown
![Progress](https://progress-bars-eight.vercel.app/bar?progress=75&color=%2316a34a)
```

### Use in HTML
```html
<img src="https://progress-bars-eight.vercel.app/bar?progress=75&color=%232563eb" alt="Progress Bar">
```

## Customization Parameters

All parameters are optional and have sensible defaults:

| Parameter       | Default | Description                  | Example                     |
| --------------- | ------- | ---------------------------- | --------------------------- |
| progress        | 0       | Progress value (0-100)       | `progress=75`               |
| color           | #2563eb | Color of the progress bar    | `color=%232563eb`           |
| backgroundColor | #f3f4f6 | Background color of the bar  | `backgroundColor=%23f8fafc` |
| height          | 20      | Height in pixels             | `height=30`                 |
| width           | 200     | Width in pixels              | `width=200`                 |
| borderRadius    | 10      | Border radius in pixels      | `borderRadius=20`           |
| striped         | false   | Add striped effect           | `striped=true`              |
| animated        | false   | Add animation to the bar     | `animated=true`             |
| animationSpeed  | 1       | Speed multiplier (0.1-5)     | `animationSpeed=2.5`        |

## Common Use Cases

### GitHub README Progress
```markdown
![Project Status](https://progress-bars-eight.vercel.app/bar?progress=80&color=%2316a34a)
```

### Documentation Status
```markdown
Documentation: ![60% Complete](https://progress-bars-eight.vercel.app/bar?progress=60&color=%23ea580c)
```

### Project Milestones
```markdown
Phase 1: ![Complete](https://progress-bars-eight.vercel.app/bar?progress=100&color=%2316a34a)
Phase 2: ![In Progress](https://progress-bars-eight.vercel.app/bar?progress=45&color=%232563eb)
Phase 3: ![Not Started](https://progress-bars-eight.vercel.app/bar?progress=0&color=%236b7280)
```

## Tips
- Use URL encoding for special characters in colors (e.g., `%232563eb` for `#2563eb`)
- The service is stateless - perfect for dynamic content
- Works in any environment that can display images from URLs
- Use the web interface to visually design your perfect progress bar

## Contributing

Feel free to contribute! Open issues and PRs are welcome.

## License

MIT License - Use it anywhere you like!
