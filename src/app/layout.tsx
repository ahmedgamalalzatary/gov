import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
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
      className={`${cairo.variable} h-full antialiased`}
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
