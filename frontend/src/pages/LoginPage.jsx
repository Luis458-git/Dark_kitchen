import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMAGES } from '../constants/images';
import {
  Flame,
  KeyRound,
  UserPlus,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Lock,
  Mail,
  User,
  Clock,
  ShieldCheck
} from 'lucide-react';

const LoginPage = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleDemoCredentials = () => {
    setCorreo('chef@darkkitchen.com');
    setPassword('Password123');
    setTab('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(correo, password);
        navigate('/pedidos');
      } else {
        if (password.length < 8) {
          setError('La contraseña debe contener al menos 8 caracteres criptográficos.');
          setLoading(false);
          return;
        }
        await register(nombre, correo, password);
        await login(correo, password);
        navigate('/pedidos');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.mensaje || 'Fallo en la autenticación del gateway.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambientación Lateral Izquierda (Luxe Edition con imagen solicitada y viñeta hacia #0D0E12) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative flex-col justify-between p-12 overflow-hidden border-r border-noir-800/80">
        {/* Imagen de fondo con viñeta difusa orgánica */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.loginLuxe || IMAGES.heroAtelierNoir}
            alt="DarkKitchen Hub — Atelier Culinaire Noir"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          {/* Viñeta: from-transparent via-[#0D0E12]/80 to-[#0D0E12] */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0D0E12]/80 to-[#0D0E12]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-[#0D0E12]/70" />
        </div>

        {/* Marca Superior */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-noir-900/90 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-gold-glow group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide text-brand-primary">DarkKitchen Hub</h1>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-semibold">L'Atelier Culinaire Noir</p>
            </div>
          </Link>
        </div>

        {/* Manifiesto y Telemetría en el pie */}
        <div className="relative z-10 space-y-6">
          <div className="border-l-2 border-gold-400/70 pl-4 py-1">
            <p className="font-serif italic text-lg text-brand-primary leading-snug">
              "Elaborado en la penumbra de cada alba, con fuego lento, cacao puro y devoción."
            </p>
            <span className="block mt-2 font-mono text-xs text-gold-400 tracking-wider uppercase">
              — Manifiesto de Despacho & Gastronomía B2B
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-noir-700/60 font-mono text-xs">
            <div className="p-3 rounded-lg bg-noir-900/85 border border-noir-700/60 backdrop-blur-sm">
              <div className="flex items-center space-x-1.5 text-brand-muted text-[10px] uppercase mb-1">
                <Clock className="w-3 h-3 text-gold-400" />
                <span>Horario de Pase</span>
              </div>
              <span className="text-gold-400 font-semibold">20:00 — 03:00 hrs</span>
            </div>
            <div className="p-3 rounded-lg bg-noir-900/85 border border-noir-700/60 backdrop-blur-sm">
              <div className="flex items-center space-x-1.5 text-brand-muted text-[10px] uppercase mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Seguridad B2B</span>
              </div>
              <span className="text-emerald-400 font-semibold">Bearer JWT Activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha / Formulario Central Glassmorphism */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        {/* Luces y texturas ambientales en penumbra */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Insignia visible solo en Mobile */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-noir-900 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide text-brand-primary">DarkKitchen Hub</h1>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-semibold">Gateway Operativo B2B</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta Central Glassmorphism Obsidiana */}
        <div className="w-full max-w-md bg-noir-900/90 border border-gold-400/40 rounded-2xl shadow-obsidian p-8 backdrop-blur-xl relative z-10">
          {/* Pestañas Conmutables */}
          <div className="flex border-b border-noir-700/80 mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-3 text-center border-b-2 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 ${
                tab === 'login'
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-brand-secondary hover:text-brand-primary'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-3 text-center border-b-2 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 ${
                tab === 'register'
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-brand-secondary hover:text-brand-primary'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Operador</span>
            </button>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1.5">
                  Nombre de Brigada / Operador
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Chef Auguste Escoffier"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-noir-950 border border-noir-700/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-brand-primary placeholder:text-noir-500 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1.5">
                Identidad de Acceso (Correo)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="operador@darkkitchen.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-brand-primary placeholder:text-noir-500 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1.5">
                Clave de Firma Criptográfica
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-brand-primary placeholder:text-noir-500 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 font-semibold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-gold-glow flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Validando Firma JWT...' : tab === 'login' ? 'Conceder Acceso al Pase' : 'Registrar Credencial'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Botón Demo con 1 Clic */}
          <div className="mt-6 pt-5 border-t border-noir-700/60">
            <button
              type="button"
              onClick={handleDemoCredentials}
              className="w-full py-2 px-3 rounded bg-noir-800 hover:bg-noir-700 border border-noir-700 text-xs font-mono text-gold-400/90 hover:text-gold-300 transition-colors flex items-center justify-center space-x-2"
            >
              <Terminal className="w-3.5 h-3.5 text-gold-400" />
              <span>Cargar Credencial Demo (Shift Lead / Admin)</span>
            </button>
          </div>

          {/* Telemetría del Gateway */}
          <div className="mt-5 text-center text-[11px] font-mono text-brand-muted">
            <span>Protocolo: <strong>REST / Bearer JWT</strong></span>
            <span className="mx-2">·</span>
            <span>Expiración: <strong>8 Horas</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
