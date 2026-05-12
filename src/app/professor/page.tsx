'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { SpecialtiesPanel } from '@/features/professor/SpecialtiesPanel';
import { AvailabilityPanel } from '@/features/professor/AvailabilityPanel';
import { TutoringsTable } from '@/features/student/TutoringsTable';

export default function ProfessorPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!requireRoleClient('PROFESSOR')) {
      router.replace('/login');
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) return <p className="p-8 text-center text-zinc-500">Cargando…</p>;

  return (
    <AppShell role="PROFESSOR">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Panel profesor</h1>
      <div className="grid gap-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecialtiesPanel />
          <AvailabilityPanel />
        </div>
        <div>
          <h2 className="mb-2 font-medium text-zinc-800">Tutorías asignadas</h2>
          <TutoringsTable refreshKey={0} />
        </div>
      </div>
    </AppShell>
  );
}
