"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fmtNum, type Governorate } from "@/lib/plan";

/**
 * The eleven governorate totals, each numeral typeset at a size proportional to
 * √value so Cairo's 96.2 towers over Minya's 4.5 while the smallest stays
 * comfortably readable. Sizes are the page's hero image, not decoration.
 *
 * Each size is emitted as `max(floor, min(desktop, Nvw))` so the wall scales
 * with the viewport instead of overflowing it on a phone.
 */
const MIN_PX = 30;
const MAX_PX = 172;
/** viewport width at which a numeral reaches its full desktop size */
const FULL_AT = 900;

function sizeFor(bn: number, maxBn: number): string {
  const t = Math.sqrt(bn) / Math.sqrt(maxBn);
  const px = Math.round(MIN_PX + (MAX_PX - MIN_PX) * t);
  const vw = ((px / FULL_AT) * 100).toFixed(2);
  return `max(${MIN_PX}px, min(${px}px, ${vw}vw))`;
}

export default function NumeralWall({ govs }: { govs: Governorate[] }) {
  // One orchestrated page-load moment: the eleven start equal, then resize to
  // true proportion. Skipped entirely under prefers-reduced-motion (CSS).
  const [state, setState] = useState<"flat" | "true">("flat");

  useEffect(() => {
    const id = requestAnimationFrame(() => setState("true"));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxBn = Math.max(...govs.map((g) => g.totalBn));

  return (
    <ol className="wall" data-state={state}>
      {govs.map((g, i) => {
        const size = sizeFor(g.totalBn, maxBn);
        return (
          <li
            key={g.gov}
            className={`wall-item${i > 2 ? " wall-item--rest" : ""}`}
            style={{ "--size": size } as React.CSSProperties}
          >
            <Link
              href={{ pathname: "/data", query: { gov: g.gov } }}
              className="wall-link"
            >
              <span
                className="wall-num"
                style={{ transitionDelay: `${i * 55}ms` }}
              >
                {fmtNum(g.totalBn)}
              </span>
              <span className="wall-name">{g.gov}</span>
              <span className="sr">
                {" "}
                — {fmtNum(g.totalBn)} مليار جنيه، أي {g.sharePct}% من إجمالي
                الاستثمارات في المحافظات الإحدى عشرة
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
