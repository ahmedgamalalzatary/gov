import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NumeralWall from "@/components/NumeralWall";
import { fmtNum, governorates, meta } from "@/lib/plan";

export default function Home() {
  const top2 = governorates[0].totalBn + governorates[1].totalBn;
  const top2Pct = Math.round((top2 / meta.totalBn) * 100);
  const maxBn = governorates[0].totalBn;

  return (
    <>
      <div className="field-deep">
        <SiteHeader current="home" />

        <main id="main">
          <section className="wrap hero">
            <h1 className="hero-lede">
              كل رقم في هذه الصفحة هو أثر يتركه الإنفاق العام في محافظة، بالمليار
              جنيه.
            </h1>

            <NumeralWall govs={governorates} />

            <p className="hero-caption">
              <span>
                <b>خطة المواطن الاستثمارية {meta.year}</b> — إجمالي الاستثمارات
                العامة الموجهة إلى <b>{meta.governorates}</b> محافظة:{" "}
                <b>
                  <span className="num">{fmtNum(meta.totalBn)}</span> مليار جنيه
                </b>
                . اضغط أي رقم لتصفية الجدول على محافظته.
              </span>
            </p>
          </section>
        </main>
      </div>

      <section className="band">
        <div className="wrap">
          <p className="thesis">
            الأرقام أعلاه ليست موزّعة بالتساوي. القاهرة والجيزة وحدهما تستحوذان
            على{" "}
            <strong>
              <span className="num">{fmtNum(top2)}</span> مليار جنيه، أي{" "}
              <span className="num">{top2Pct}</span>% من الإجمالي
            </strong>
            ، بينما تتقاسم المحافظات التسع الباقية ما تبقّى. هذا الموقع لا يفسّر
            هذا التوزيع ولا يعيد حسابه؛ يعرضه كما نشرته وزارة التخطيط، بندًا
            بندًا، ليقرأه المواطن بنفسه.
          </p>
        </div>
      </section>

      <section className="band band--tint" aria-labelledby="film">
        <div className="wrap">
          <div className="band-head">
            <h2 id="film">الفيلم التعريفي</h2>
            <p>
              شرح مصوّر في دقائق: كيف تُبنى خطة الاستثمارات العامة، وكيف تقرأ
              نصيب محافظتك منها.
            </p>
          </div>

          <figure className="video-figure">
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/NHOwxtmtXn8"
                title="الفيلم التعريفي"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="band" aria-labelledby="expect">
        <div className="wrap">
          <div className="band-head">
            <h2 id="expect">ماذا تجد هنا</h2>
            <p>
              الموقع صفحتان: هذه الصفحة تشرح ما تنظر إليه، وصفحة البيانات تتيح لك
              البحث في كل بند على حدة.
            </p>
          </div>

          <div className="explain">
            <article>
              <h3>نصيب محافظتك</h3>
              <p>
                إجمالي الاستثمارات العامة الموجهة إلى {meta.governorates} محافظة،
                وعدد المشروعات في كل منها، وأكبر القطاعات التي ذهب إليها المال.
              </p>
            </article>

            <article>
              <h3>ما بُني فعلًا</h3>
              <p>
                البنود التي لا تُقاس بالجنيه: مدارس، فصول، وحدات صحية، نقاط
                إسعاف، محطات مياه، كيلومترات طرق مرصوفة، مراكز شباب، ومكاتب بريد.
              </p>
            </article>

            <article>
              <h3>مصدر كل رقم</h3>
              <p>
                كل بند في الجدول يحمل اسم المستند الذي جاء منه ورقم صفحته حيث
                توفّر، حتى تتمكن من الرجوع إلى الأصل والتحقق بنفسك.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="band band--tint" aria-labelledby="rank">
        <div className="wrap">
          <div className="band-head">
            <h2 id="rank">المحافظات مرتّبة بحسب نصيبها</h2>
            <p>
              الأرقام كما وردت في خطة كل محافظة. خانة عدد المشروعات فارغة حيث لم
              يذكر المصدر رقمًا صريحًا.
            </p>
          </div>

          <div className="rank-scroll">
            <table className="rank">
              <caption>
                إجمالي الاستثمارات العامة الموجهة للمحافظة، خطة {meta.year}
              </caption>
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "16%" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">الترتيب</span>
                  </th>
                  <th scope="col">المحافظة</th>
                  <th scope="col">الإجمالي</th>
                  <th scope="col">النسبة</th>
                  <th scope="col">عدد المشروعات</th>
                  <th scope="col">
                    <span className="sr">تمثيل نسبي</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {governorates.map((g, i) => (
                  <tr key={g.gov}>
                    <td className="rank-i num">{i + 1}</td>
                    <th scope="row" className="rank-gov">
                      <Link href={{ pathname: "/data", query: { gov: g.gov } }}>
                        {g.gov}
                      </Link>
                      <small>{g.govEn}</small>
                    </th>
                    <td className="rank-val">
                      <span className="num">{fmtNum(g.totalBn)}</span> مليار جنيه
                    </td>
                    <td className="rank-val num">{g.sharePct}%</td>
                    <td className="rank-val">
                      {g.projects ? (
                        <span className="num">{fmtNum(g.projects)}</span>
                      ) : (
                        <span className="flag">لم يُذكر</span>
                      )}
                    </td>
                    <td className="rank-bar">
                      <span
                        style={
                          {
                            "--w": `${(g.totalBn / maxBn) * 100}%`,
                          } as React.CSSProperties
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="honest">
        <div className="wrap">
          <div className="band-head">
            <h2 id="honest">ما لا يفعله هذا الموقع</h2>
          </div>

          <div className="note">
            <p>
              <strong>لا نجمع ولا نعيد حساب شيء.</strong> يعرض الموقع الأرقام كما
              وردت في المصدر. المستندات تعيد ذكر بيانات المحافظة نفسها في أكثر من
              قسم، فجمع الأعمدة يعطي نتائج مضلّلة؛ لذلك لا يُظهر الموقع أي إجمالي
              لم يذكره المصدر صريحًا.
            </p>
            <p>
              <strong>
                <span className="num">{fmtNum(meta.needsReview)}</span> بندًا
              </strong>{" "}
              وضع مُعِدّو الملفات عليها علامة «يحتاج مراجعة»، و
              <strong>
                <span className="num">{fmtNum(meta.missingDetail)}</span> بندًا
              </strong>{" "}
              لم يذكر المصدر لها تكلفة أو عدد مستفيدين. البنود معروضة في الجدول
              ومُعلَّمة كما هي، ولم تُحذف.
            </p>
            <p>
              رقم الصفحة متاح في{" "}
              <span className="num">
                {fmtNum(meta.records - meta.pageMissing)}
              </span>{" "}
              بندًا فقط؛ في الباقي لم يحتفظ النص المستخرج بترقيم الصفحات، ويظل
              اسم المستند مذكورًا للرجوع إليه.
            </p>
            <p>
              ملف «القليوبية شرقية غربية أسيوط» يذكر الغربية في اسمه، لكن محتواه
              يغطّي القليوبية وأسيوط والشرقية فقط — فلا توجد بيانات للغربية في
              الموقع.
            </p>
          </div>

          <p style={{ marginTop: "2rem" }}>
            <Link href="/data" className="cta">
              ابحث في <span className="num">{fmtNum(meta.records)}</span> بندًا
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
