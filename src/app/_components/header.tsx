import Link from "next/link";
import ProfileButton from "./profile-button";

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b border-ink/20 pb-4 mb-16 mt-8">
      <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-ink">
        <Link href="/" className="hover:text-stamp transition-colors">
          PenultimoFantaUomo
        </Link>
      </h2>
      <ProfileButton />
    </div>
  );
};

export default Header;

