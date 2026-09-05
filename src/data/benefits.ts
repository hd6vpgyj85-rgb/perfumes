export type BenefitIcon = "seal" | "shipping" | "concierge" | "curation";

export interface Benefit {
  icon: BenefitIcon;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: "seal",
    title: "Autenticidad Garantizada",
    description: "100% originales, con sello de autenticidad en cada pieza.",
  },
  {
    icon: "shipping",
    title: "Envío Discreto",
    description: "Empaque elegante y seguro, sin marcas visibles en el exterior.",
  },
  {
    icon: "concierge",
    title: "Atención Personalizada",
    description: "Asesoría experta para encontrar la fragancia que te define.",
  },
  {
    icon: "curation",
    title: "Selección Premium",
    description: "Curaduría exclusiva entre lo árabe, lo clásico y lo artístico.",
  },
];
