import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Score } from './components/Score';
import { Filters } from './components/Filters';
import { ItemList } from './components/ItemList';
import { ReportActions } from './components/ReportActions';
import { About, Principles } from './components/Principles';
import { items } from './data/checklist';
import { score, scopedItems, toggle, visibleItems, type Filter } from './lib/progress';
import { buildReport, reportFileName } from './lib/report';
import { copyText, downloadText } from './lib/download';
import { clear, load, save } from './lib/storage';

export const App = () => {
  const [initial] = useState(() => load());
  const [done, setDone] = useState<Set<string>>(() => new Set(initial.done));
  const [siteName, setSiteName] = useState(initial.siteName);
  const [filter, setFilter] = useState<Filter>('all');
  const [remainingOnly, setRemainingOnly] = useState(false);

  useEffect(() => {
    save({ siteName, done: [...done] });
  }, [siteName, done]);

  const total = useMemo(() => score(done), [done]);
  const scoped = useMemo(() => scopedItems(filter), [filter]);
  const visible = useMemo(() => visibleItems(done, { filter, remainingOnly }), [done, filter, remainingOnly]);

  const onToggle = useCallback((id: string) => setDone((prev) => toggle(prev, id)), []);
  const report = useCallback(() => buildReport({ siteName, done }), [siteName, done]);

  const onDownload = useCallback(() => downloadText(reportFileName(siteName), report()), [siteName, report]);
  const onCopy = useCallback(() => copyText(report()), [report]);
  const onReset = useCallback(() => {
    setDone(new Set());
    clear();
  }, []);
  const onClearFilters = useCallback(() => {
    setFilter('all');
    setRemainingOnly(false);
  }, []);

  return (
    <>
      <a className="skip-link" href="#checklist">
        Skip to checklist
      </a>
      <div id="top" />
      <Header />
      <main>
        <section className="container hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading">Make your site agent-ready</h1>
          <p>
            A {items.length}-point checklist for websites that people and AI agents can both use. Tick what you have,
            then download the report.
          </p>
        </section>

        <div className="container checklist" id="checklist">
          <div className="checklist-top">
            <Score total={total} />
            <Filters
              filter={filter}
              remainingOnly={remainingOnly}
              done={done}
              onFilter={setFilter}
              onRemainingOnly={setRemainingOnly}
            />
          </div>
          <aside className="checklist-bottom" aria-label="Report">
            <ReportActions
              siteName={siteName}
              onSiteName={setSiteName}
              onDownload={onDownload}
              onCopy={onCopy}
              onReset={onReset}
              hasProgress={done.size > 0}
            />
          </aside>
          <ItemList
            visible={visible}
            scopedCount={scoped.length}
            done={done}
            filter={filter}
            remainingOnly={remainingOnly}
            onToggle={onToggle}
            onClearFilters={onClearFilters}
          />
        </div>

        <Principles />
        <About />
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>Agent Ready. A static site with no accounts and no tracking.</span>
          <span>Progress is stored in this browser only.</span>
        </div>
      </footer>
    </>
  );
};
