'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

export type Subject = { id: number; name: string; code: string | null };

const ONE_H_MS = 60 * 60 * 1000;

function formatLocalEnd(startValue: string): string {
  if (!startValue) return '—';
  const d = new Date(startValue);
  if (isNaN(+d)) return '—';
  return new Date(d.getTime() + ONE_H_MS).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function RequestTutoringForm({ onCreated }: { onCreated: () => void }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [startLocal, setStartLocal] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endPreview = useMemo(() => formatLocalEnd(startLocal), [startLocal]);

  useEffect(() => {
    api<Subject[]>('/subjects')
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const sid = Number(subjectId);
      const startAt = new Date(startLocal).toISOString();
      await api('/tutorings/request', {
        method: 'POST',
        body: JSON.stringify({ subjectId: sid, startAt }),
      });
      setSuccess('Solicitud registrada correctamente (1 hora).');
      setError(null);
      onCreated();
    } catch (err) {
      setSuccess(null);
      setError(
        err instanceof ApiError ? err.getDetail() : 'Error al solicitar tutoría',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      title="Nueva solicitud"
      description="Elige materia y hora de inicio. La sesión siempre dura exactamente una hora; el sistema buscará un profesor disponible."
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-1.5">
          <span className={ui.label}>Asignatura</span>
          <select
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className={ui.field}
          >
            <option value="">Seleccione una asignatura…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.code ? ` (${s.code})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <span className={ui.label}>Inicio (hora local)</span>
          <input
            type="datetime-local"
            required
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            className={ui.field}
          />
        </div>

        <div className="rounded-xl border border-dashed border-teal-200/80 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            Fin calculado (1 h después)
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
            {endPreview}
          </p>
        </div>

        {success && (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            {success}
          </p>
        )}
        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full`}>
          {loading ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </Card>
  );
}
