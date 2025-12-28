import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa6';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin'); // Redirect to Admin on success
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-200">
      <div className="bg-[#0F172A] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              placeholder="Administrator Email"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}