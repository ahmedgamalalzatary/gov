import Image from "next/image";
import Link from "next/link";

/** Masthead. The deep-lapis treatment comes from a `.field-deep` ancestor. */
export default function SiteHeader({ current }: { current: "home" | "data" }) {
  return (
    <header className="wrap">
      <div className="masthead">
        <Link href="/" className="brand">
          <Image
            src="/logo.png"
            alt="أثر"
            width={38}
            height={38}
            className="brand-mark"
            priority
          />
        </Link>

        <nav className="nav" aria-label="أقسام الموقع">
          <Link href="/" aria-current={current === "home" ? "page" : undefined}>
            الصفحة الرئيسية
          </Link>
          <Link
            href="/data"
            aria-current={current === "data" ? "page" : undefined}
          >
            البيانات
          </Link>
        </nav>
      </div>
    </header>
  );
}
