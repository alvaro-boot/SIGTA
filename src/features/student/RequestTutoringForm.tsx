'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';
import { ModalityBadge } from '@/shared/components/Badge';

export type Subject = { id: number; name: string; code: string | null };

export type SessionModality = 'VIRTUAL' | 'IN_PERSON';

const ONE_H_MS = 60 * 60 * 1000;

function formatLocalEnd(startValue: string): string {
  if (!startValue) return '—';
  const d = new Date(startValue);
  if (isNaN(+d)) return '—';
  return new Date(d.getTime() + ONE_H_MS).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

type Props = {
  onCreated: () => void;
  /** Si se pasa, no se llama a /subjects y solo se ofrecen estas asignaturas (reserva con docente concreto). */
  subjectOptions?: Subject[];
  fixedProfessorId?: number;
  fixedProfessorName?: string;
  cardTitle?: string;
  cardDescription?: string;
};

export function RequestTutoringForm({
  onCreated,
  subjectOptions,
  fixedProfessorId,
  fixedProfessorName,
  cardTitle = 'Nueva solicitud',
  cardDescription,
}: Props) {
  const defaultDesc =
    fixedProfessorId != null
      ? `Reserva con ${fixedProfessorName ?? 'el docente elegido'}. Elige asignatura (entre las que imparte), modalidad y hora de inicio.`
      : 'Elige asignatura, modalidad (virtual o presencial) y hora de inicio. Si no indicas un docente, el sistema asignará uno disponible para esa materia y modalidad.';

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [startLocal, setStartLocal] = useState('');
  const [modality, setModality] = useState<SessionModality>('IN_PERSON');
  const [topic, setTopic] = useState('');
  const [preferredProfessorId, setPreferredProfessorId] = useState('');
  const [catalog, setCatalog] = useState<
    { id: number; fullName: string; subjects: { id: number }[] }[]
  >([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endPreview = useMemo(() => formatLocalEnd(startLocal), [startLocal]);

  useEffect(() => {
    if (fixedProfessorId != null) {
      setCatalog([]);
      return;
    }
    api<{ id: number; fullName: string; subjects: { id: number }[] }[]>(
      '/catalog/professors',
    )
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, [fixedProfessorId]);

  useEffect(() => {
    if (subjectOptions !== undefined) {
      setSubjects(subjectOptions);
      return;
    }
    api<Subject[]>('/subjects')
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, [subjectOptions]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const sid = Number(subjectId);
      const startAt = new Date(startLocal).toISOString();
      const body: Record<string, unknown> = {
        subjectId: sid,
        startAt,
        modality,
      };
      if (fixedProfessorId != null) {
        body.professorId = fixedProfessorId;
      } else {
        const pref = Number(preferredProfessorId);
        if (Number.isFinite(pref) && pref > 0) {
          body.preferredProfessorId = pref;
        }
      }
      const t = topic.trim();
      if (t) body.topic = t;
      await api('/tutorings/request', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setSuccess(
        'Solicitud registrada (1 h). Si hay docente asignado, quedará pendiente hasta que confirme.',
      );
      setError(null);
      onCreated();
    } catch (err) {
      setSuccess(null);
      setError(
        err instanceof ApiError ? err.getDetail() : 'Error al solicitar tutoría',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title={cardTitle} description={cardDescription ?? defaultDesc}>
      <form onSubmit={submit} className="space-y-6">
        {fixedProfessorId != null && fixedProfessorName && (
          <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50 to-emerald-50/60 px-4 py-3 text-sm text-teal-950">
            <p className="font-semibold">Reserva dirigida</p>
            <p className="mt-0.5 text-teal-900/90">{fixedProfessorName}</p>
          </div>
        )}

        <div className="space-y-2">
          <span className={ui.label}>Modalidad de la sesión</span>
          <p className="text-xs text-slate-500">
            Tú eliges si la tutoría es en línea o presencial; debe coincidir con la disponibilidad del docente.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setModality('IN_PERSON')}
              className={`rounded-2xl border-2 px-4 py-4 text-left transition ${
                modality === 'IN_PERSON'
                  ? 'border-violet-500 bg-violet-50 shadow-md ring-2 ring-violet-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="block text-sm font-bold text-slate-900">Presencial</span>
              <span className="mt-1 block text-xs text-slate-600">Campus u oficina</span>
            </button>
            <button
              type="button"
              onClick={() => setModality('VIRTUAL')}
              className={`rounded-2xl border-2 px-4 py-4 text-left transition ${
                modality === 'VIRTUAL'
                  ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="block text-sm font-bold text-slate-900">Virtual</span>
              <span className="mt-1 block text-xs text-slate-600">Videollamada</span>
            </button>
          </div>
          <div className="flex justify-end">
            <ModalityBadge modality={modality} />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className={ui.label}>Asignatura</span>
          <select
            required
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setPreferredProfessorId('');
            }}
            className={ui.field}
          >
            <option value="">Seleccione una asignatura…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.code ? ` (${s.code})` : ''}
              </option>
            ))}
          </select>
        </div>

        {fixedProfessorId == null && (
          <>
            <div className="space-y-1.5">
              <span className={ui.label}>Docente preferido (opcional)</span>
              <p className="text-xs text-slate-500">
                Solo aplica en asignación automática: si ese docente tiene franja libre para la materia, se le priorizará.
              </p>
              <select
                value={preferredProfessorId}
                onChange={(e) => setPreferredProfessorId(e.target.value)}
                className={ui.field}
                disabled={!subjectId}
              >
                <option value="">Sin preferencia (asignación automática)</option>
                {catalog
                  .filter((p) =>
                    p.subjects?.some((s) => s.id === Number(subjectId)),
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <span className={ui.label}>Tema o motivo (opcional)</span>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                maxLength={500}
                className={ui.field}
                placeholder="Ej.: dudas del parcial, proyecto final…"
              />
            </div>
          </>
        )}

        {fixedProfessorId != null && (
          <div className="space-y-1.5">
            <span className={ui.label}>Tema o motivo (opcional)</span>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              maxLength={500}
              className={ui.field}
              placeholder="Ayuda al docente a preparar la sesión."
            />
          </div>
        )}

        <div className="space-y-1.5">
          <span className={ui.label}>Inicio (hora local)</span>
          <input
            type="datetime-local"
            required
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            className={ui.field}
          />
        </div>

        <div className="rounded-2xl border border-dashed border-teal-200/80 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            Fin calculado (1 h después)
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
            {endPreview}
          </p>
        </div>

        {success && (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            {success}
          </p>
        )}
        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full`}>
          {loading ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </Card>
  );
}
