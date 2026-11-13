
export default function Header() {
  return (
    <header className="mx-auto w-[95%] border-b border-zinc-800 px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="border-r-2 border-yellow-400 pr-5 sm:pr-8">
            <h1 className="font-['Bebas_Neue'] text-3xl tracking-wider text-white sm:text-4xl leading-none">
              BRAIN ROT
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] text-zinc-400 sm:text-sm">
            Your daily dose of reality.
          </p>
        </div>

        <span className="hidden border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-yellow-400 sm:inline-block">
          Beta v1.0
        </span>
      </div>
    </header>
  )
}
