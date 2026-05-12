'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';

type Av = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function AvailabilityPanel() {
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
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api(`/professor/availability/${id}`, { method: 'DELETE' });
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="font-medium text-zinc-800">Disponibilidad semanal (UTC)</h2>
      <p className="text-xs text-zinc-500">
        El día y la hora deben coincidir con lo que solicitan los estudiantes en UTC.
      </p>
      <form onSubmit={add} className="flex flex-wrap items-end gap-2 text-sm">
        <label>
          Día
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="ml-1 rounded-md border border-zinc-300 px-2 py-1"
          >
            {days.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label>
          Desde
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="ml-1 rounded-md border border-zinc-300 px-2 py-1"
          />
        </label>
        <label>
          Hasta
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="ml-1 rounded-md border border-zinc-300 px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-3 py-2 text-white"
        >
          Añadir franja
        </button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-zinc-100 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2">
            <span>
              {days[r.dayOfWeek]} {r.startTime}–{r.endTime}
            </span>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => remove(r.id)}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
