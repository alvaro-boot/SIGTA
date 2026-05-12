type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Sin cabecera: solo contenedor con padding */
  bare?: boolean;
};

export function Card({
  title,
  description,
  children,
  className = '',
  bare,
}: CardProps) {
  const showHead = !bare && (title || description);
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_32px_-8px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] ${className}`}
    >
      {showHead && (
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 px-5 py-4">
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={bare ? '' : 'p-5'}>{children}</div>
    </section>
  );
}
