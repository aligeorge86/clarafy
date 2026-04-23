import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-warm px-6 py-10">
      <div className="mx-auto flex max-w-[860px] flex-col items-center justify-between gap-3 md:flex-row">
        <div className="font-display text-lg tracking-tighter text-ink">
          Clar<em className="not-italic brand-italic">a</em>fy
        </div>
        <nav className="flex gap-6 text-[0.8rem] text-muted">
          <Link href="/#how" className="hover:text-ink">
            How it works
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/translate" className="hover:text-ink">
            Translate a document
          </Link>
        </nav>
        <div className="text-[0.7rem] font-light text-whisper">
          © {new Date().getFullYear()} Clarafy.ai · We don&apos;t speak legalese.
        </div>
      </div>
    </footer>
  );
}
