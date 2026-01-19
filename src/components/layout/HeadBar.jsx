export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-white font-semibold leading-tight">Nova Dashboard</div>
          <div className="text-white/60 text-xs">
            Build campaigns, generate creatives, and ship faster.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition">
            <span className="text-sm font-medium">Invite Team</span>
            <span className="text-white/50 text-xs">+</span>
          </button>

          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)]">
            N
          </div>
        </div>
      </div>
    </header>
  );
}
