'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
import { PageHero } from '@/shared/components/PageHero';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { UsersPanel } from '@/features/admin/UsersPanel';
import { SubjectsPanel } from '@/features/admin/SubjectsPanel';
import { SettingsPanel } from '@/features/admin/SettingsPanel';

export default function AdminPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!requireRoleClient('ADMIN')) {
      router.replace('/login');
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) return <LoadingScreen />;

  return (
    <AppShell role="ADMIN">
      <PageHero
        eyebrow="Administración"
        title="Panel de configuración"
        description="Usuarios del sistema, catálogo de asignaturas y parámetros generales de SIGTA."
      />
      <div className="grid gap-8">
        <UsersPanel />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <SubjectsPanel />
          <SettingsPanel />
        </div>
      </div>
    </AppShell>
  );
}
