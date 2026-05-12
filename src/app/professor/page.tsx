'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { SpecialtiesPanel } from '@/features/professor/SpecialtiesPanel';
import { AvailabilityPanel } from '@/features/professor/AvailabilityPanel';
import { TutoringsTable } from '@/features/student/TutoringsTable';

export default function ProfessorPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    if (!requireRoleClient('PROFESSOR')) {
      router.replace('/login');
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) return <LoadingScreen />;

  return (
    <AppShell role="PROFESSOR">
      <PageHero
        eyebrow="Portal docente"
        title="Gestión de disponibilidad"
        description="Indica en qué materias puedes tutorar y las franjas horarias en las que aceptas sesiones. Las solicitudes de estudiantes se asignan automáticamente cuando coinciden."
      />
      <div className="grid gap-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <SpecialtiesPanel onChanged={() => setTableKey((k) => k + 1)} />
          <AvailabilityPanel onChanged={() => setTableKey((k) => k + 1)} />
        </div>
        <TutoringsTable
          refreshKey={tableKey}
          title="Tutorías asignadas"
          description="Sesiones de una hora que el sistema te ha asignado."
        />
      </div>
    </AppShell>
  );
}
