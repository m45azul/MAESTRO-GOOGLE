
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MaestroLogo } from '../components/icons';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login validation for MVP
      login(email);
    } else {
      setError('Por favor, preencha o email e a senha.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700/50">
        <div className="text-center">
            <div className="flex justify-center mb-4 text-indigo-400">
                <MaestroLogo />
            </div>
            <h1 className="text-2xl font-bold text-white">MAESTRO</h1>
            <p className="mt-2 text-sm text-slate-400">Inteligência Jurídica para o seu escritório</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-b-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
           {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};