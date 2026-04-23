const steps = [
  {
    n: '01',
    title: (
      <>
        Upload your <em className="not-italic brand-italic">document</em>
      </>
    ),
    body: 'Drop in any legal letter, contract, tenancy agreement, court notice — anything written in legalese.',
  },
  {
    n: '02',
    title: (
      <>
        We <em className="not-italic brand-italic">translate</em> it
      </>
    ),
    body: 'Clarafy rewrites every clause in plain English at a level anyone can understand — same structure, no jargon.',
  },
  {
    n: '03',
    title: (
      <>
        Download and <em className="not-italic brand-italic">understand</em>
      </>
    ),
    body: 'Get a clean PDF back — your document, finally in a language that makes sense. Then speak to a solicitor if you need to act.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mt-[72px] border-y border-rule bg-white px-6 py-16">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-10 text-center text-[0.65rem] uppercase tracking-[2.5px] text-whisper">
          How it works
        </div>
        <div className="grid grid-cols-3 gap-10 max-md:grid-cols-1 max-md:gap-7">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="mb-3 font-display text-[2rem] font-bold text-coral opacity-40">
                {s.n}
              </div>
              <div className="mb-2 font-display text-[1.1rem] tracking-[-0.3px] text-ink">
                {s.title}
              </div>
              <div className="text-[0.85rem] font-light leading-[1.7] text-muted">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
