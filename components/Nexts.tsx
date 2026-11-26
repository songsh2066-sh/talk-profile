// 한계와 다음 단계 표 (11/26 2차: 성과 탭에서 중간평가·ERLink 페이지 끝으로 되돌리며 공용 부품으로)
export type NextRow = { lt: string; ld: string; pt: string; pd: string };

export default function Nexts({ rows }: { rows: NextRow[] }) {
  return (
    <div className="nexts" role="table" aria-label="아직 못 한 것과 다음에 할 것">
      <div className="nexts-row is-head" role="row">
        <span role="columnheader">아직 못 한 것</span>
        <span aria-hidden="true" />
        <span role="columnheader">다음에 할 것</span>
      </div>
      {rows.map((n) => (
        <div key={n.lt} className="nexts-row" role="row">
          <div className="nexts-lim" role="cell">
            <b>{n.lt}</b>
            <span>{n.ld}</span>
          </div>
          <span className="nexts-arrow" aria-hidden="true">
            →
          </span>
          <div className="nexts-plan" role="cell">
            <b>{n.pt}</b>
            <span>{n.pd}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
