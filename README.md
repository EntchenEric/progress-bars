# Progress Bars

A simple web service to generate and embed customizable progress bars anywhere! Just use our URL with your desired parameters.

🌐 **[Try it live](https://progress-bars-eight.vercel.app/bar)**

## Quick Start

Simply use our URL with query parameters to create your progress bar:

```
https://progress-bars-eight.vercel.app/bar?progress=75&color=blue
```

## Usage Examples

### Basic Progress Bar (75% Complete)
```
https://progress-bars-eight.vercel.app/bar?progress=75
```

### Custom Styled Progress Bar
```
https://progress-bars-eight.vercel.app/bar?progress=80&color=blue&backgroundColor=lightgray&height=30&width=200&borderRadius=10
```

### Use in Markdown
```markdown
![Progress](https://progress-bars-eight.vercel.app/bar?progress=75&color=green)
```

### Use in HTML
```html
<img src="https://progress-bars-eight.vercel.app/bar?progress=75&color=blue" alt="Progress Bar">
```

## Customization Parameters

All parameters are optional and have sensible defaults:

| Parameter       | Default | Description               | Example                     |
| --------------- | ------- | ------------------------- | --------------------------- |
| progress        | 0       | Progress value (0-100)    | `progress=75`               |
| color           | red     | Color of the progress bar | `color=blue`                |
| backgroundColor | white   | Background color          | `backgroundColor=lightgray` |
| height          | 20      | Height in pixels          | `height=30`                 |
| width           | 100     | Width in pixels           | `width=200`                 |
| borderRadius    | 50      | Border radius in pixels   | `borderRadius=10`           |

## Common Use Cases

### GitHub README Progress
```markdown
![Project Status](https://progress-bars-eight.vercel.app/bar?progress=80&color=green)
```

### Documentation Status
```markdown
Documentation: ![60% Complete](https://progress-bars-eight.vercel.app/bar?progress=60&color=orange)
```

### Project Milestones
```markdown
Phase 1: ![Complete](https://progress-bars-eight.vercel.app/bar?progress=100&color=green)
Phase 2: ![In Progress](https://progress-bars-eight.vercel.app/bar?progress=45&color=blue)
Phase 3: ![Not Started](https://progress-bars-eight.vercel.app/bar?progress=0&color=gray)
```

## Tips
- Use URL encoding for special characters in colors (e.g., `%23ff0000` for `#ff0000`)
- The service is stateless - perfect for dynamic content
- Works in any environment that can display images from URLs

## Contributing

Feel free to contribute! Open issues and PRs are welcome.

## License

MIT License - Use it anywhere you like!
