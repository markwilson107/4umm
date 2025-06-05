import Link from "next/link";
import Auth from "./Auth";
import Logo from "@/assets/logo";

function Header() {
  return (
    <header className="flex items-center justify-between h-[50px] sm:h-[60px] bg-header px-3 sm:px-6">
      <Link href="/" className="flex text-2xl sm:text-3xl text-textSecondary font-bold items-center gap-3">
        <Logo className="w-7 h-7 sm:w-8 sm:h-8" />
        4umm
      </Link>
      <Auth />
    </header>
  );
}

export default Header;
