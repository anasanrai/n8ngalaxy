import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in bg-background">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-primary tracking-tight">
          n8nGalaxy
        </h1>
        <p className="text-text-secondary text-lg md:text-xl font-sans max-w-md mx-auto">
          The n8n ecosystem hub. Buy, rent, learn, ship.
        </p>
        
        <div className="bg-surface border border-border rounded-card p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
          
          <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
            System Ready
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            <button
              className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-card transition-colors duration-200 cursor-pointer"
              onClick={() => setCount((count) => count + 1)}
            >
              Initialize Node: {count}
            </button>
            <p className="text-text-tertiary text-sm font-mono p-2 bg-background/50 rounded-input border border-border/50">
              current_vibe: "ready_to_build"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-6 rounded-card text-left transition-transform hover:-translate-y-1">
            <span className="text-accent font-bold text-xs uppercase tracking-widest block mb-1">Buy</span>
            <p className="text-text-primary font-medium">Premium Templates</p>
            <p className="text-text-tertiary text-xs mt-1">Pre-built automation flows</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-card text-left transition-transform hover:-translate-y-1">
            <span className="text-accent font-bold text-xs uppercase tracking-widest block mb-1">Rent</span>
            <p className="text-text-primary font-medium">Isolated Sandboxes</p>
            <p className="text-text-tertiary text-xs mt-1">Temporary n8n instances</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-card text-left transition-transform hover:-translate-y-1">
            <span className="text-accent font-bold text-xs uppercase tracking-widest block mb-1">Learn</span>
            <p className="text-text-primary font-medium">Course & Community</p>
            <p className="text-text-tertiary text-xs mt-1">Master n8n & automation</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
