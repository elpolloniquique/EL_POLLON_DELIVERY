import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '@/services/auth-service';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setProfile = useAuthStore((s) => s.setProfile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) {
      setProfile(result.profile);
      navigate('/admin');
    } else {
      setError(result.error || 'Error de acceso');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#3d0a0a] to-[#c1121f] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md card p-6">
        <div className="text-center mb-6">
          <img src="/img/logo pollon.png" alt="" className="w-16 h-16 rounded-full mx-auto mb-3 ring-2 ring-pollon-gold" />
          <h1 className="font-display text-2xl text-pollon-red-dark dark:text-white">Panel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Acceso privado — El Pollón</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <label className="block mb-3">
          <span className="text-sm font-medium">Email</span>
          <input type="email" className="input-field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block mb-4">
          <span className="text-sm font-medium">Contraseña</span>
          <input type="password" className="input-field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
        <a href="/" className="block text-center text-sm text-gray-500 mt-4 hover:text-pollon-red">← Volver a la app</a>
      </form>
    </div>
  );
}
