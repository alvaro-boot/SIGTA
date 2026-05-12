'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { Subject } from '@/features/student/RequestTutoringForm';

type Row = { id: number; subjectId: number; subject: Subject };

export function SpecialtiesPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api<Row[]>('/professor/specialties').then(setRows).catch(() => setRows([]));
  }

  useEffect(() => {
    load();
    api<Subject[]>('/subjects').then(setSubjects).catch(() => setSubjects([]));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api('/professor/specialties', {
        method: 'POST',
        body: JSON.stringify({ subjectId: Number(subjectId) }),
      });
      setSubjectId('');
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  async function remove(subjectId: number) {
    setErr(null);
    try {
      await api(`/professor/specialties/${subjectId}`, { method: 'DELETE' });
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="font-medium text-zinc-800">Asignaturas en las que me especializo</h2>
      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Añadir…</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-3 py-2 text-sm text-white"
        >
          Añadir
        </button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-zinc-100 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2">
            <span>{r.subject?.name}</span>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => remove(r.subjectId)}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
