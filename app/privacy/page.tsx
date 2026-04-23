import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy & Zero-Retention Architecture',
  description:
    'Clarafy operates a strict zero-retention architecture. Your document never touches disk.',
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[760px] px-6 pb-24 pt-16">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-block rounded-[20px] border border-coral-border bg-coral-soft px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[2px] text-coral">
            Document data & privacy
          </div>
          <h1 className="mb-3 font-display text-[2.4rem] leading-[1.1] tracking-tighter text-ink">
            Zero-retention,
            <br />
            <em className="not-italic brand-italic">by design.</em>
          </h1>
          <p className="mx-auto max-w-[520px] text-[0.95rem] font-light leading-[1.7] text-muted">
            Your document never touches disk. Version 1.0 · Effective April 2026.
          </p>
        </div>

        <article className="doc-prose">
          <h2>1. Overview &amp; Scope</h2>
          <p>
            This policy governs all document data processed by Clarafy (the &ldquo;Service&rdquo;).
            It applies to every document uploaded to the Service, every translation produced, and
            every person who uses the Service, regardless of account type.
          </p>
          <p>
            We operate a strict <strong>Zero-Retention Architecture</strong>. This is not a default
            setting that can be changed — it is the fundamental design of the system. No
            administrator, employee, engineer, or third party can access your documents because
            they are never written to persistent storage.
          </p>

          <h2>2. What Happens to Your Document</h2>

          <h3>2.1 Upload — Temporary In-Memory Processing Only</h3>
          <p>When you upload a document:</p>
          <ul>
            <li>
              The file is transferred over an encrypted TLS connection directly into an isolated,
              ephemeral memory buffer.
            </li>
            <li>
              It is never written to disk, a database, a cloud object store, a CDN, a cache layer,
              or any other form of persistent storage.
            </li>
            <li>
              No copy, thumbnail, preview, hash, or metadata fingerprint of your document is
              retained.
            </li>
            <li>The upload session is isolated per user; no data co-mingles across sessions.</li>
          </ul>

          <h3>2.2 Translation — Processed and Destroyed</h3>
          <p>During translation:</p>
          <ul>
            <li>
              The in-memory buffer is passed to the translation engine. Processing occurs in a
              segregated, sandboxed environment.
            </li>
            <li>
              Once the translation output has been generated, the input buffer is immediately and
              irreversibly overwritten and released.
            </li>
            <li>
              The translation engine retains no copy of the source text or document structure
              after the operation completes.
            </li>
            <li>No human reviews your document at any stage of this process.</li>
          </ul>

          <h3>2.3 Output — Your Session, Your Responsibility</h3>
          <p>The translated document:</p>
          <ul>
            <li>
              Is held exclusively in your browser&apos;s active session memory. It does not touch
              our servers after generation.
            </li>
            <li>
              Is destroyed automatically when you close the browser tab, navigate away, or your
              session times out.
            </li>
            <li>
              Is your responsibility to download before ending your session. We cannot recover it
              once the session ends — there is no copy anywhere.
            </li>
          </ul>

          <h2>3. What We Will Never Do</h2>
          <ul>
            <li>We will never store your document.</li>
            <li>We will never read your document manually or allow any human to review it.</li>
            <li>We will never use your document to train or fine-tune a model.</li>
            <li>We will never sell, license, or share document data with any third party.</li>
            <li>
              We will never retain translations, drafts, or intermediate artefacts of your
              document beyond your live session.
            </li>
          </ul>

          <h2>4. Technical Architecture — How Zero-Retention is Enforced</h2>
          <p>
            Our Zero-Retention guarantee is enforced at the architecture level, not by policy
            alone. The following technical controls make data retention structurally impossible:
          </p>
          <ul>
            <li>
              Document processing runs in stateless, ephemeral compute with read-only filesystems
              — there is no writable location to persist files to.
            </li>
            <li>
              Memory buffers are explicitly zeroed and released immediately after the translation
              response is returned.
            </li>
            <li>
              No logging middleware captures document bodies, request payloads, or response
              contents.
            </li>
            <li>
              Infrastructure is configured to refuse persistent-storage writes for document data
              at the network level.
            </li>
          </ul>

          <h2>5. Session Data &amp; Minimal Operational Logs</h2>
          <p>
            We collect the absolute minimum operational data required to run the service securely.
            This never includes document content:
          </p>
          <ul>
            <li>
              Session identifier (randomly generated, not linked to your identity unless you are
              logged in)
            </li>
            <li>Timestamp of request start and completion</li>
            <li>File size and detected MIME type (not content)</li>
            <li>Source and target language pair</li>
            <li>Success or error status of the translation job</li>
            <li>Anonymised IP address for rate-limiting and abuse prevention only</li>
          </ul>
          <p>
            These operational logs are automatically purged after 30 days. They cannot be used to
            reconstruct your document or its content.
          </p>

          <h2>6. Your Rights &amp; User Responsibilities</h2>

          <h3>6.1 What You Must Do</h3>
          <ul>
            <li>Download your translation before ending your session — we can&apos;t recover it.</li>
            <li>Not upload documents you don&apos;t have the right to process.</li>
            <li>
              Treat every translation as a <em>translation</em>, not legal advice. Always refer to
              the original document and consult a qualified solicitor before acting.
            </li>
          </ul>

          <h3>6.2 Your Data Rights</h3>
          <p>
            Under applicable data protection law (including UK GDPR and EU GDPR where relevant),
            you have the following rights regarding operational session data we hold:
          </p>
          <ul>
            <li>Right of access — request a copy of any operational data associated with your account</li>
            <li>Right to erasure — request deletion of operational logs linked to your account</li>
            <li>Right to object — object to processing of your data</li>
            <li>Right to portability — receive your data in a machine-readable format</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the address in Section 9. Because we
            hold no document content, erasure requests apply only to operational session metadata.
          </p>

          <h2>7. Third Parties &amp; Sub-processors</h2>
          <p>
            We do not sell, license, or share your document data with any third party. Where we
            engage infrastructure sub-processors (e.g., cloud compute providers), they operate
            under strict data processing agreements that:
          </p>
          <ul>
            <li>Prohibit access to customer data</li>
            <li>
              Require the same zero-retention controls to be enforced at the infrastructure level
            </li>
            <li>Cannot override or circumvent our ephemeral processing architecture</li>
          </ul>
          <p>A current list of approved sub-processors is available on request.</p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We will notify users of any material changes to this policy at least 30 days before
            they take effect. We will never retroactively change the data handling practices that
            applied to documents you have already processed. The Zero-Retention commitment is a
            permanent, foundational principle of this Service.
          </p>

          <h2>9. Contact &amp; Complaints</h2>
          <p>
            If you have questions about this policy, wish to exercise your data rights, or want to
            raise a concern:
          </p>
          <ul>
            <li>Email: privacy@clarafy.ai</li>
            <li>Data Protection Officer: dpo@clarafy.ai</li>
            <li>Postal address: [Your Company Name, Address]</li>
          </ul>
          <p>
            If you are not satisfied with our response, you have the right to lodge a complaint
            with your relevant supervisory authority (e.g., the ICO in the UK, or your national DPA
            in the EU).
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
