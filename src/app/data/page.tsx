import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DataExplorer from "@/components/DataExplorer";
import { fmtNum, meta } from "@/lib/plan";

export const metadata: Metadata = {
  title: "جدول البيانات",
  description: `ابحث وصفِّ ${meta.records} بندًا من خطة المواطن الاستثمارية ${meta.year} في ${meta.governorates} محافظة.`,
};

export default function DataPage() {
  return (
    <>
      <SiteHeader current="data" />

      <main id="main">
        <div className="wrap data-head">
          <h1>خطة المواطن الاستثمارية {meta.year}</h1>
          <p>
            <span className="num">{fmtNum(meta.records)}</span> بندًا في{" "}
            <span className="num">{meta.governorates}</span> محافظة، كما وردت في
            المستندات المنشورة. ابحث بالكلمة، أو صفِّ بالمحافظة والقطاع والبرنامج،
            ثم رتِّب بالقيمة.
          </p>
        </div>

        <Suspense fallback={null}>
          <DataExplorer />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
