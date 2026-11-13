
export default function Hero() {
  return (
    <section className="flex flex-col items-start">

      {/* Eyebrow */}
      <div className="mb-8 flex items-center gap-3">
        <span className="h-2.5 w-2.5 bg-yellow-400" />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
          Your phone knows too much.
        </p>
      </div>

      {/* Main heading */}
      <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
        ROAST
        <br />
        MY
        <br />
        <span className="text-yellow-400">SCREEN</span>
        <br />
        TIME<span className="text-white">.</span>
      </h1>

      {/* Description */}
      <p className="mt-10 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
        Your screen time says everything about you.
        Unfortunately, none of it is good.
        <span className="text-white">
          {' '}Upload your report and be prepared to be humbled.
        </span>
      </p>

      {/* Platform support */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <span className="border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-wider">
          iOS
        </span>

        <span className="border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-wider">
          Android
        </span>

        <span className="text-xs uppercase tracking-wider text-zinc-600">
          Screenshot only
        </span>
      </div>

      {/* Bottom statement */}
      <div className="mt-14 border-l-4 border-yellow-400 pl-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          The first step is admitting
        </p>

        <p className="mt-1 text-lg font-black uppercase text-white sm:text-xl">
          You have a problem.
        </p>
      </div>

    </section>
  )
}
