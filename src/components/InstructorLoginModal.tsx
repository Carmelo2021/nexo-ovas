import React, { useState } from 'react';
import { Lock, LogIn, ShieldCheck, UserCheck, X } from 'lucide-react';
import { InstructorCredentials } from '../types/ova';

interface InstructorLoginModalProps {
  instructor: InstructorCredentials;
  onSuccessLogin: () => void;
  onClose: () => void;
}

export const InstructorLoginModal: React.FC<InstructorLoginModalProps> = ({
  instructor,
  onSuccessLogin,
  onClose,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.trim() === instructor.username &&
      password === instructor.password
    ) {
      setError(null);
      onSuccessLogin();
    } else {
      setError(
        'Credenciales de instructor inválidas. Verifica tu usuario o utiliza el botón de acceso rápido de demostración.'
      );
    }
  };

  const handleQuickFillAndLogin = () => {
    setUsername(instructor.username);
    setPassword(instructor.password);
    setError(null);
    onSuccessLogin();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Área Exclusiva del Instructor SENA</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Iniciar Sesión como Instructor
            </h3>
            <p className="text-xs text-slate-500">
              Los aprendices no requieren cuenta y acceden libremente a la Vista
              Pública. Este acceso desbloquea el Lienzo en Grafo y la gestión de
              OVAs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Usuario Institucional del Instructor
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="instructor.sena"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña Docente
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Ingresar al Panel de Administración
          </button>
        </form>

        {/* Demo Helper Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-800">
              Credenciales Docentes Configuradas:
            </span>
            <span className="font-mono text-[11px]">
              {instructor.username} / {instructor.password}
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillAndLogin}
            className="w-full py-1.5 px-3 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 rounded-lg font-semibold transition-colors"
          >
            Entrar en 1 Clic como {instructor.instructorName}
          </button>
        </div>
      </div>
    </div>
  );
};
