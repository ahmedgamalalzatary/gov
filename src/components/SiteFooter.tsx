import Link from "next/link";
import { meta } from "@/lib/plan";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <h2>عن أثر</h2>
          <p>
            أثر يعرض خطة المواطن الاستثمارية للعام المالي {meta.year} كما نشرتها
            وزارة التخطيط والتنمية الاقتصادية، دون إعادة حساب أو تقدير.
          </p>
        </div>

        <div>
          <h2>المصدر</h2>
          <p>{meta.source}</p>
        </div>

        <div>
          <h2>المستندات الأصلية</h2>
          <ul>
            {meta.docs.map((f) => (
              <li key={f}>
                <a href={`/${encodeURIComponent(f)}`} download>
                  {f}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>تنقّل</h2>
          <ul>
            <li>
              <Link href="/">الصفحة الرئيسية</Link>
            </li>
            <li>
              <Link href="/data">جدول البيانات</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
