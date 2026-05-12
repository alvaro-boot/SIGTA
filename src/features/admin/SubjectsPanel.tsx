'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { Subject } from '@/features/student/RequestTutoringForm';

export function SubjectsPanel() {
  const [rows, setRows] = useState<Subject[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api<Subject[]>('/subjects').then(setRows).catch(() => setRows([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api('/subjects', {
        method: 'POST',
        body: JSON.stringify({ name, code: code || undefined }),
      });
      setName('');
      setCode('');
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api(`/subjects/${id}`, { method: 'DELETE' });
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="font-medium text-zinc-800">Asignaturas</h2>
      <form onSubmit={create} className="flex flex-wrap gap-2 text-sm">
        <input
          placeholder="Nombre"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <input
          placeholder="Código (opcional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-3 py-2 text-white"
        >
          Crear
        </button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-zinc-100 text-sm">
        {rows.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-2">
            <span>
              {s.name} {s.code ? <span className="text-zinc-500">({s.code})</span> : null}
            </span>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => remove(s.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
