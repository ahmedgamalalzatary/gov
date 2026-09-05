"use client";

import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  fmtNum,
  governorates,
  KIND_LABEL,
  meta,
  records,
  type Kind,
  type PlanRow,
} from "@/lib/plan";

const PAGE_SIZE = 60;

type SortKey = "gov" | "sector" | "indicator" | "value";
type SortDir = "asc" | "desc";

/** Strip tashkeel and unify alef/ya/ta-marbuta so search matches how people type. */
function foldArabic(s: string): string {
  return s
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase();
}

/** Pre-folded haystack per row, built once. */
const HAYSTACK = new Map<number, string>(
  records.map((r) => [
    r.id,
    foldArabic(
      [
        r.gov,
        r.govEn,
        r.sector,
        r.section,
        r.program,
        r.indicator,
        r.value,
        r.unit,
        r.project,
        r.cost,
        r.agency,
        r.beneficiaries,
        r.notes,
      ].join(" ")
    ),
  ])
);

/** Comparable magnitude for the value column: money in EGP millions sorts
 *  against money; everything else falls back to its own number. */
function magnitude(r: PlanRow): number {
  if (r.egpM !== null) return r.egpM;
  return r.num ?? -Infinity;
}

export default function DataExplorer() {
  const params = useSearchParams();

  const [q, setQ] = useState("");
  const [gov, setGov] = useState("");
  const [sector, setSector] = useState("");
  const [program, setProgram] = useState("");
  const [kind, setKind] = useState("");
  const [onlyMoney, setOnlyMoney] = useState(false);
  const [hideQueried, setHideQueried] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("gov");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  // deep link from the landing page: /data?gov=القاهرة
  useEffect(() => {
    const g = params.get("gov");
    if (g) setGov(g);
    const s = params.get("sector");
    if (s) setSector(s);
  }, [params]);

  const deferredQ = useDeferredValue(q);

  const filtered = useMemo(() => {
    const needle = foldArabic(deferredQ.trim());
    const out = records.filter((r) => {
      if (gov && r.gov !== gov) return false;
      if (sector && r.sector !== sector) return false;
      if (program && r.program !== program) return false;
      if (kind && r.kind !== kind) return false;
      if (onlyMoney && r.egpM === null) return false;
      if (hideQueried && r.needsReview) return false;
      if (needle && !HAYSTACK.get(r.id)!.includes(needle)) return false;
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    const cmp = (a: PlanRow, b: PlanRow): number => {
      switch (sortKey) {
        case "value": {
          const d = magnitude(a) - magnitude(b);
          return d !== 0 ? d * dir : a.id - b.id;
        }
        case "sector":
          return a.sector.localeCompare(b.sector, "ar") * dir || a.id - b.id;
        case "indicator":
          return (
            a.indicator.localeCompare(b.indicator, "ar") * dir || a.id - b.id
          );
        case "gov":
        default:
          return a.gov.localeCompare(b.gov, "ar") * dir || a.id - b.id;
      }
    };
    return out.sort(cmp);
  }, [
    deferredQ,
    gov,
    sector,
    program,
    kind,
    onlyMoney,
    hideQueried,
    sortKey,
    sortDir,
  ]);

  // any filter change returns to the first page
  useEffect(() => {
    setPage(0);
  }, [deferredQ, gov, sector, program, kind, onlyMoney, hideQueried]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  // Describe the result set without adding up money: the source documents repeat
  // the same governorate figure under several headings, so a sum would double-count.
  const govsShown = useMemo(
    () => new Set(filtered.map((r) => r.gov)).size,
    [filtered]
  );
  const flagged = useMemo(
    () => filtered.filter((r) => r.needsReview).length,
    [filtered]
  );

  const dirty =
    Boolean(q || gov || sector || program || kind) || onlyMoney || hideQueried;

  function reset() {
    setQ("");
    setGov("");
    setSector("");
    setProgram("");
    setKind("");
    setOnlyMoney(false);
    setHideQueried(false);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "value" ? "desc" : "asc");
    }
  }

  function sortProps(key: SortKey) {
    const active = sortKey === key;
    return {
      "data-active": active,
      "aria-sort": (active
        ? sortDir === "asc"
          ? "ascending"
          : "descending"
        : "none") as "ascending" | "descending" | "none",
      onClick: () => toggleSort(key),
    };
  }

  return (
    <div className="wrap data-layout">
      <form className="rail" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="rail-label" htmlFor="q">
            بحث
          </label>
          <input
            id="q"
            className="search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="مدرسة، مياه شرب، كوبري…"
            autoComplete="off"
          />
        </div>

        <fieldset className="rail-group">
          <legend>المحافظة</legend>
          <div className="chips">
            <button
              type="button"
              className="chip"
              aria-pressed={gov === ""}
              onClick={() => setGov("")}
            >
              الكل
            </button>
            {governorates.map((g) => (
              <button
                key={g.gov}
                type="button"
                className="chip"
                aria-pressed={gov === g.gov}
                onClick={() => setGov(gov === g.gov ? "" : g.gov)}
              >
                {g.gov}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="rail-label" htmlFor="sector">
            القطاع
          </label>
          <select
            id="sector"
            className="select"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="">كل القطاعات</option>
            {meta.sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="rail-group">
          <legend>البرنامج</legend>
          <div className="chips">
            <button
              type="button"
              className="chip"
              aria-pressed={program === ""}
              onClick={() => setProgram("")}
            >
              الكل
            </button>
            {meta.programs.map((p) => (
              <button
                key={p}
                type="button"
                className="chip"
                aria-pressed={program === p}
                onClick={() => setProgram(program === p ? "" : p)}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="rail-label" htmlFor="kind">
            نوع البيان
          </label>
          <select
            id="kind"
            className="select"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">كل الأنواع</option>
            {meta.kinds.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k as Kind]}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="rail-group">
          <legend>تضييق</legend>
          <label className="check">
            <input
              type="checkbox"
              checked={onlyMoney}
              onChange={(e) => setOnlyMoney(e.target.checked)}
            />
            <span>البنود التي لها مبلغ بالجنيه فقط</span>
          </label>
          <label className="check" style={{ marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              checked={hideQueried}
              onChange={(e) => setHideQueried(e.target.checked)}
            />
            <span>
              استبعاد ما عليه «يحتاج مراجعة» (
              <span className="num">{fmtNum(meta.needsReview)}</span> بندًا)
            </span>
          </label>
        </fieldset>

        <button
          type="button"
          className="rail-reset"
          onClick={reset}
          disabled={!dirty}
        >
          مسح كل الفلاتر
        </button>
      </form>

      <section aria-label="النتائج">
        <div className="results-bar">
          <p className="results-count" aria-live="polite">
            <b className="num">{fmtNum(filtered.length)}</b> بندًا
            {filtered.length !== records.length && (
              <span>
                {" "}
                من <span className="num">{fmtNum(records.length)}</span>
              </span>
            )}
            <span>
              {" "}
              · <span className="num">{govsShown}</span> محافظة
              {flagged > 0 && (
                <>
                  {" "}
                  · <span className="num">{fmtNum(flagged)}</span> تحتاج مراجعة
                </>
              )}
            </span>
          </p>
        </div>

        {slice.length === 0 ? (
          <div className="table-frame">
            <div className="empty">
              <p>لا بنود تطابق هذا البحث.</p>
              <button type="button" className="pgbtn" onClick={reset}>
                امسح الفلاتر
              </button>
            </div>
          </div>
        ) : (
          <div className="table-frame">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col" aria-sort={sortProps("gov")["aria-sort"]}>
                    <button className="sortbtn" type="button" {...sortProps("gov")}>
                      المحافظة <i aria-hidden="true">▾</i>
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortProps("sector")["aria-sort"]}>
                    <button
                      className="sortbtn"
                      type="button"
                      {...sortProps("sector")}
                    >
                      القطاع <i aria-hidden="true">▾</i>
                    </button>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortProps("indicator")["aria-sort"]}
                  >
                    <button
                      className="sortbtn"
                      type="button"
                      {...sortProps("indicator")}
                    >
                      البيان <i aria-hidden="true">▾</i>
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortProps("value")["aria-sort"]}>
                    <button
                      className="sortbtn"
                      type="button"
                      {...sortProps("value")}
                    >
                      القيمة <i aria-hidden="true">▾</i>
                    </button>
                  </th>
                  <th scope="col">البرنامج</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r.id}>
                    <td className="c-gov">{r.gov}</td>
                    <td className="c-sector">{r.sector}</td>
                    <td className="c-indicator">
                      {r.indicator || "—"}
                      {r.project && <small>{r.project}</small>}
                      {r.notes && <small>{r.notes}</small>}
                      {r.needsReview && (
                        <small>
                          <span className="flag">يحتاج مراجعة</span>
                        </small>
                      )}
                    </td>
                    <td className="c-value" data-kind={r.kind}>
                      {r.value ? (
                        <>
                          <span className="num">{r.value}</span>
                          {r.unit && <em>{r.unit}</em>}
                        </>
                      ) : (
                        <span className="flag">لم يُذكر</span>
                      )}
                    </td>
                    <td className="c-sector">{r.program}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pageCount > 1 && (
          <div className="pager">
            <span className="pager-at">
              صفحة <span className="num">{safePage + 1}</span> من{" "}
              <span className="num">{pageCount}</span>
            </span>
            <div className="pager-btns">
              <button
                type="button"
                className="pgbtn"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage === 0}
              >
                السابق
              </button>
              <button
                type="button"
                className="pgbtn"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= pageCount - 1}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
