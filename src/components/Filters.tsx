import { categories, items } from '../data/checklist';
import { score, type DoneSet, type Filter } from '../lib/progress';

interface Props {
  filter: Filter;
  remainingOnly: boolean;
  done: DoneSet;
  onFilter: (next: Filter) => void;
  onRemainingOnly: (next: boolean) => void;
}

export const Filters = ({ filter, remainingOnly, done, onFilter, onRemainingOnly }: Props) => {
  const all = score(done);
  return (
    <div className="card">
      <fieldset className="filter-group">
        <legend className="card-title">Category</legend>
        <div className="filter-options">
          <label className="pill">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filter === 'all'}
              onChange={() => onFilter('all')}
            />
            All{' '}
            <span className="pill-count">
              {all.done}/{all.total}
            </span>
          </label>
          {categories.map((category) => {
            const scoped = items.filter((item) => item.category === category.id);
            const s = score(done, scoped);
            return (
              <label className="pill" key={category.id}>
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={filter === category.id}
                  onChange={() => onFilter(category.id)}
                />
                {category.name}{' '}
                <span className="pill-count">
                  {s.done}/{s.total}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="switch">
        <input type="checkbox" checked={remainingOnly} onChange={(e) => onRemainingOnly(e.target.checked)} />
        Show only remaining items
      </label>
    </div>
  );
};
