'use client';

import { useEffect, useState } from 'react';
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
        title="Panel de tutorías"
        description="Solicita sesiones de una hora con profesores disponibles y revisa el estado de tus tutorías asignadas."
      />
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <RequestTutoringForm onCreated={() => setKey((k) => k + 1)} />
        <TutoringsTable
          refreshKey={key}
          title="Mis tutorías"
          description="Inicio, fin, estado y docente asignado cuando corresponda."
        />
      </div>
    </AppShell>
  );
}
