import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '../../data/site';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned horizontal process timeline (desktop).
 * Intro panel is narrower than the viewport so step 01 peeks on the right at rest.
 */
export default function ProcessTimeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return undefined;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.55}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink text-white">
      {/* Desktop horizontal track */}
      <div
        ref={trackRef}
        className="relative hidden lg:flex lg:h-screen lg:w-max lg:items-stretch lg:will-change-transform"
      >
        {/* Intro — ~52vw so the first step card is visible on the right */}
        <div className="flex h-full w-[52vw] max-w-[840px] min-w-[420px] shrink-0 flex-col justify-center border-r border-white/10 px-10 2xl:w-[48vw] 2xl:max-w-[920px] 2xl:px-24">
          <span className="eyebrow">The Process</span>
          <h2 className="mt-6 max-w-xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight xl:text-6xl">
            From source to dispatch.
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-steel-200">
            A disciplined flow that turns recovered metal into furnace-ready material — sorted, inspected and
            documented at every stage.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
              Scroll <span className="text-red">&rarr;</span>
            </span>
            <span className="hidden text-xs uppercase tracking-[0.16em] text-white/35 xl:inline">
              {processSteps.length} stages
            </span>
          </div>
        </div>

        {processSteps.map((step, i) => (
          <div
            key={step.no}
            className={`process-card flex h-full w-[36vw] max-w-[520px] shrink-0 flex-col justify-center border-l border-white/10 px-10 2xl:px-16 ${
              i === 0 ? 'bg-white/[0.02]' : ''
            }`}
          >
            <span className="font-display text-7xl font-extrabold text-white/10">{step.no}</span>
            <h3 className="mt-6 font-display text-3xl font-bold uppercase tracking-tight">{step.title}</h3>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-steel-200">{step.body}</p>
            <div className="mt-8 h-px w-16 bg-red" />
          </div>
        ))}

        <div className="w-[10vw] shrink-0" aria-hidden="true" />
      </div>

      {/* Soft edge cue before scroll (desktop) */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-ink via-ink/40 to-transparent lg:block"
        aria-hidden="true"
      />

      {/* Step progress rail — desktop */}
      <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-10 hidden px-10 lg:block 2xl:px-24">
        <div className="flex max-w-[52vw] items-center gap-2 2xl:max-w-[920px]">
          {processSteps.map((step) => (
            <span
              key={step.no}
              className="h-px flex-1 bg-white/15 first:bg-red/60"
              title={step.title}
            />
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="px-5 py-20 sm:px-6 lg:hidden">
        <span className="eyebrow">The Process</span>
        <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          From source to dispatch.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-200">
          A disciplined flow that turns recovered metal into furnace-ready material — sorted, inspected and
          documented at every stage.
        </p>
        <div className="mt-12 space-y-px border-t border-white/10">
          {processSteps.map((step) => (
            <div key={step.no} className="border-b border-white/10 py-7">
              <div className="flex items-baseline gap-5">
                <span className="font-display text-sm font-bold text-red">{step.no}</span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{step.title}</h3>
              </div>
              <p className="mt-3 pl-10 text-sm leading-relaxed text-steel-200">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
