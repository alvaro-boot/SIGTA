'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ModalityBadge, StatusBadge } from '@/shared/components/Badge';
import { ui } from '@/shared/lib/ui-classes';

export type TutoringRow = {
  id: number;
  startAt: string;
  endAt: string;
  status: string;
  modality?: string;
  studentTopic?: string | null;
  subject?: { name: string };
  student?: { fullName: string };
  professor?: {
    fullName: string;
    virtualMeetingUrl?: string | null;
  } | null;
};

type Props = {
  refreshKey: number;
  title?: string;
  description?: string;
  showMeetingLink?: boolean;
  /** Estudiante: cancelar / reprogramar. Profesor: confirmar / devolver / completar. */
  mode?: 'student' | 'professor';
  onMutate?: () => void;
};

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (isNaN(+d)) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function canStudentAct(r: TutoringRow): boolean {
  return ['UNASSIGNED', 'PENDING_CONFIRMATION', 'CONFIRMED'].includes(r.status);
}

export function TutoringsTable({
  refreshKey,
  title = 'Tutorías',
  description = 'Listado de sesiones registradas en el sistema.',
  showMeetingLink = false,
  mode = 'student',
  onMutate,
}: Props) {
  const [rows, setRows] = useState<TutoringRow[]>([]);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [rescheduleLocal, setRescheduleLocal] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api<TutoringRow[]>('/tutorings').then(setRows);
  }, [refreshKey]);

  function bump() {
    onMutate?.();
    api<TutoringRow[]>('/tutorings').then(setRows);
  }

  async function cancelRow(id: number) {
    const reason = window.prompt('Motivo de cancelación (opcional):') ?? '';
    setBusyId(id);
    setMsg(null);
    try {
      await api(`/tutorings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      bump();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.getDetail() : 'Error al cancelar');
    } finally {
      setBusyId(null);
    }
  }

  async function submitReschedule(id: number) {
    if (!rescheduleLocal) return;
    setBusyId(id);
    setMsg(null);
    try {
      await api(`/tutorings/${id}/reschedule`, {
        method: 'POST',
        body: JSON.stringify({ startAt: new Date(rescheduleLocal).toISOString() }),
      });
      setRescheduleId(null);
      bump();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.getDetail() : 'Error al reprogramar');
    } finally {
      setBusyId(null);
    }
  }

  async function profAction(
    id: number,
    path: 'confirm' | 'release' | 'complete',
  ) {
    setBusyId(id);
    setMsg(null);
    try {
      await api(`/tutorings/${id}/${path}`, { method: 'POST' });
      bump();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.getDetail() : 'Error');
    } finally {
      setBusyId(null);
    }
  }

  const emptyColSpan =
    mode === 'student' ? 8 + (showMeetingLink ? 1 : 0) : 7;

  return (
    <Card title={title} description={description}>
      {msg && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {msg}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/40">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white/90 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Asignatura</th>
              {mode === 'professor' && (
                <th className="px-4 py-3">Estudiante</th>
              )}
              <th className="px-4 py-3">Modalidad</th>
              {mode === 'student' && <th className="px-4 py-3">Tema</th>}
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Estado</th>
              {mode === 'student' && <th className="px-4 py-3">Profesor</th>}
              {showMeetingLink && mode === 'student' && (
                <th className="px-4 py-3">Sesión virtual</th>
              )}
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => {
              const url = r.professor?.virtualMeetingUrl;
              const showLink =
                showMeetingLink &&
                mode === 'student' &&
                r.modality === 'VIRTUAL' &&
                url &&
                typeof url === 'string';
              const studentAct = mode === 'student' && canStudentAct(r);
              const profPending = mode === 'professor' && r.status === 'PENDING_CONFIRMATION';
              const profComplete = mode === 'professor' && r.status === 'CONFIRMED';
              const busy = busyId === r.id;

              return (
                <tr key={r.id} className="transition-colors hover:bg-teal-50/40">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {r.subject?.name ?? '—'}
                  </td>
                  {mode === 'professor' && (
                    <td className="px-4 py-3 text-slate-700">
                      {r.student?.fullName ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <ModalityBadge modality={r.modality ?? 'IN_PERSON'} />
                  </td>
                  {mode === 'student' && (
                    <td className="max-w-[10rem] truncate px-4 py-3 text-slate-600" title={r.studentTopic ?? ''}>
                      {r.studentTopic?.trim() ? r.studentTopic : '—'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-slate-600 tabular-nums">
                    {new Date(r.startAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums">
                    {new Date(r.endAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  {mode === 'student' && (
                    <td className="px-4 py-3 text-slate-700">
                      {r.professor?.fullName ?? (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  )}
                  {showMeetingLink && mode === 'student' && (
                    <td className="px-4 py-3 text-slate-700">
                      {showLink ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-900"
                        >
                          Unirse
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      {mode === 'student' && studentAct && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            className={ui.btnSecondary}
                            onClick={() => cancelRow(r.id)}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            className={ui.btnSecondary}
                            onClick={() => {
                              setRescheduleId(r.id);
                              setRescheduleLocal(toDatetimeLocalValue(r.startAt));
                            }}
                          >
                            Reprogramar
                          </button>
                        </div>
                      )}
                      {mode === 'professor' && (
                        <div className="flex flex-wrap gap-2">
                          {profPending && (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                className={`${ui.btnPrimary} !py-1.5 !text-xs`}
                                onClick={() => profAction(r.id, 'confirm')}
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                className={ui.btnSecondary}
                                onClick={() => profAction(r.id, 'release')}
                              >
                                Devolver a cola
                              </button>
                            </>
                          )}
                          {profComplete && (
                            <button
                              type="button"
                              disabled={busy}
                              className={`${ui.btnPrimary} !py-1.5 !text-xs`}
                              onClick={() => profAction(r.id, 'complete')}
                            >
                              Marcar realizada
                            </button>
                          )}
                          {!profPending && !profComplete && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      )}
                      {mode === 'student' &&
                        rescheduleId === r.id &&
                        studentAct && (
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <p className="mb-1 text-xs font-semibold text-slate-600">
                              Nueva hora de inicio
                            </p>
                            <input
                              type="datetime-local"
                              value={rescheduleLocal}
                              onChange={(e) => setRescheduleLocal(e.target.value)}
                              className={`${ui.field} mb-2`}
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className={`${ui.btnPrimary} !py-1.5 !text-xs`}
                                disabled={busy}
                                onClick={() => submitReschedule(r.id)}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className={ui.btnSecondary}
                                onClick={() => setRescheduleId(null)}
                              >
                                Cerrar
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td
                  colSpan={emptyColSpan}
                  className="px-4 py-14 text-center text-sm text-slate-500"
                >
                  <span className="mb-2 block text-sm font-medium text-slate-400">
                    Sin tutorías aún
                  </span>
                  Las solicitudes aparecerán aquí.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
