import UploadBox from './UploadBox';
import Disclaimer from './Disclaimer';

export default function Hero() {
  return (
    <div className="mx-auto max-w-[860px] px-6 pb-16 pt-20 text-center">
      <div className="mb-7 inline-block rounded-[20px] border border-coral-border bg-coral-soft px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[2px] text-coral">
        Plain English. Every time.
      </div>

      <h1 className="mb-2.5 font-display text-[3.4rem] leading-[1.12] tracking-tightest text-ink max-md:text-[2.4rem] max-md:tracking-tighter">
        Your legal documents,
        <br />
        <em className="not-italic brand-italic">finally clear.</em>
      </h1>

      <p className="mb-5 font-display italic text-[1.2rem] text-[#B0A090]">
        We don&apos;t speak legalese.
      </p>

      <p className="mx-auto mb-12 max-w-[520px] text-base font-light leading-[1.7] text-muted">
        Your same legal document with the jargon replaced. Written in plain English, easy to follow
        and simplified for us non-lawyers.
      </p>

      <UploadBox />
      <Disclaimer />
    </div>
  );
}
