'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { ProfessorsDirectory } from '@/features/student/ProfessorsDirectory';

export default function StudentProfessorsPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-900"
        >
          ← Volver al panel
        </Link>
      </div>
      <PageHero
        eyebrow="Estudiante"
        title="Directorio de docentes"
        description="Explora perfiles, modalidades y asignaturas. Desde cada perfil puedes reservar una hora con ese docente si cuadra con su disponibilidad."
      />
      <ProfessorsDirectory />
    </AppShell>
  );
}
