'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check, Sun, Moon, Sparkles, Palette, Sliders, Code, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

export default function Home() {
  const [params, setParams] = useState({
    progress: 75,
    color: '#2563eb',
    backgroundColor: '#f3f4f6',
    height: 20,
    width: 200,
    borderRadius: 10,
    striped: false,
    animated: false,
    animationSpeed: 1,
  })

  const [copied, setCopied] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const generateUrl = () => {
    const safeValues = {
      progress: Math.max(0, Math.min(isNaN(params.progress) ? 0 : params.progress, 100)),
      color: params.color || '#2563eb',
      backgroundColor: params.backgroundColor || '#f3f4f6',
      height: Math.min(500, Math.max(0, isNaN(params.height) ? 0 : params.height)),
      width: Math.min(3000, Math.max(0, isNaN(params.width) ? 0 : params.width)),
      borderRadius: Math.min(1000, Math.max(0, isNaN(params.borderRadius) ? 0 : params.borderRadius)),
      striped: Boolean(params.striped),
      animated: Boolean(params.animated),
      animationSpeed: isNaN(params.animationSpeed) ? 0 : Math.max(0, params.animationSpeed)
    };

    const baseUrl = 'https://progress-bars-eight.vercel.app/bar'
    const queryParams = new URLSearchParams({
      progress: safeValues.progress.toString(),
      color: safeValues.color,
      backgroundColor: safeValues.backgroundColor,
      height: safeValues.height.toString(),
      width: safeValues.width.toString(),
      borderRadius: safeValues.borderRadius.toString(),
      striped: safeValues.striped.toString(),
      animated: safeValues.animated.toString(),
      animationSpeed: safeValues.animationSpeed.toString(),
    })
    return `${baseUrl}?${queryParams.toString()}`
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const presetColors = [
    { name: 'Blue', color: '#2563eb' },
    { name: 'Green', color: '#16a34a' },
    { name: 'Purple', color: '#9333ea' },
    { name: 'Red', color: '#dc2626' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Pink', color: '#db2777' },
  ]

  return (
    <div
      role="main"
      className={cn(
        "min-h-screen transition-colors duration-300 overflow-x-hidden",
        theme === 'light'
          ? "bg-gradient-to-br from-blue-50 via-white to-purple-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      )}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fall ${1 + Math.random() * 2}s linear forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="toggle theme"
            className={cn(
              "rounded-full transition-all hover:scale-110",
              theme === 'dark' ? "text-yellow-300 hover:text-yellow-200" : "text-gray-700 hover:text-gray-900"
            )}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        <div className="text-center space-y-2 sm:space-y-4 py-6 sm:py-10">
          <div className="inline-flex items-center gap-2 mb-2 flex-wrap justify-center">
            <Sparkles className={cn("h-5 w-5 sm:h-6 sm:w-6", theme === 'light' ? "text-blue-500" : "text-blue-400")} />
            <h1 className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r pb-2",
              theme === 'light'
                ? "from-blue-600 to-purple-600"
                : "from-blue-400 to-purple-400"
            )}>
              Progress Bar Generator
            </h1>
            <Sparkles className={cn("h-5 w-5 sm:h-6 sm:w-6", theme === 'light' ? "text-purple-500" : "text-purple-400")} />
          </div>
          <p className={cn(
            "text-lg sm:text-xl max-w-2xl mx-auto px-2",
            theme === 'light' ? "text-gray-600" : "text-gray-300"
          )}>
            Create beautiful, customizable progress bars for your projects with just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 mt-4 sm:mt-8">
          <Card className={cn(
            "p-4 sm:p-6 space-y-4 sm:space-y-6 border-0 shadow-xl",
            theme === 'light'
              ? "bg-white/80 backdrop-blur-sm"
              : "bg-gray-800/80 backdrop-blur-sm border-gray-700"
          )}>
            <div className="flex items-center gap-2">
              <Sliders className={cn("h-5 w-5", theme === 'light' ? "text-blue-500" : "text-blue-400")} />
              <h2 className={cn(
                "text-xl sm:text-2xl font-semibold",
                theme === 'light' ? "text-gray-800" : "text-gray-100"
              )}>
                Customize
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="space-y-5 md:col-span-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="progress"
                      className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                    >
                      Progress
                    </Label>
                    <span className={cn(
                      "text-sm font-medium px-2 py-1 rounded-md",
                      theme === 'light'
                        ? "bg-blue-100 text-blue-700"
                        : "bg-blue-900/30 text-blue-300"
                    )} aria-label="progress-value">
                      {params.progress}%
                    </span>
                  </div>

                  <Slider
                    id="progress"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.progress]}
                    onValueChange={(value: number[]) => setParams({ ...params, progress: value[0] })}
                    className={cn(
                      "mt-2",
                      theme === 'light'
                        ? "[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md"
                        : "[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400 [&_[role=slider]]:shadow-md"
                    )}
                    aria-label="progress"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                  >
                    Preset Colors
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetColors.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="ghost"
                        className={cn(
                          "h-auto py-2 px-3 flex flex-col items-center gap-1 transition-all hover:scale-105",
                          theme === 'light' ? "hover:bg-gray-50" : "hover:bg-gray-700"
                        )}
                        onClick={() => setParams({
                          ...params,
                          color: preset.color
                        })}
                      >
                        <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: preset.color }}></div>
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          theme === 'light' ? "text-gray-700" : "text-gray-300"
                        )}>
                          {preset.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="color"
                    className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                  >
                    Bar Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div
                      className="w-12 h-8 rounded border cursor-pointer overflow-hidden relative flex items-center justify-center"
                      style={{ borderColor: theme === 'light' ? '#e2e8f0' : '#4b5563' }}
                      onClick={() => document.getElementById('colorPicker')?.click()}
                    >
                      <div className="absolute inset-0" style={{ backgroundColor: params.color }}></div>
                      <Input
                        id="colorPicker"
                        type="color"
                        value={params.color}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          // Validate if it's a valid hex color
                          const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor);
                          setParams({
                            ...params,
                            color: isValidHex ? newColor : '#2563eb' // Use default color if invalid
                          });
                        }}
                        className="absolute opacity-0 cursor-pointer w-full h-full"
                        aria-label="Select color"
                      />
                    </div>
                    <Input
                      type="text"
                      value={params.color}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        // Validate if it's a valid hex color
                        const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor);
                        setParams({
                          ...params,
                          color: isValidHex ? newColor : '#2563eb' // Use default color if invalid
                        });
                      }}
                      className={cn(
                        "flex-1",
                        theme === 'light' ? "bg-white" : "bg-gray-800 border-gray-700 text-gray-200"
                      )}
                      aria-label="Bar color"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="backgroundColor"
                    className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                  >
                    Background Color
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div
                      className="w-12 h-8 rounded border cursor-pointer overflow-hidden relative flex items-center justify-center"
                      style={{ borderColor: theme === 'light' ? '#e2e8f0' : '#4b5563' }}
                      onClick={() => document.getElementById('backgroundColorPicker')?.click()}
                    >
                      <div className="absolute inset-0" style={{ backgroundColor: params.backgroundColor }}></div>
                      <Input
                        id="backgroundColorPicker"
                        type="color"
                        value={params.backgroundColor}
                        onChange={(e) => setParams({ ...params, backgroundColor: e.target.value })}
                        className="absolute opacity-0 cursor-pointer w-full h-full"
                        aria-label="Select background color"
                      />
                    </div>
                    <Input
                      type="text"
                      value={params.backgroundColor}
                      onChange={(e) => setParams({ ...params, backgroundColor: e.target.value })}
                      className={cn(
                        "flex-1",
                        theme === 'light' ? "bg-white" : "bg-gray-800 border-gray-700 text-gray-200"
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="height"
                      className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                    >
                      Height (px)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={params.height}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        let finalValue = value === '' ? 0 : isNaN(value as number) ? 0 : value as number;

                        // Apply max constraint
                        finalValue = Math.min(500, finalValue);

                        setParams({
                          ...params,
                          height: finalValue
                        });
                      }}
                      className={cn(
                        "mt-1",
                        theme === 'light' ? "bg-white" : "bg-gray-800 border-gray-700 text-gray-200"
                      )}
                      min={0}
                      max={500}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="width"
                      className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                    >
                      Width (px)
                    </Label>
                    <div className="relative">
                      <Input
                        id="width"
                        type="number"
                        min={0}
                        max={3000}
                        value={params.width}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : parseInt(e.target.value);
                          // Handle empty value or invalid entry
                          if (value === '' || isNaN(value as number)) {
                            setParams({ ...params, width: 0 });
                          }
                          // Enforce min/max constraints
                          else if (value < 0) {
                            setParams({ ...params, width: 0 });
                          } else if (value > 3000) {
                            setParams({ ...params, width: 3000 });
                          } else {
                            setParams({ ...params, width: value as number });
                          }
                        }}
                        className={cn(
                          "mt-1",
                          theme === 'light' ? "bg-white" : "bg-gray-800 border-gray-700 text-gray-200"
                        )}
                        placeholder="0"
                      />
                      {params.width > 1000 && (
                        <div className={cn(
                          "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium rounded-full px-1.5 py-0.5",
                          theme === 'light' ? "bg-amber-100 text-amber-800" : "bg-amber-900/30 text-amber-400"
                        )}>
                          Large
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="borderRadius"
                      className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                    >
                      Radius (px)
                    </Label>
                    <Input
                      id="borderRadius"
                      type="number"
                      value={params.borderRadius}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        let finalValue = value === '' ? 0 : isNaN(value as number) ? 0 : Math.max(0, value as number);

                        // Apply max constraint
                        finalValue = Math.min(1000, finalValue);

                        setParams({
                          ...params,
                          borderRadius: finalValue
                        });
                      }}
                      className={cn(
                        "mt-1",
                        theme === 'light' ? "bg-white" : "bg-gray-800 border-gray-700 text-gray-200"
                      )}
                      min={0}
                      max={1000}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <Label
                    className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                  >
                    Effects
                  </Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="striped"
                          checked={params.striped}
                          onChange={(e) => setParams({ ...params, striped: e.target.checked })}
                          className={cn(
                            "peer h-5 w-5 cursor-pointer appearance-none rounded-md border transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            theme === 'light'
                              ? "border-gray-300 focus:ring-blue-400 focus:ring-offset-white"
                              : "border-gray-600 bg-gray-700 focus:ring-blue-500 focus:ring-offset-gray-800"
                          )}
                        />
                        <svg
                          className={cn(
                            "pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 opacity-0 peer-checked:opacity-100 transition-opacity",
                            theme === 'light' ? "text-blue-600" : "text-blue-400"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <Label
                        htmlFor="striped"
                        className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                      >
                        Striped
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="animated"
                          checked={params.animated}
                          onChange={(e) => setParams({ ...params, animated: e.target.checked })}
                          className={cn(
                            "peer h-5 w-5 cursor-pointer appearance-none rounded-md border transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            theme === 'light'
                              ? "border-gray-300 focus:ring-blue-400 focus:ring-offset-white"
                              : "border-gray-600 bg-gray-700 focus:ring-blue-500 focus:ring-offset-gray-800"
                          )}
                        />
                        <svg
                          className={cn(
                            "pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 opacity-0 peer-checked:opacity-100 transition-opacity",
                            theme === 'light' ? "text-blue-600" : "text-blue-400"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <Label
                        htmlFor="animated"
                        className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                      >
                        Animated
                      </Label>
                    </div>
                  </div>

                  {params.animated && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="animationSpeed"
                          className={theme === 'light' ? "text-gray-700" : "text-gray-200"}
                        >
                          Animation Speed
                        </Label>
                        <span className={cn(
                          "text-sm font-medium",
                          theme === 'light' ? "text-gray-600" : "text-gray-300"
                        )}>
                          {params.animationSpeed.toFixed(1)}x
                        </span>
                      </div>
                      <Slider
                        id="animationSpeed"
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[params.animationSpeed]}
                        onValueChange={(value) => setParams({ ...params, animationSpeed: value[0] })}
                        className={cn(
                          "my-2",
                          theme === 'light'
                            ? "[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                            : "[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400"
                        )}
                      />
                      <div className="flex justify-between text-xs">
                        <span className={theme === 'light' ? "text-gray-500" : "text-gray-400"}>Slower</span>
                        <span className={theme === 'light' ? "text-gray-500" : "text-gray-400"}>Faster</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className={cn("h-5 w-5", theme === 'light' ? "text-purple-500" : "text-purple-400")} />
                    <h2 className={cn(
                      "text-xl sm:text-2xl font-semibold",
                      theme === 'light' ? "text-gray-800" : "text-gray-100"
                    )}>
                      Preview
                    </h2>
                  </div>

                  <div className={cn(
                    "rounded-lg transition-all border overflow-hidden",
                    theme === 'light'
                      ? "bg-gray-50 border-gray-100"
                      : "bg-gray-900 border-gray-700"
                  )}>
                    <div
                      className="p-4 sm:p-6 md:p-10 overflow-auto"
                      style={{
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <div style={{
                        width: 'fit-content',
                        minWidth: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        <iframe
                          src={generateUrl()}
                          width={params.width}
                          height={params.height}
                          style={{
                            border: 'none',
                            overflow: 'hidden',
                            boxShadow: theme === 'light'
                              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              : '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                          }}
                          title="Progress Bar Preview"
                          loading="eager"
                        />
                      </div>
                    </div>
                    {params.width > 500 && (
                      <div className={cn(
                        "py-2 px-4 text-xs text-center border-t",
                        theme === 'light'
                          ? "text-gray-500 border-gray-100"
                          : "text-gray-400 border-gray-700"
                      )}>
                        <span>Scroll horizontally to view the entire progress bar →</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Code className={cn("h-5 w-5", theme === 'light' ? "text-green-500" : "text-green-400")} />
                    <h2 className={cn(
                      "text-xl sm:text-2xl font-semibold",
                      theme === 'light' ? "text-gray-800" : "text-gray-100"
                    )}>
                      Integration
                    </h2>
                  </div>

                  {params.width > 1000 && (
                    <div className={cn(
                      "mb-4 p-3 text-sm rounded-md",
                      theme === 'light'
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-amber-900/20 text-amber-300 border border-amber-800/30"
                    )}>
                      <div className="flex gap-2 items-center">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        <p>You&apos;ve set a large width ({params.width}px). Consider using a smaller width for better embedding experience or ensure your container can handle the size. Maximum allowed is 3000px.</p>
                      </div>
                    </div>
                  )}

                  <Tabs
                    defaultValue="url"
                    className="w-full"
                  >
                    <TabsList
                      className={cn(
                        "grid w-full grid-cols-3 mb-6",
                        theme === 'light'
                          ? "bg-gray-100"
                          : "bg-gray-700"
                      )}
                    >
                      <TabsTrigger
                        value="url"
                        className={theme === 'dark' ? "data-[state=active]:bg-gray-600" : ""}
                      >
                        URL
                      </TabsTrigger>
                      <TabsTrigger
                        value="markdown"
                        className={theme === 'dark' ? "data-[state=active]:bg-gray-600" : ""}
                        aria-label="markdown-tab-trigger"
                      >
                        Markdown
                      </TabsTrigger>
                      <TabsTrigger
                        value="html"
                        className={theme === 'dark' ? "data-[state=active]:bg-gray-600" : ""}
                      >
                        HTML
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-2">
                      <div className="relative">
                        <Input
                          value={generateUrl()}
                          readOnly
                          className={cn(
                            "pr-10",
                            theme === 'light'
                              ? "bg-gray-50"
                              : "bg-gray-900 border-gray-700 text-gray-200"
                          )}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => copyToClipboard(generateUrl(), 'url')}
                          aria-label="copy url"
                        >
                          {copied === 'url' ? (
                            <Check className="h-4 w-4 text-green-500" data-testid="check-icon" />
                          ) : (
                            <Copy className={cn("h-4 w-4", theme === 'light' ? "text-gray-500" : "text-gray-400")} />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="markdown" className="space-y-2">
                      <div className="relative">
                        <Input
                          id="markdown-input"
                          data-testid="markdown-input"
                          aria-label="Copy Markdown"
                          value={`![Progress Bar](${generateUrl()})`}
                          readOnly
                          className={cn(
                            "pr-10",
                            theme === 'light'
                              ? "bg-gray-50"
                              : "bg-gray-900 border-gray-700 text-gray-200"
                          )}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => copyToClipboard(`![Progress Bar](${generateUrl()})`, 'markdown')}
                          aria-label="copy markdown"
                        >
                          {copied === 'markdown' ? (
                            <Check className="h-4 w-4 text-green-500" data-testid="check-icon" />
                          ) : (
                            <Copy className={cn("h-4 w-4", theme === 'light' ? "text-gray-500" : "text-gray-400")} />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="html" className="space-y-2">
                      <div className="relative">
                        <Input
                          value={`<img src="${generateUrl()}" alt="Progress Bar">`}
                          readOnly
                          className={cn(
                            "pr-10",
                            theme === 'light'
                              ? "bg-gray-50"
                              : "bg-gray-900 border-gray-700 text-gray-200"
                          )}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => copyToClipboard(`<img src="${generateUrl()}" alt="Progress Bar">`, 'html')}
                          aria-label="copy html"
                        >
                          {copied === 'html' ? (
                            <Check className="h-4 w-4 text-green-500" data-testid="check-icon" />
                          ) : (
                            <Copy className={cn("h-4 w-4", theme === 'light' ? "text-gray-500" : "text-gray-400")} />
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className={cn(
          "p-6 mt-8 border-0 shadow-xl",
          theme === 'light'
            ? "bg-white/80 backdrop-blur-sm"
            : "bg-gray-800/80 backdrop-blur-sm border-gray-700"
        )}>
          <div className="flex items-center gap-2 mb-6">
            <Info className={cn("h-5 w-5", theme === 'light' ? "text-orange-500" : "text-orange-400")} />
            <h2 className={cn(
              "text-2xl font-semibold",
              theme === 'light' ? "text-gray-800" : "text-gray-100"
            )}>
              How to Use
            </h2>
          </div>

          <div className={cn(
            "space-y-4 text-base leading-relaxed",
            theme === 'light' ? "text-gray-700" : "text-gray-200"
          )}>
            <p>
              Create customizable progress bars for your projects in just a few steps:
            </p>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Adjust the settings above to customize your progress bar</li>
              <li>Preview how your progress bar will look in real-time</li>
              <li>Copy the URL, Markdown, or HTML code to embed it anywhere</li>
            </ol>

            <div className="pt-2">
              <h3 className={cn(
                "text-lg font-medium mb-2",
                theme === 'light' ? "text-gray-800" : "text-gray-100"
              )}>
                Available Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Progress</strong> - Percentage of completion (0-100)</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Color</strong> - The color of the progress bar</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Background Color</strong> - The color of the progress bar&apos;s background</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Height</strong> - Height in pixels</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Width</strong> - Width in pixels</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Border Radius</strong> - Rounded corners in pixels</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-400"
                  )}></div>
                  <span><strong>Effects</strong> - Striped and animated options</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <footer className={cn(
          "mt-12 text-center py-6",
          theme === 'light' ? "text-gray-500" : "text-gray-400"
        )}>
          <p className="text-sm">
            Made with ❤️ by <a href="https://github.com/entcheneric" className="underline">EntchenEric</a> 🦆
          </p>
        </footer>
      </div>
    </div>
  )
}
