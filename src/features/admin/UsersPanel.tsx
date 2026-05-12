'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import type { UserRole } from '@/shared/lib/auth';
import { Card } from '@/shared/components/Card';
import { RoleBadge } from '@/shared/components/Badge';
import { ui } from '@/shared/lib/ui-classes';

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
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error');
    }
  }

  return (
    <Card
      title="Usuarios del sistema"
      description="Crea cuentas de estudiante, profesor u administrador. El registro público solo crea estudiantes."
    >
      <form onSubmit={create} className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-1.5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@utp.edu.co"
            className={ui.field}
          />
        </div>
        <div className="space-y-1.5">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={ui.field}
          />
        </div>
        <div className="space-y-1.5">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className={ui.field}
          >
            <option value="STUDENT">Estudiante</option>
            <option value="PROFESSOR">Profesor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={ui.field}
          />
        </div>
        <button type="submit" className={`${ui.btnPrimary} sm:col-span-2`}>
          Crear usuario
        </button>
      </form>
      {err && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </p>
      )}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        Listado ({rows.length})
      </h3>
      <div className="space-y-2">
        {rows.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-900">{u.fullName}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={u.role} />
              {!u.isActive && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                  Inactivo
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
