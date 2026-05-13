'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';
import { ModalityBadge } from '@/shared/components/Badge';

type SessionModality = 'VIRTUAL' | 'IN_PERSON';

type Av = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  modality: SessionModality;
};

const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function AvailabilityPanel({ onChanged }: { onChanged?: () => void }) {
  const [rows, setRows] = useState<Av[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [modality, setModality] = useState<SessionModality>('IN_PERSON');
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
        body: JSON.stringify({ dayOfWeek, startTime, endTime, modality }),
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
      description="Define franjas por día, hora y modalidad (presencial o virtual). La franja debe cubrir toda la hora de la tutoría. Zona horaria del servidor (APP_TIMEZONE)."
    >
      <form
        onSubmit={add}
        className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="space-y-1.5">
          <span className={ui.label}>Día</span>
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
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <div className="space-y-1.5">
            <span className={ui.label}>Desde</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`${ui.field} w-full sm:w-auto`}
            />
          </div>
          <div className="space-y-1.5">
            <span className={ui.label}>Hasta</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`${ui.field} w-full sm:w-auto`}
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:min-w-[10rem]">
          <span className={ui.label}>Modalidad de la franja</span>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value as SessionModality)}
            className={ui.field}
          >
            <option value="IN_PERSON">Presencial</option>
            <option value="VIRTUAL">Virtual</option>
          </select>
        </div>
        <button type="submit" className={`${ui.btnPrimary} w-full sm:w-auto`}>
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
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
          >
            <span className="font-medium text-slate-800">
              <span className="text-teal-700">{days[r.dayOfWeek]}</span>{' '}
              <span className="tabular-nums text-slate-600">
                {r.startTime} – {r.endTime}
              </span>
              <span className="ml-2 inline-block align-middle">
                <ModalityBadge modality={r.modality ?? 'IN_PERSON'} />
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
