'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ModalityBadge, StatusBadge } from '@/shared/components/Badge';
import { ui } from '@/shared/lib/ui-classes';

type Row = {
  id: number;
  startAt: string;
  endAt: string;
  modality: string;
  status: string;
  studentTopic?: string | null;
  subject?: { name: string };
  student?: { fullName: string };
};

export function UnassignedQueuePanel({ onClaimed }: { onClaimed?: () => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  function load() {
    api<Row[]>('/tutorings/queue/unassigned')
      .then(setRows)
      .catch(() => {
        setRows([]);
        setErr('No se pudo cargar la cola.');
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function claim(id: number) {
    setErr(null);
    setBusy(id);
    try {
      await api(`/tutorings/${id}/claim`, { method: 'POST' });
      load();
      onClaimed?.();
    } catch (e) {
      setErr(e instanceof ApiError ? e.getDetail() : 'No se pudo tomar la solicitud');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card
      title="Cola: sin docente asignado"
      description="Solicitudes de tus asignaturas aún sin profesor. Si puedes en esa fecha y modalidad, tómala y confirma después."
    >
      {err && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Asignatura</th>
              <th className="px-3 py-2">Estudiante</th>
              <th className="px-3 py-2">Modalidad</th>
              <th className="px-3 py-2">Inicio</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 font-medium">{r.subject?.name ?? '—'}</td>
                <td className="px-3 py-2">{r.student?.fullName ?? '—'}</td>
                <td className="px-3 py-2">
                  <ModalityBadge modality={r.modality} />
                </td>
                <td className="px-3 py-2 tabular-nums text-slate-600">
                  {new Date(r.startAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    disabled={busy === r.id}
                    className={`${ui.btnPrimary} !py-1.5 !text-xs`}
                    onClick={() => claim(r.id)}
                  >
                    {busy === r.id ? '…' : 'Tomar'}
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-500">
                  No hay solicitudes en cola para tus especialidades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
