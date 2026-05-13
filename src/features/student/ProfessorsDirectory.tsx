'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ModalityBadge } from '@/shared/components/Badge';

export type CatalogProfessor = {
  id: number;
  fullName: string;
  profileBio: string | null;
  officeLocation: string | null;
  subjects: { id: number; name: string; code: string | null }[];
  modalities: ('VIRTUAL' | 'IN_PERSON')[];
};

export function ProfessorsDirectory() {
  const [rows, setRows] = useState<CatalogProfessor[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<CatalogProfessor[]>('/catalog/professors')
      .then(setRows)
      .catch(() => {
        setErr('No se pudo cargar el directorio.');
        setRows([]);
      });
  }, []);

  return (
    <Card
      title="Directorio de docentes"
      description="Consulta perfiles y reserva con quien prefieras si ofrece la asignatura y tiene franja compatible."
    >
      {err && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {err}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {rows.map((p) => (
          <li key={p.id}>
            <Link
              href={`/student/profesores/${p.id}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-teal-300 hover:shadow-md hover:ring-teal-500/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-800">
                    {p.fullName}
                  </p>
                  {p.officeLocation && (
                    <p className="mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">Presencial:</span>{' '}
                      {p.officeLocation}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 ring-1 ring-teal-600/20">
                  Ver perfil
                </span>
              </div>
              {p.profileBio && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {p.profileBio}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.modalities.map((m) => (
                  <ModalityBadge key={m} modality={m} />
                ))}
                {!p.modalities.length && (
                  <span className="text-xs text-slate-400">Sin franjas aún</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.subjects.slice(0, 4).map((s) => (
                  <span
                    key={s.id}
                    className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    {s.name}
                  </span>
                ))}
                {p.subjects.length > 4 && (
                  <span className="text-[11px] text-slate-400">
                    +{p.subjects.length - 4} más
                  </span>
                )}
                {!p.subjects.length && (
                  <span className="text-xs text-slate-400">Sin especialidades registradas</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {!rows.length && !err && (
        <p className="py-10 text-center text-sm text-slate-500">
          Aún no hay docentes activos en el catálogo.
        </p>
      )}
    </Card>
  );
}
