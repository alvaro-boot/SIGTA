type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </header>
  );
}
