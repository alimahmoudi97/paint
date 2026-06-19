import { FaPaintBrush, FaShapes, FaFont, FaLayerGroup, FaDownload, FaVideo, FaUndo, FaMagic, FaImage } from "react-icons/fa";

interface LandingPageProps {
  onEnterApp: () => void;
}

const features = [
  {
    title: "Drawing Tools",
    description: "Pen, marker, and highlighter brushes with customizable size and color for expressive freehand drawing.",
    icon: <FaPaintBrush />,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Shapes & Elements",
    description: "Draw rectangles, circles, triangles, lines, ellipses, and polygons with precision.",
    icon: <FaShapes />,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Text & Typography",
    description: "Add styled text with customizable font family, size, and color to your creations.",
    icon: <FaFont />,
    gradient: "from-emerald-500 to-blue-500",
  },
  {
    title: "Layer Management",
    description: "Organize your artwork with multiple layers, reorder elements, and control visibility.",
    icon: <FaLayerGroup />,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Export as PNG",
    description: "Export your artwork as a PNG with one click. Your creativity, ready to share.",
    icon: <FaDownload />,
    gradient: "from-red-500 to-pink-500",
  },
  {
    title: "Screen Recording",
    description: "Record your drawing process as a WebM video and share your creative journey.",
    icon: <FaVideo />,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Unlimited Undo",
    description: "Full undo and redo history so you can experiment fearlessly without losing work.",
    icon: <FaUndo />,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Image Import",
    description: "Import images from your device or a URL and use them as a base for your artwork.",
    icon: <FaImage />,
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    title: "Smart Guides",
    description: "Alignment guides and an optional grid overlay help you place elements with pixel precision.",
    icon: <FaMagic />,
    gradient: "from-orange-500 to-yellow-500",
  },
];

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden font-sans">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/8 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaPaintBrush className="text-purple-400 text-lg" />
          <span className="font-extrabold text-lg tracking-tight">Paint</span>
        </div>
        <button
          onClick={onEnterApp}
          className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          Launch App
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-16 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Free · Open Source · No Sign-up
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tight">
            Create{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Beautiful
            </span>
            <br />
            Digital Art
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A powerful, browser-based painting app with professional brushes, shapes, layers, and real-time recording — all without installing anything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onEnterApp}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-9 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-purple-500/30"
            >
              Start Creating
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <a
              href="#features"
              className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-9 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* App preview window */}
        <div className="relative mt-20 w-full max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 ml-4 bg-gray-700 rounded h-4 max-w-xs" />
            </div>
            {/* SVG art demo */}
            <div className="bg-white">
              <svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <rect width="900" height="360" fill="#f8fafc" />
                {/* Grid lines (faint) */}
                {Array.from({ length: 18 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="360" stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 50} x2="900" y2={i * 50} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {/* Purple blob shape */}
                <ellipse cx="680" cy="160" rx="110" ry="90" fill="#8B5CF6" opacity="0.18" />
                <ellipse cx="700" cy="140" rx="70" ry="55" fill="#6D28D9" opacity="0.25" />
                {/* Blue circle */}
                <circle cx="200" cy="110" r="70" fill="#3B82F6" opacity="0.18" />
                <circle cx="215" cy="95" r="42" fill="#2563EB" opacity="0.22" />
                {/* Yellow rectangle */}
                <rect x="90" y="200" width="160" height="100" rx="10" fill="#F59E0B" opacity="0.25" />
                <rect x="110" y="215" width="120" height="70" rx="6" fill="#D97706" opacity="0.2" />
                {/* Freehand strokes */}
                <path d="M 30 300 Q 120 220 210 280 T 390 250 T 570 220 T 750 190" stroke="#8B5CF6" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 60 340 Q 180 270 300 320 T 520 290" stroke="#EC4899" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.75" />
                <path d="M 400 50 Q 480 20 560 60 T 720 45" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
                {/* Triangle */}
                <polygon points="760,80 820,170 700,170" fill="#8B5CF6" opacity="0.22" />
                {/* Text element */}
                <text x="310" y="185" fontFamily="Georgia, serif" fontSize="40" fill="#1e293b" fontWeight="bold" opacity="0.85">Hello, Art!</text>
                {/* Highlighter mark */}
                <rect x="308" y="190" width="232" height="10" rx="5" fill="#FCD34D" opacity="0.45" />
                {/* Small circles decorative */}
                <circle cx="820" cy="290" r="20" fill="#EC4899" opacity="0.3" />
                <circle cx="840" cy="270" r="12" fill="#F472B6" opacity="0.3" />
                <circle cx="140" cy="330" r="15" fill="#34D399" opacity="0.35" />
              </svg>
            </div>
          </div>
          {/* Glow under preview */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-purple-500/20 blur-2xl rounded-full" />
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-1.5 text-gray-500 text-sm">
          <a href="#stats" className="hover:text-gray-300 transition-colors">Scroll to explore</a>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10+", label: "Drawing Tools" },
            { value: "∞", label: "Undo Steps" },
            { value: "6", label: "Shape Types" },
            { value: "0", label: "Install Required" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                create
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete creative toolkit in your browser — no plugins, no extensions, no sign-up.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-gray-900 hover:bg-gray-800/80 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-white text-lg shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interface walkthrough ── */}
      <section className="py-24 px-6 bg-gray-900/40">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">
              Professional tools,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                intuitive interface
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10">
              Paint wraps all its tools in a clean three-panel layout. Pick a tool on the left, draw freely on the canvas in the center, and fine-tune every detail in the settings panel on the right.
            </p>
            <div className="space-y-5">
              {[
                {
                  title: "Left Panel",
                  desc: "Tool picker — Drawing brushes, Shapes, Text, and Image import",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Canvas",
                  desc: "The creative workspace with zoom, pan, grid, and alignment guides",
                  color: "from-blue-500 to-purple-500",
                },
                {
                  title: "Right Panel",
                  desc: "Object properties, canvas settings, and typography controls",
                  color: "from-emerald-500 to-blue-500",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className={`w-1 min-h-[40px] bg-gradient-to-b ${item.color} rounded-full flex-shrink-0 mt-1`} />
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tool list mockup */}
          <div className="relative">
            <div className="bg-gray-950 rounded-2xl border border-white/10 p-5 space-y-2.5">
              {[
                { name: "Pen Tool", active: true, badge: "Active" },
                { name: "Marker" },
                { name: "Highlighter" },
                { name: "Eraser" },
                { name: "Rectangle" },
                { name: "Circle" },
                { name: "Triangle" },
                { name: "Text" },
                { name: "Import Image" },
              ].map((tool, i) => (
                <div
                  key={tool.name}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                    tool.active ? "bg-purple-500/15 border border-purple-500/30" : "bg-gray-900 hover:bg-gray-800/80"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r flex-shrink-0 ${
                      i % 3 === 0
                        ? "from-purple-400 to-pink-400"
                        : i % 3 === 1
                        ? "from-blue-400 to-purple-400"
                        : "from-emerald-400 to-blue-400"
                    }`}
                  />
                  <span className="text-sm">{tool.name}</span>
                  {tool.badge && (
                    <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      {tool.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-purple-500/15 via-pink-500/8 to-blue-500/15 border border-white/10 rounded-3xl px-10 py-20 overflow-hidden">
            {/* Decorative blobs inside the card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="relative text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Ready to create?
            </h2>
            <p className="relative text-gray-400 text-lg mb-10">
              No sign-up. No download. Just open and start painting.
            </p>
            <button
              onClick={onEnterApp}
              className="relative group bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-xl"
            >
              Open Paint App
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <FaPaintBrush className="text-purple-400" />
            <span className="font-bold text-white">Paint</span>
            <span>— A browser-based drawing application</span>
          </div>
          <span>Built with React, TypeScript &amp; Fabric.js</span>
        </div>
      </footer>
    </div>
  );
}
