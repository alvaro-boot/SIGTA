'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { RequestTutoringForm } from '@/features/student/RequestTutoringForm';
import { TutoringsTable } from '@/features/student/TutoringsTable';

export default function StudentPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!requireRoleClient('STUDENT')) {
      router.replace('/login');
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) return <LoadingScreen />;

  return (
    <AppShell role="STUDENT">
      <PageHero
        eyebrow="Portal estudiante"
        title="Tus tutorías UTP"
        description="Reserva en unos pocos pasos: elige modalidad (virtual o presencial), materia y hora. Puedes dejar que el sistema asigne un docente disponible o elegir uno en el directorio."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/student/profesores"
          className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-teal-300 hover:shadow-md"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Directorio
          </span>
          <span className="mt-2 text-lg font-bold text-slate-900 group-hover:text-teal-800">
            Ver profesores y reservar con uno
          </span>
          <span className="mt-2 text-sm text-slate-600">
            Perfiles, modalidades y asignaturas. Ideal si ya conoces a tu docente.
          </span>
        </Link>
        <div className="flex flex-col rounded-2xl border border-dashed border-slate-300/90 bg-slate-50/80 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reserva rápida
          </span>
          <span className="mt-2 text-lg font-bold text-slate-900">
            Asignación automática por materia
          </span>
          <span className="mt-2 text-sm text-slate-600">
            Usa el formulario de la derecha sin elegir docente: el sistema busca quien tenga franja y especialidad compatibles.
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <RequestTutoringForm onCreated={() => setKey((k) => k + 1)} />
        <TutoringsTable
          refreshKey={key}
          mode="student"
          onMutate={() => setKey((k) => k + 1)}
          title="Mis tutorías"
          description="Modalidad, tema, horario y estado. Cancela o reprograma con al menos la antelación configurada por administración (clave tutoring_cancel_min_hours_before, por defecto 24 h)."
          showMeetingLink
        />
      </div>
    </AppShell>
  );
}
