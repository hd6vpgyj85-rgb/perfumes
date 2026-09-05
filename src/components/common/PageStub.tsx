interface PageStubProps {
  title: string;
  description: string;
}

export function PageStub({ title, description }: PageStubProps) {
  return (
    <div className="page-stub">
      <p className="eyebrow">Próximamente</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
