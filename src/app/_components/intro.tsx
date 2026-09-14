type IntroProps = {
  year?: string;
  issue?: string;
  league?: string;
};

//TODO : aggiungere anno e isse aggiornati automaticamente in base alla data di pubblicazione dell'ultimo articolo
export default function Intro({
  year = "2026/2027",
  issue = "1",
  league = "Lega di Andre Chiurco",
}: IntroProps) {
  return (
    <header className="text-center pt-10 pb-6">
      <div className="flex justify-center items-center gap-3 font-mono text-[11px] tracking-[.15em] uppercase text-meta mb-6">
        <span>Anno {year} · N. {issue}</span>
        <span aria-hidden="true">|</span>
        <span>{league}</span>
        <span aria-hidden="true">|</span>
        <span>3€</span>
      </div>

      <h1
        className="font-serif text-[92px] leading-[0.9] tracking-[-0.02em] text-ink"
        style={{ textShadow: "0 1px 0 rgba(255,255,255,.35)" }}
      >
        PenultimoFantaUomo
      </h1>

      <div className="mt-6 border-t border-b border-ink/25 py-3 inline-block px-8">
        <p className="font-serif italic text-[20px] leading-[1.4] text-ink2">
          Cronaca settimanale di un fantacalcio che nessuno voleva organizzare e che forse non si farà.
        </p>
      </div>
    </header>
  );
}