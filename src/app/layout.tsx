import type { Metadata } from "next";
import { Reem_Kufi, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// Kufic — the script carved into Egyptian monuments; motivated by the name أثر
const display = Reem_Kufi({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "أثر — أين تُنفَق أموال الدولة؟",
    template: "%s | أثر",
  },
  description:
    "أثر يعرض خطة المواطن الاستثمارية 2023/2024 كما نشرتها وزارة التخطيط: ٩٣٦ بندًا في ١١ محافظة، مع مصدر كل رقم.",
  openGraph: {
    title: "أثر — أين تُنفَق أموال الدولة؟",
    description:
      "خطة المواطن الاستثمارية 2023/2024: ٩٣٦ بندًا في ١١ محافظة، مع مصدر كل رقم.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip" href="#main">
          تخطَّ إلى المحتوى
        </a>
        {children}
      </body>
    </html>
  );
}
