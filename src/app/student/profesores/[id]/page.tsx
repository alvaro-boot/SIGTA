'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { RequestTutoringForm } from '@/features/student/RequestTutoringForm';
import { ModalityBadge } from '@/shared/components/Badge';
import { Card } from '@/shared/components/Card';
import { api } from '@/shared/lib/api';

type Detail = {
  id: number;
  fullName: string;
  profileBio: string | null;
  officeLocation: string | null;
  virtualMeetingUrl: string | null;
  subjects: { id: number; name: string; code: string | null }[];
  modalities: ('VIRTUAL' | 'IN_PERSON')[];
};

export default function StudentProfessorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? Number(idParam) : NaN;

  const [ok, setOk] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!requireRoleClient('STUDENT')) {
      router.replace('/login');
      return;
    }
    setOk(true);
  }, [router]);

  useEffect(() => {
    if (!ok || !Number.isFinite(id)) return;
    api<Detail>(`/catalog/professors/${id}`)
      .then(setDetail)
      .catch(() => setDetail(null));
  }, [ok, id]);

  if (!ok) return <LoadingScreen />;

  if (!Number.isFinite(id)) {
    return (
      <AppShell role="STUDENT">
        <p className="text-slate-600">Identificador no válido.</p>
      </AppShell>
    );
  }

  return (
    <AppShell role="STUDENT">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          href="/student/profesores"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-900"
        >
          ← Directorio
        </Link>
        <Link
          href="/student"
          className="text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          Panel de reservas
        </Link>
      </div>

      {!detail && (
        <p className="text-slate-600">Cargando perfil…</p>
      )}

      {detail && (
        <>
          <PageHero
            eyebrow="Docente"
            title={detail.fullName}
            description="Revisa su presentación y modalidades. Si reservas aquí, la tutoría quedará asignada a este profesor (si el horario y la modalidad coinciden con sus franjas)."
          />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <Card title="Perfil" description="Información visible para estudiantes.">
              {detail.profileBio ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {detail.profileBio}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Sin presentación aún.</p>
              )}
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Modalidades ofrecidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {detail.modalities.map((m) => (
                    <ModalityBadge key={m} modality={m} />
                  ))}
                  {!detail.modalities.length && (
                    <span className="text-sm text-slate-500">Sin franjas registradas.</span>
                  )}
                </div>
              </div>
              {detail.officeLocation && (
                <p className="mt-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Presencial: </span>
                  {detail.officeLocation}
                </p>
              )}
              {detail.virtualMeetingUrl && (
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Enlace virtual habitual: </span>
                  <a
                    href={detail.virtualMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-teal-700 underline"
                  >
                    {detail.virtualMeetingUrl}
                  </a>
                </p>
              )}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Asignaturas
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {detail.subjects.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800"
                    >
                      {s.name}
                      {s.code ? ` (${s.code})` : ''}
                    </li>
                  ))}
                  {!detail.subjects.length && (
                    <li className="text-sm text-slate-500">Sin especialidades.</li>
                  )}
                </ul>
              </div>
            </Card>

            <RequestTutoringForm
              key={key}
              onCreated={() => setKey((k) => k + 1)}
              subjectOptions={detail.subjects}
              fixedProfessorId={detail.id}
              fixedProfessorName={detail.fullName}
              cardTitle="Reservar con este docente"
              cardDescription="Elige una de sus asignaturas, la modalidad y el inicio de la sesión (1 h). Si algo no encaja, verás un mensaje claro del servidor."
            />
          </div>
        </>
      )}
    </AppShell>
  );
}
