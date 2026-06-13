import { useAppStore } from '@/store/appStore';

export default function AppLoader() {
  const loading = useAppStore((s) => s.loading);
  const settings = useAppStore((s) => s.settings);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#3d0a0a] to-[#c1121f]">
      <img
        src={settings.logo_url || '/img/logo pollon.png'}
        alt="Cargando"
        className="w-24 h-24 rounded-full object-cover ring-4 ring-pollon-gold animate-pulse mb-6"
      />
      <h1 className="font-display text-3xl text-white tracking-widest">{settings.business_name || 'EL POLLÓN'}</h1>
      <div className="mt-6 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pollon-orange to-pollon-gold animate-[slideUp_1s_ease-in-out_infinite_alternate]" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
