'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { StatusBadge } from '@/shared/components/Badge';

export type TutoringRow = {
  id: number;
  startAt: string;
  endAt: string;
  status: string;
  subject?: { name: string };
  professor?: { fullName: string } | null;
};

type Props = {
  refreshKey: number;
  title?: string;
  description?: string;
};

export function TutoringsTable({
  refreshKey,
  title = 'Tutorías',
  description = 'Listado de sesiones registradas en el sistema.',
}: Props) {
  const [rows, setRows] = useState<TutoringRow[]>([]);

  useEffect(() => {
    api<TutoringRow[]>('/tutorings').then(setRows);
  }, [refreshKey]);

  return (
    <Card title={title} description={description}>
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/40">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white/90 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Asignatura</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Profesor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="transition-colors hover:bg-teal-50/40"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {r.subject?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {new Date(r.startAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {new Date(r.endAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {r.professor?.fullName ?? (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-14 text-center text-sm text-slate-500"
                >
                  <span className="mb-2 block text-sm font-medium text-slate-400">
                    Sin tutorías aún
                  </span>
                  Las solicitudes que envíes aparecerán aquí.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
