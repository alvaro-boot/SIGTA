'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { SpecialtiesPanel } from '@/features/professor/SpecialtiesPanel';
import { ProfessorProfilePanel } from '@/features/professor/ProfessorProfilePanel';
import { AvailabilityPanel } from '@/features/professor/AvailabilityPanel';
import { UnassignedQueuePanel } from '@/features/professor/UnassignedQueuePanel';
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
        title="Disponibilidad y perfil"
        description="Completa tu perfil público, indica materias y franjas presenciales o virtuales. Las solicitudes de estudiantes se asignan cuando coinciden materia, modalidad y horario."
      />
      <div className="grid gap-8">
        <ProfessorProfilePanel onSaved={() => setTableKey((k) => k + 1)} />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <SpecialtiesPanel onChanged={() => setTableKey((k) => k + 1)} />
          <AvailabilityPanel onChanged={() => setTableKey((k) => k + 1)} />
        </div>
        <UnassignedQueuePanel onClaimed={() => setTableKey((k) => k + 1)} />
        <TutoringsTable
          refreshKey={tableKey}
          mode="professor"
          onMutate={() => setTableKey((k) => k + 1)}
          title="Mis tutorías asignadas"
          description="Confirma las pendientes, devuelve a cola si no puedes, y marca como realizadas las ya impartidas."
        />
      </div>
    </AppShell>
  );
}
