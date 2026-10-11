import { categories, items } from '../data/checklist';

export const Principles = () => (
  <section className="section" id="principles" aria-labelledby="principles-heading">
    <div className="container">
      <div className="section-header">
        <h2 id="principles-heading">Five things an agent needs</h2>
        <p>
          Each checklist item belongs to one of these. The good news: every one of them also helps a person using a
          screen reader, a slow connection or a small screen.
        </p>
      </div>
      <ul className="principles">
        {categories.map((category) => {
          const count = items.filter((item) => item.category === category.id).length;
          return (
            <li className="principle card" key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.summary}</p>
              <span className="principle-count">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export const About = () => (
  <section className="section" id="about" aria-labelledby="about-heading">
    <div className="container prose">
      <h2 id="about-heading">About this checklist</h2>
      <p>
        <strong>What it is.</strong> Agent Ready is a short, opinionated list of things a website needs so that an AI
        agent acting for a person, such as a shopping assistant or a research tool, can read it and act on it without
        guessing. Most items are plain web fundamentals.
      </p>
      <p>
        <strong>How the score works.</strong> Every item counts once. The score is the share of items you have ticked.
        It is a self-assessment, not an audit: ticking an item records your judgment, nothing is scanned.
      </p>
      <p>
        <strong>Where your progress lives.</strong> Ticks and the site name are saved in this browser only, using local
        storage. Nothing is sent anywhere. Use <strong>Download report</strong> to keep a copy or share it with your team.
      </p>
    </div>
  </section>
);
