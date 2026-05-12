export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AUTO_ASSIGNED:
      'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20',
    UNASSIGNED: 'bg-amber-50 text-amber-900 ring-1 ring-amber-600/25',
  };
  const labels: Record<string, string> = {
    AUTO_ASSIGNED: 'Asignada',
    UNASSIGNED: 'Sin profesor',
  };
  const cls =
    styles[status] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-500/15';
  const text = labels[status] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {text}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    STUDENT: 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-600/20',
    PROFESSOR: 'bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-600/20',
    ADMIN: 'bg-slate-800 text-white ring-1 ring-inset ring-slate-600/40',
  };
  const labels: Record<string, string> = {
    STUDENT: 'Estudiante',
    PROFESSOR: 'Profesor',
    ADMIN: 'Admin',
  };
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${map[role] ?? 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300'}`}
    >
      {labels[role] ?? role}
    </span>
  );
}
