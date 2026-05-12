'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/lib/api';

export type TutoringRow = {
  id: number;
  startAt: string;
  endAt: string;
  status: string;
  subject?: { name: string };
  professor?: { fullName: string } | null;
};

export function TutoringsTable({ refreshKey }: { refreshKey: number }) {
  const [rows, setRows] = useState<TutoringRow[]>([]);

  useEffect(() => {
    api<TutoringRow[]>('/tutorings').then(setRows);
  }, [refreshKey]);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-3 py-2">Asignatura</th>
            <th className="px-3 py-2">Inicio</th>
            <th className="px-3 py-2">Fin</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Profesor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-zinc-100">
              <td className="px-3 py-2">{r.subject?.name ?? '—'}</td>
              <td className="px-3 py-2">{new Date(r.startAt).toLocaleString()}</td>
              <td className="px-3 py-2">{new Date(r.endAt).toLocaleString()}</td>
              <td className="px-3 py-2">{r.status}</td>
              <td className="px-3 py-2">{r.professor?.fullName ?? '—'}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-zinc-500">
                No hay tutorías aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
