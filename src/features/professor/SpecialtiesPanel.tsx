'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { Subject } from '@/features/student/RequestTutoringForm';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

type Row = { id: number; subjectId: number; subject: Subject };

export function SpecialtiesPanel({ onChanged }: { onChanged?: () => void }) {
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
      onChanged?.();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  async function remove(subjectId: number) {
    setErr(null);
    try {
      await api(`/professor/specialties/${subjectId}`, { method: 'DELETE' });
      load();
      onChanged?.();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  return (
    <Card
      title="Especialidades"
      description="Asignaturas en las que puedes impartir tutoría. Los estudiantes solo podrán solicitar materias que tengas aquí."
    >
      <form onSubmit={add} className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1 space-y-1.5">
          <span className={ui.label}>Añadir materia</span>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className={ui.field}
          >
            <option value="">Seleccionar…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={ui.btnPrimary}>
          Añadir
        </button>
      </form>
      {err && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition hover:border-teal-100 hover:bg-teal-50/30"
          >
            <span className="font-medium text-slate-900">{r.subject?.name}</span>
            <button type="button" className={ui.btnDanger} onClick={() => remove(r.subjectId)}>
              Quitar
            </button>
          </li>
        ))}
        {!rows.length && (
          <li className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            Aún no has añadido especialidades.
          </li>
        )}
      </ul>
    </Card>
  );
}
