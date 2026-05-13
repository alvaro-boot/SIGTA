export function ModalityBadge({ modality }: { modality: string }) {
  const styles: Record<string, string> = {
    VIRTUAL: 'bg-sky-50 text-sky-900 ring-1 ring-sky-600/25',
    IN_PERSON: 'bg-violet-50 text-violet-900 ring-1 ring-violet-600/25',
  };
  const labels: Record<string, string> = {
    VIRTUAL: 'Virtual',
    IN_PERSON: 'Presencial',
  };
  const cls =
    styles[modality] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-500/15';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {labels[modality] ?? modality}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    UNASSIGNED: 'bg-amber-50 text-amber-900 ring-1 ring-amber-600/25',
    PENDING_CONFIRMATION:
      'bg-sky-50 text-sky-900 ring-1 ring-sky-600/25',
    CONFIRMED: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20',
    CANCELLED: 'bg-slate-100 text-slate-600 ring-1 ring-slate-400/30',
    COMPLETED: 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600/25',
    AUTO_ASSIGNED:
      'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20',
  };
  const labels: Record<string, string> = {
    UNASSIGNED: 'Sin profesor',
    PENDING_CONFIRMATION: 'Pendiente docente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Realizada',
    AUTO_ASSIGNED: 'Asignada (legado)',
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
