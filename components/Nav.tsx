import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-rule bg-warm px-12 max-md:px-5">
      <Link href="/" className="font-display text-2xl leading-none tracking-tighter text-ink">
        Clar<em className="not-italic brand-italic">a</em>fy
      </Link>
      <div className="flex items-center gap-8 max-md:hidden">
        <Link href="/#how" className="text-[0.85rem] font-normal text-muted hover:text-ink">
          How it works
        </Link>
        <Link href="/#examples" className="text-[0.85rem] font-normal text-muted hover:text-ink">
          Examples
        </Link>
        <Link href="/privacy" className="text-[0.85rem] font-normal text-muted hover:text-ink">
          Privacy
        </Link>
        <Link
          href="/translate"
          className="rounded-lg bg-coral px-5 py-2.5 text-[0.85rem] font-medium text-white shadow-coral transition-transform hover:-translate-y-0.5"
        >
          Try for free
        </Link>
      </div>
    </nav>
  );
}
