import type { Score as ScoreValue } from '../lib/progress';

interface Props {
  total: ScoreValue;
}

export const Score = ({ total }: Props) => (
  <div className="card score">
    <p className="card-title">Progress</p>
    <p className="score-line" role="status" aria-live="polite">
      <span className="score-value">
        {total.done} of {total.total} done
      </span>
      <span className="visually-hidden">, </span>
      <span className="score-percent">{total.percent}%</span>
    </p>
    <div className="score-bar" aria-hidden="true">
      <span style={{ '--progress': `${total.percent}%` } as React.CSSProperties} />
    </div>
  </div>
);
