import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <section id="examples" className="mx-auto max-w-[860px] px-6 py-16 text-center">
          <div className="mb-6 text-[0.65rem] uppercase tracking-[2.5px] text-whisper">
            An example
          </div>
          <h2 className="mb-4 font-display text-[1.8rem] tracking-[-0.5px] text-ink">
            From this…
            <em className="not-italic brand-italic"> to this.</em>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-rule bg-white p-6 text-left">
              <div className="mb-2 text-[0.65rem] uppercase tracking-[2px] text-whisper">
                Original clause
              </div>
              <p className="font-display text-[0.95rem] leading-[1.7] text-ink">
                4.3.1 The Client shall pay each undisputed invoice within thirty (30) days of
                receipt. Time for payment shall not be of the essence of this Agreement.
              </p>
            </article>
            <article className="rounded-2xl border border-coral-border bg-coral-soft p-6 text-left">
              <div className="mb-2 text-[0.65rem] uppercase tracking-[2px] text-coral">
                Clarafy translation
              </div>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                <strong>In plain English:</strong> The Client must pay any invoice they&apos;re
                not disputing within 30 days of receiving it. Late payment isn&apos;t automatically
                a breach on its own — but it does trigger interest charges.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
