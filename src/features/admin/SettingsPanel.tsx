'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

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
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  return (
    <Card
      title="Parámetros del sistema"
      description="Pares clave / valor para textos o flags de configuración."
    >
      <form onSubmit={save} className="mb-8 flex flex-wrap items-end gap-3">
        <div className="min-w-[8rem] space-y-1.5">
          <span className={ui.label}>Clave</span>
          <input value={key} onChange={(e) => setKey(e.target.value)} className={ui.field} />
        </div>
        <div className="min-w-[12rem] flex-1 space-y-1.5">
          <span className={ui.label}>Valor</span>
          <input value={value} onChange={(e) => setValue(e.target.value)} className={ui.field} />
        </div>
        <button type="submit" className={ui.btnPrimary}>
          Guardar
        </button>
      </form>
      {err && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}
      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/80 p-4 font-mono text-xs text-slate-700">
        {rows.length === 0 ? (
          <p className="text-slate-500">Sin registros.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.key} className="break-all border-b border-slate-200/80 pb-2 last:border-0">
                <span className="font-semibold text-teal-800">{r.key}</span>
                <span className="text-slate-400"> → </span>
                {r.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
