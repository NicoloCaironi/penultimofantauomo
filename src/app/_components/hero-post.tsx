import Link from "next/link";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import markdownToHtml from "@/lib/markdownToHtml";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
  content: string;
  giornata?: number;
};

export async function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  content,
  giornata,
}: Props) {
  const firstParagraph = content.trim().split(/\n\s*\n/)[0] ?? "";
  const bodyPreviewHtml = await markdownToHtml(firstParagraph);

  return (
    <section>
      {giornata ? (
        <p className="font-mono text-[11px] tracking-[.2em] uppercase text-stamp mb-3">
          {giornata}ª giornata
        </p>
      ) : null}

      <h1 className="font-serif text-[68px] leading-[0.98] text-ink [text-wrap:balance] mb-5">
        <Link href={`/posts/${slug}`} className="hover:text-stamp transition-colors">
          {title}
        </Link>
      </h1>

      <p className="font-serif italic text-[20px] leading-[1.4] text-ink2 mb-6 max-w-2xl">
        {excerpt}
      </p>

      <figure className="mb-6">
        <CoverImage title={title} src={coverImage} slug={slug} />
        <figcaption className="mt-2 text-[13px] italic text-muted">
          {title}
        </figcaption>
      </figure>

      <div
        className="font-sans text-[17px] leading-[1.68] text-ink text-justify columns-2 gap-8 [column-rule:1px_solid_rgba(27,24,17,.22)] first-letter:font-serif first-letter:text-[62px] first-letter:leading-[0.78] first-letter:float-left first-letter:pr-[9px] first-letter:pt-[5px]"
        dangerouslySetInnerHTML={{ __html: bodyPreviewHtml }}
      />

      <div className="mt-6 flex items-center justify-between border-t border-dotted border-ink/40 pt-4">
        <Avatar name={author.name} picture={author.picture} />
        <Link
          href={`/posts/${slug}`}
          className="font-mono text-[11px] tracking-[.15em] uppercase text-stamp hover:underline"
        >
          Continua a pagina 3 →
        </Link>
      </div>
    </section>
  );
}