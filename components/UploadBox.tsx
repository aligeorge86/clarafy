'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The shared upload surface. Used on the landing page (where it redirects to
 * /translate on drop) and on /translate itself (where it triggers the upload
 * directly via the `onFile` callback).
 */
export default function UploadBox({
  onFile,
  compact = false,
}: {
  onFile?: (file: File) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDrag, setIsDrag] = useState(false);

  function handleFile(file: File) {
    if (onFile) {
      onFile(file);
      return;
    }
    // Landing-page behaviour: stash the file and jump to /translate.
    // We use sessionStorage of the File object via a quick object-URL —
    // but File objects don't survive navigation, so the simpler path is
    // to just redirect and let /translate own the upload.
    router.push('/translate');
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className={`upload-dropzone mx-auto max-w-[600px] cursor-pointer rounded-[20px] border-2 border-dashed border-crust bg-white ${
        isDrag ? 'is-drag' : ''
      } ${compact ? 'px-8 py-9' : 'px-10 py-[52px]'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDrag(true);
      }}
      onDragLeave={() => setIsDrag(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload a document"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-coral-soft text-[1.6rem]"
        aria-hidden
      >
        📄
      </div>

      <div className="text-center">
        <div className="mb-2 font-display text-[1.2rem] tracking-[-0.3px] text-ink">
          Drop your document here
        </div>
        <div className="mb-7 text-[0.82rem] font-light leading-[1.5] text-hush">
          PDF or Word document · We&apos;ll translate it instantly
        </div>
      </div>

      <button
        type="button"
        className="mb-3 block w-full rounded-[10px] bg-coral px-9 py-[14px] font-body text-[0.9rem] font-semibold text-white shadow-coral-lg transition-transform hover:-translate-y-0.5"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Upload Document
      </button>
      <div className="text-center text-[0.7rem] tracking-[0.5px] text-whisper">
        Accepts .pdf and .docx
      </div>
    </div>
  );
}
