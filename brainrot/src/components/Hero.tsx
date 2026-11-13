
export default function Hero() {
  return (
    <section className="flex flex-col gap-6 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
        Your phone knows too much.
      </p>

      <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
        Roast My
        <br />
        Screen Time<span className="text-yellow-400">.</span>
      </h1>

      <p className="max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
        Upload your screen-time screenshot. Find out how cooked your brain is,
        which apps own your life, and get roasted for it.
      </p>

      <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
        <span className="border border-zinc-700 px-3 py-2">
          iOS Supported
        </span>
        <span className="border border-zinc-700 px-3 py-2">
          Android Supported
        </span>
      </div>
    </section>
  )
}
