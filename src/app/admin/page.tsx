'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, requireRoleClient } from '@/shared/components/AppShell';
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

  if (!ok) return <p className="p-8 text-center text-zinc-500">Cargando…</p>;

  return (
    <AppShell role="ADMIN">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Panel administrador</h1>
      <div className="grid gap-8">
        <UsersPanel />
        <SubjectsPanel />
        <SettingsPanel />
      </div>
    </AppShell>
  );
}
