'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { UserRole } from '@/shared/lib/auth';

type UserRow = {
  id: number;
  email: string;
  role: UserRole;
  fullName: string;
  isActive: boolean;
};

export function UsersPanel() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [err, setErr] = useState<string | null>(null);

  function load() {
    api<UserRow[]>('/users').then(setRows).catch(() => setRows([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api('/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role }),
      });
      setEmail('');
      setPassword('');
      setFullName('');
      load();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.body ?? ex.message : 'Error');
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="font-medium text-zinc-800">Usuarios</h2>
      <form onSubmit={create} className="grid gap-2 text-sm sm:grid-cols-2">
        <input
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <input
          placeholder="Contraseña (mín. 8)"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <input
          placeholder="Nombre completo"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="STUDENT">Estudiante</option>
          <option value="PROFESSOR">Profesor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-3 py-2 text-white sm:col-span-2"
        >
          Crear usuario
        </button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-zinc-100 text-sm">
        {rows.map((u) => (
          <li key={u.id} className="flex flex-wrap justify-between gap-2 py-2">
            <span>
              {u.fullName} <span className="text-zinc-500">({u.email})</span>
            </span>
            <span className="text-zinc-600">
              {u.role} {u.isActive ? '' : '(inactivo)'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
