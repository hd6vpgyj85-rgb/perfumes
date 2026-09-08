import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStoreProducts } from "../hooks/useStoreProducts";
import { ProductCard } from "../components/product/ProductCard";
import type { PerfumeCategory, Product } from "../types/product";
import "./Finder.css";

type Intensity = "ligera" | "moderada" | "intensa";
type Budget = "bajo" | "medio" | "alto";

interface Answers {
  category: PerfumeCategory | null;
  intensity: Intensity | null;
  budget: Budget | null;
}

const CATEGORY_OPTIONS: { value: PerfumeCategory | null; label: string; hint: string }[] = [
  { value: "arabe", label: "Árabe", hint: "Oud, ámbar y resinas envolventes" },
  { value: "disenador", label: "Diseñador", hint: "Elegancia icónica y contemporánea" },
  { value: "nicho", label: "Nicho", hint: "Composiciones de autor, exclusivas" },
  { value: null, label: "No estoy seguro", hint: "Muéstrame lo mejor de cada mundo" },
];

const INTENSITY_OPTIONS: { value: Intensity | null; label: string; hint: string }[] = [
  { value: "ligera", label: "Ligera y fresca", hint: "Para el día a día" },
  { value: "moderada", label: "Equilibrada", hint: "Presente sin abrumar" },
  { value: "intensa", label: "Intensa y envolvente", hint: "Que se note a distancia" },
  { value: null, label: "Sin preferencia", hint: "Cualquier intensidad" },
];

const BUDGET_OPTIONS: { value: Budget | null; label: string; hint: string }[] = [
  { value: "bajo", label: "Hasta $100", hint: "" },
  { value: "medio", label: "$100 – $200", hint: "" },
  { value: "alto", label: "Sin límite", hint: "" },
];

function getIntensity(product: Product): Intensity {
  const c = product.concentration.toLowerCase();
  if (c.includes("extrait") || (c.includes("parfum") && !c.includes("eau de"))) return "intensa";
  if (c.includes("toilette")) return "ligera";
  return "moderada";
}

function matchesBudget(product: Product, budget: Budget | null): boolean {
  if (!budget) return true;
  if (budget === "bajo") return product.price <= 100;
  if (budget === "medio") return product.price > 100 && product.price <= 200;
  return true;
}

function findMatches(products: Product[], answers: Answers): Product[] {
  const inStock = products.filter((p) => p.inStock);
  const pool = inStock.length > 0 ? inStock : products;

  const levels: Partial<Answers>[] = [
    answers,
    { ...answers, budget: null },
    { ...answers, budget: null, intensity: null },
    { category: null, intensity: null, budget: null },
  ];

  for (const level of levels) {
    const matches = pool.filter(
      (p) =>
        (!level.category || p.category === level.category) &&
        (!level.intensity || getIntensity(p) === level.intensity) &&
        matchesBudget(p, level.budget ?? null),
    );
    if (matches.length > 0) {
      return [...matches].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }
  }

  return [...pool].sort((a, b) => b.rating - a.rating).slice(0, 3);
}

const STEPS = ["category", "intensity", "budget"] as const;

export function Finder() {
  const { products, loading } = useStoreProducts();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ category: null, intensity: null, budget: null });
  const [done, setDone] = useState(false);

  const matches = useMemo(
    () => (done ? findMatches(products, answers) : []),
    [done, products, answers],
  );

  const restart = () => {
    setAnswers({ category: null, intensity: null, budget: null });
    setStep(0);
    setDone(false);
  };

  const selectCategory = (value: PerfumeCategory | null) => {
    setAnswers((a) => ({ ...a, category: value }));
    setStep(1);
  };

  const selectIntensity = (value: Intensity | null) => {
    setAnswers((a) => ({ ...a, intensity: value }));
    setStep(2);
  };

  const selectBudget = (value: Budget | null) => {
    setAnswers((a) => ({ ...a, budget: value }));
    setDone(true);
  };

  return (
    <div className="finder-page">
      <div className="container finder-page__inner">
        <p className="eyebrow">Encuentra tu Firma</p>
        <h1 className="finder-page__title">Perfume Finder</h1>

        {!done && (
          <>
            <p className="finder-page__intro">
              Responde {STEPS.length} preguntas cortas y te recomendamos los perfumes que más se
              parecen a ti.
            </p>

            <div className="finder-progress">
              {STEPS.map((s, i) => (
                <span key={s} className={`finder-progress__dot ${i <= step ? "is-active" : ""}`} />
              ))}
            </div>

            {step === 0 && (
              <div className="finder-step">
                <h2>¿Qué tipo de perfume te representa más?</h2>
                <div className="finder-options">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      className="finder-option"
                      onClick={() => selectCategory(opt.value)}
                    >
                      <span className="finder-option__label">{opt.label}</span>
                      <span className="finder-option__hint">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="finder-step">
                <h2>¿Qué intensidad prefieres?</h2>
                <div className="finder-options">
                  {INTENSITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      className="finder-option"
                      onClick={() => selectIntensity(opt.value)}
                    >
                      <span className="finder-option__label">{opt.label}</span>
                      <span className="finder-option__hint">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="finder-step">
                <h2>¿Cuál es tu presupuesto?</h2>
                <div className="finder-options">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      className="finder-option"
                      onClick={() => selectBudget(opt.value)}
                    >
                      <span className="finder-option__label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {done && (
          <div className="finder-results">
            <p className="finder-page__intro">
              {loading
                ? "Buscando tus recomendaciones…"
                : "Esto es lo que más se parece a ti:"}
            </p>

            {!loading && (
              <div className="finder-results__grid">
                {matches.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="finder-results__actions">
              <button className="btn btn-outline" onClick={restart}>
                Repetir quiz
              </button>
              <Link to="/" className="btn btn-primary">
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
