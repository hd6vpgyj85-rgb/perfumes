import type { PerfumeCategory } from "../types/product";

export interface CategoryInfo {
  id: PerfumeCategory;
  variant: "dark" | "light" | "editorial";
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "arabe",
    variant: "dark",
    eyebrow: "Dark Luxury",
    title: "Perfumes Árabes",
    description:
      "Oud, ámbar y resinas envolventes. Fragancias intensas nacidas de la tradición perfumista de Oriente.",
    cta: "Explorar colección",
    href: "#",
  },
  {
    id: "disenador",
    variant: "light",
    eyebrow: "Modern Luxury",
    title: "Perfumes de Diseñador",
    description:
      "Firmas icónicas de las grandes casas. Elegancia contemporánea con acabados atemporales.",
    cta: "Explorar colección",
    href: "#",
  },
  {
    id: "nicho",
    variant: "editorial",
    eyebrow: "Avant-Garde Luxury",
    title: "Perfumes de Nicho",
    description:
      "Composiciones de autor en ediciones reducidas. Perfumería como expresión artística.",
    cta: "Explorar colección",
    href: "#",
  },
];
