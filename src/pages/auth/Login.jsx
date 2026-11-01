import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import { Eye, EyeOff, Zap, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.formattedMessage || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('james@wattwise.ai');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-card p-8 shadow-2xl relative">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-3">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text">Welcome Back</h1>
          <p className="text-sm text-muted mt-1">Sign in to your WattWise AI energy portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/20 flex items-start gap-2.5 text-danger text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. james@wattwise.ai"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-text placeholder-muted/60 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-text placeholder-muted/60 text-sm focus:outline-none focus:border-primary transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-dark text-bg font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Helper */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-lg bg-surface-2 hover:bg-border text-xs text-primary-soft border border-border transition-colors flex items-center justify-center gap-1.5 font-mono"
          >
            ⚡ Quick-fill James Miller demo credentials
          </button>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Register household
          </Link>
        </p>
      </div>
    </div>
  );
}

