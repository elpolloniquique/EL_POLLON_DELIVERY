import { useAppStore } from '@/store/appStore';

export default function Toast() {
  const toast = useAppStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] max-w-sm w-[90%] animate-slide-up">
      <div className="bg-pollon-black text-white px-4 py-3 rounded-2xl shadow-float text-sm text-center border border-pollon-gold/30">
        {toast}
      </div>
    </div>
  );
}
