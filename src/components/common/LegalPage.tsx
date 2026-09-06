import "./LegalPage.css";

interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <div className="legal-page">
      <div className="container legal-page__inner">
        <p className="eyebrow">Legal</p>
        <h1 className="legal-page__title">{title}</h1>
        <p className="legal-page__updated">Última actualización: {updated}</p>

        {sections.map((section) => (
          <section key={section.heading} className="legal-page__section">
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
