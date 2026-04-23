export default function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mx-auto mt-4 flex max-w-[600px] items-start gap-2 rounded-[10px] border border-rule bg-warmer px-4 py-3 ${className}`}
    >
      <div className="mt-[1px] shrink-0 text-[0.8rem]" aria-hidden>
        ⚖️
      </div>
      <p className="text-[0.7rem] font-light leading-[1.6] text-hush">
        Clarafy is a translation tool only, not a legal service. Always refer to your original
        document and consult a qualified solicitor for legal advice.
      </p>
    </div>
  );
}
