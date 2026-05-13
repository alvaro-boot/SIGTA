'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/shared/lib/api';
import { Card } from '@/shared/components/Card';
import { ui } from '@/shared/lib/ui-classes';

type Profile = {
  id: number;
  fullName: string;
  profileBio: string | null;
  officeLocation: string | null;
  virtualMeetingUrl: string | null;
};

export function ProfessorProfilePanel({ onSaved }: { onSaved?: () => void }) {
  const [row, setRow] = useState<Profile | null>(null);
  const [bio, setBio] = useState('');
  const [office, setOffice] = useState('');
  const [meet, setMeet] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function load() {
    api<Profile>('/professor/profile')
      .then((p) => {
        setRow(p);
        setBio(p.profileBio ?? '');
        setOffice(p.officeLocation ?? '');
        setMeet(p.virtualMeetingUrl ?? '');
      })
      .catch(() => setRow(null));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      await api('/professor/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          profileBio: bio || null,
          officeLocation: office || null,
          virtualMeetingUrl: meet || null,
        }),
      });
      setOk('Perfil actualizado.');
      load();
      onSaved?.();
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.getDetail() : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  if (!row) {
    return (
      <Card title="Tu perfil público" description="Cargando…">
        <p className="text-sm text-slate-500">Obteniendo datos…</p>
      </Card>
    );
  }

  return (
    <Card
      title="Tu perfil público"
      description="Los estudiantes ven esta información en el directorio. El enlace virtual se muestra en tutorías en línea."
    >
      <form onSubmit={save} className="space-y-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{row.fullName}</span>
        </div>
        <div className="space-y-1.5">
          <span className={ui.label}>Presentación</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={ui.field}
            placeholder="Especialidad, estilo de tutoría, idiomas…"
          />
        </div>
        <div className="space-y-1.5">
          <span className={ui.label}>Ubicación presencial</span>
          <input
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            className={ui.field}
            placeholder="Edificio, oficina, campus…"
          />
        </div>
        <div className="space-y-1.5">
          <span className={ui.label}>Enlace por defecto (virtual)</span>
          <input
            value={meet}
            onChange={(e) => setMeet(e.target.value)}
            className={ui.field}
            placeholder="https://…"
            type="url"
          />
        </div>
        {err && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {err}
          </p>
        )}
        {ok && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {ok}
          </p>
        )}
        <button type="submit" disabled={loading} className={ui.btnPrimary}>
          {loading ? 'Guardando…' : 'Guardar perfil'}
        </button>
      </form>
    </Card>
  );
}
