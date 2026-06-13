import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '@/services/settings-service';
import { useAppStore } from '@/store/appStore';

export default function SettingsManager() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const setAppData = useAppStore((s) => s.setAppData);

  useEffect(() => {
    fetchSettings().then(({ settings }) => setForm(settings));
  }, []);

  if (!form) return <p>Cargando configuración…</p>;

  const save = async () => {
    if (!form?.id) {
      alert('Configura Supabase para guardar. Sin conexión solo se usan valores locales.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateSettings(form.id, {
        business_name: form.business_name,
        short_name: form.short_name,
        tagline: form.tagline,
        logo_url: form.logo_url,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        accent_color: form.accent_color,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        schedule: form.schedule,
        schedule_long: form.schedule_long,
        reservas_url: form.reservas_url,
        map_embed: form.map_embed,
        delivery_enabled: form.delivery_enabled,
        reservations_enabled: form.reservations_enabled,
        pickup_enabled: form.pickup_enabled,
      });
      setForm(updated);
      setAppData({ settings: updated });
      alert('Configuración guardada');
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'business_name', label: 'Nombre del negocio' },
    { key: 'short_name', label: 'Nombre corto' },
    { key: 'tagline', label: 'Eslogan' },
    { key: 'logo_url', label: 'URL del logo' },
    { key: 'primary_color', label: 'Color principal' },
    { key: 'secondary_color', label: 'Color secundario' },
    { key: 'accent_color', label: 'Color acento' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'whatsapp', label: 'WhatsApp (sin +)' },
    { key: 'address', label: 'Dirección' },
    { key: 'schedule', label: 'Horario corto' },
    { key: 'schedule_long', label: 'Horario largo' },
    { key: 'reservas_url', label: 'URL reservas' },
    { key: 'map_embed', label: 'URL mapa embed' },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="font-bold text-lg">⚙️ Configuración General</h3>
      <div className="card p-4 grid gap-3">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm font-medium">{f.label}</span>
            <input
              className="admin-input mt-1"
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </label>
        ))}
        <div className="flex flex-wrap gap-4 text-sm pt-2">
          {['delivery_enabled', 'reservations_enabled', 'pickup_enabled'].map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={form[key] !== false} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
              {key.replace('_', ' ')}
            </label>
          ))}
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn-primary w-full sm:w-auto">
          {saving ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Los cambios se aplican en tiempo real en la app. Para políticas de delivery, retiro y WhatsApp, edita la tabla business_policies en Supabase o usa el SQL Editor.
      </p>
    </div>
  );
}
