'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getRoleFromToken } from '@/shared/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace('/login');
      return;
    }
    const role = getRoleFromToken(t);
    if (role === 'STUDENT') router.replace('/student');
    else if (role === 'PROFESSOR') router.replace('/professor');
    else if (role === 'ADMIN') router.replace('/admin');
    else router.replace('/login');
  }, [router]);

  return (
    <p className="p-8 text-center text-zinc-500" lang="es">
      Cargando…
    </p>
  );
}
