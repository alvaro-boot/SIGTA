'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

type Av = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function AvailabilityPanel({ onChanged }: { onChanged?: () => void }) {
  const [rows, setRows] = useState<Av[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api<Av[]>('/professor/availability').then(setRows).catch(() => setRows([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api('/professor/availability', {
        method: 'POST',
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      load();
      onChanged?.();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api(`/professor/availability/${id}`, { method: 'DELETE' });
      load();
      onChanged?.();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  return (
    <Card
      title="Disponibilidad semanal"
      description="Define franjas por día (referencia UTC). Deben cubrir la hora completa de la tutoría que solicite un estudiante."
    >
      <form
        onSubmit={add}
        className="mb-6 flex flex-wrap items-end gap-4 border-b border-slate-100 pb-6"
      >
        <div className="space-y-1.5">
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className={`${ui.field} min-w-[7rem]`}
          >
            {days.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={`${ui.field} w-auto`}
          />
        </div>
        <div className="space-y-1.5">
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={`${ui.field} w-auto`}
          />
        </div>
        <button type="submit" className={ui.btnPrimary}>
          Añadir franja
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
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
          >
            <span className="font-medium text-slate-800">
              <span className="text-teal-700">{days[r.dayOfWeek]}</span>{' '}
              <span className="tabular-nums text-slate-600">
                {r.startTime} – {r.endTime}
              </span>
            </span>
            <button type="button" className={ui.btnDanger} onClick={() => remove(r.id)}>
              Quitar
            </button>
          </li>
        ))}
        {!rows.length && (
          <li className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No hay franjas registradas.
          </li>
        )}
      </ul>
    </Card>
  );
}
