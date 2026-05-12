'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { Subject } from '@/features/student/RequestTutoringForm';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

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
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api(`/subjects/${id}`, { method: 'DELETE' });
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  return (
    <Card
      title="Catálogo de asignaturas"
      description="Materias disponibles para especialidades y solicitudes de tutoría."
    >
      <form onSubmit={create} className="mb-8 flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] flex-1 space-y-1.5">
          <span className={ui.label}>Nombre</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={ui.field}
          />
        </div>
        <div className="min-w-[8rem] space-y-1.5">
          <span className={ui.label}>Código (opc.)</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={ui.field}
          />
        </div>
        <button type="submit" className={ui.btnPrimary}>
          Crear
        </button>
      </form>
      {err && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}
      <ul className="space-y-2">
        {rows.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
          >
            <span className="font-medium text-slate-900">
              {s.name}
              {s.code ? (
                <span className="ml-2 text-sm font-normal text-slate-500">({s.code})</span>
              ) : null}
            </span>
            <button type="button" className={ui.btnDanger} onClick={() => remove(s.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
