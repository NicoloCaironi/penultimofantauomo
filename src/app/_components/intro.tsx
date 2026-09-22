import ProfileButton from "./profile-button";

type IntroProps = {
  year?: string;
  issue?: string;
  league?: string;
};

//TODO : aggiungere anno e issue aggiornati automaticamente in base alla data di pubblicazione dell'ultimo articolo
export default function Intro({
  year = "2026/2027",
  issue = "1",
  league = "Lega di Andre Chiurco",
}: IntroProps) {
  return (
    <header className="pt-6 pb-6 px-4 md:px-11">
      {/* Riga superiore di testata: anno, lega, prezzo e pulsante profilo */}
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[.15em] uppercase text-meta mb-6 border-b border-ink/20 pb-3">
        <div className="hidden sm:block">
          <span>Anno {year} · N. {issue}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-center">
          <span className="sm:hidden">Anno {year} · </span>
          <span>{league}</span>
          <span aria-hidden="true">|</span>
          <span>3€</span>
        </div>

        <div className="flex items-center">
          <ProfileButton />
        </div>
      </div>

      <div className="text-center">
        <h1
          className="font-serif text-[62px] sm:text-[78px] md:text-[92px] leading-[0.9] tracking-[-0.02em] text-ink"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,.35)" }}
        >
          PenultimoFantaUomo
        </h1>

        <div className="mt-6 border-t border-b border-ink/25 py-3 inline-block px-8">
          <p className="font-serif italic text-[18px] sm:text-[20px] leading-[1.4] text-ink2">
            Cronaca settimanale di un fantacalcio che nessuno voleva organizzare e che forse non si farà.
          </p>
        </div>
      </div>
    </header>
  );
}