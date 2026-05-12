'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';

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
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endPreview = useMemo(() => formatLocalEnd(startLocal), [startLocal]);

  useEffect(() => {
    api<Subject[]>('/subjects')
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const sid = Number(subjectId);
      const startAt = new Date(startLocal).toISOString();
      await api('/tutorings/request', {
        method: 'POST',
        body: JSON.stringify({ subjectId: sid, startAt }),
      });
      setMsg('Solicitud registrada (duración: 1 hora).');
      onCreated();
    } catch (err) {
      setMsg(
        err instanceof ApiError ? err.getDetail() : 'Error al solicitar tutoría',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <h2 className="font-medium text-zinc-800">Nueva solicitud</h2>
      <p className="text-xs text-zinc-500">
        Cada tutoría tiene una duración fija de <strong>1 hora</strong>. Indica solo el
        inicio; el fin se calcula automáticamente.
      </p>
      <label className="block text-sm">
        <span className="text-zinc-600">Asignatura</span>
        <select
          required
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="">Seleccione…</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-zinc-600">Inicio (hora local)</span>
        <input
          type="datetime-local"
          required
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </label>
      <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
        <span className="text-zinc-500">Fin (1 h después): </span>
        <span className="font-medium text-zinc-900">{endPreview}</span>
      </div>
      {msg && <p className="text-sm text-zinc-700">{msg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        Enviar
      </button>
    </form>
  );
}
