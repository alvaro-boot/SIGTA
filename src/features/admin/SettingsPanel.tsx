'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';

type Setting = { key: string; value: string };

export function SettingsPanel() {
  const [rows, setRows] = useState<Setting[]>([]);
  const [key, setKey] = useState('app_title');
  const [value, setValue] = useState('SIGTA');
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api<Setting[]>('/admin/settings').then(setRows).catch(() => setRows([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api(`/admin/settings/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="font-medium text-zinc-800">Configuración (clave / valor)</h2>
      <form onSubmit={save} className="flex flex-wrap gap-2 text-sm">
        <input
          placeholder="clave"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <input
          placeholder="valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-[12rem] flex-1 rounded-md border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-3 py-2 text-white"
        >
          Guardar
        </button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-zinc-100 font-mono text-xs">
        {rows.map((r) => (
          <li key={r.key} className="py-2">
            <span className="font-semibold">{r.key}</span>: {r.value}
          </li>
        ))}
      </ul>
    </section>
  );
}
