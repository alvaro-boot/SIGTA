'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
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

  if (!ok) return <p className="p-8 text-center text-zinc-500">Cargando…</p>;

  return (
    <AppShell role="STUDENT">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Panel estudiante</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <RequestTutoringForm onCreated={() => setKey((k) => k + 1)} />
        <div>
          <h2 className="mb-2 font-medium text-zinc-800">Mis tutorías</h2>
          <TutoringsTable refreshKey={key} />
        </div>
      </div>
    </AppShell>
  );
}
