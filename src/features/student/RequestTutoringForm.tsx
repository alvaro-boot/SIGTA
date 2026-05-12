'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';

export type Subject = { id: number; name: string; code: string | null };

export function RequestTutoringForm({ onCreated }: { onCreated: () => void }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [startLocal, setStartLocal] = useState('');
  const [endLocal, setEndLocal] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const endAt = new Date(endLocal).toISOString();
      await api('/tutorings/request', {
        method: 'POST',
        body: JSON.stringify({ subjectId: sid, startAt, endAt }),
      });
      setMsg('Solicitud registrada.');
      onCreated();
    } catch (err) {
      setMsg(
        err instanceof ApiError && err.body
          ? err.body
          : 'Error al solicitar tutoría',
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
        <span className="text-zinc-600">Inicio (local)</span>
        <input
          type="datetime-local"
          required
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-600">Fin (local)</span>
        <input
          type="datetime-local"
          required
          value={endLocal}
          onChange={(e) => setEndLocal(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </label>
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
