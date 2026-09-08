export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Árabes", href: "/?categoria=arabe#destacados" },
  { label: "Diseñador", href: "/?categoria=disenador#destacados" },
  { label: "Nicho", href: "/?categoria=nicho#destacados" },
  { label: "Novedades", href: "/#destacados" },
];
