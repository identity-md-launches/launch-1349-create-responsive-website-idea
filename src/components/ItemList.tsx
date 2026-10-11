import { categoryById, type ChecklistItem } from '../data/checklist';
import type { DoneSet, Filter } from '../lib/progress';

interface Props {
  visible: ChecklistItem[];
  scopedCount: number;
  done: DoneSet;
  filter: Filter;
  remainingOnly: boolean;
  onToggle: (id: string) => void;
  onClearFilters: () => void;
}

const headingFor = (filter: Filter): string =>
  filter === 'all' ? 'All items' : `${categoryById(filter).name} items`;

export const ItemList = ({ visible, scopedCount, done, filter, remainingOnly, onToggle, onClearFilters }: Props) => {
  const emptyBecauseDone = visible.length === 0 && remainingOnly && scopedCount > 0;
  return (
    <section className="checklist-items" aria-labelledby="items-heading">
      <div className="items-header">
        <h2 id="items-heading">{headingFor(filter)}</h2>
        <p className="items-count" role="status" aria-live="polite">
          Showing {visible.length} of {scopedCount}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>{emptyBecauseDone ? 'Everything here is done' : 'No items match'}</p>
          <p>
            {emptyBecauseDone
              ? 'Every item in this view is ticked. Pick another category or show finished items again.'
              : 'Change the category or switch off the remaining-only filter.'}
          </p>
          <button type="button" className="button" onClick={onClearFilters}>
            Show all items
          </button>
        </div>
      ) : (
        <ul className="item-list">
          {visible.map((item) => {
            const checked = done.has(item.id);
            const inputId = `item-${item.id}`;
            return (
              <li key={item.id} className={checked ? 'item item-done' : 'item'}>
                {/* Empty label widens the hit area to 44px without changing the accessible name. */}
                <label className="item-check" htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(item.id)}
                    aria-describedby={`${inputId}-why`}
                  />
                </label>
                <label className="item-title" htmlFor={inputId}>
                  {item.title}
                </label>
                <span className="item-category">{categoryById(item.category).name}</span>
                <div className="item-body">
                  <p id={`${inputId}-why`}>{item.why}</p>
                  <p className="item-how">
                    <strong>How:</strong> {item.how}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
