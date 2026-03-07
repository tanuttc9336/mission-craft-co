import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import logo from '@/assets/undercat-logo.png';

export default function Login() {
  const { login } = usePortalAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/portal');
    } else {
      setError('Account not found. Try client@demo.com or admin@demo.com');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary text-primary-foreground p-16">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Undercat" className="h-8 w-auto" />
          <span className="font-display text-sm font-bold tracking-wider uppercase">Undercat</span>
        </div>
        <div>
          <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
            Client Portal
          </h1>
          <p className="text-lg opacity-70 max-w-md leading-relaxed font-body">
            A clear view of your project, timelines, approvals, and next steps.
          </p>
        </div>
        <p className="text-xs opacity-40 tracking-wide">© {new Date().getFullYear()} Undercat Creatives</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <img src={logo} alt="Undercat" className="h-7 w-auto invert dark:invert-0" />
            <span className="font-display text-xs font-bold tracking-wider uppercase">Portal</span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight mb-2">Enter the portal</h2>
          <p className="text-sm text-muted-foreground mb-8">Sign in to access your project.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full" variant="default" size="lg">
              {loading ? 'Signing in…' : 'Sign in'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-[10px] text-muted-foreground tracking-wide">
              Demo accounts
            </p>
            <div className="mt-2 space-y-1.5">
              <button
                onClick={() => { setEmail('client@demo.com'); setPassword('demo'); }}
                className="block text-xs text-foreground hover:underline"
              >
                client@demo.com — Client view
              </button>
              <button
                onClick={() => { setEmail('admin@demo.com'); setPassword('demo'); }}
                className="block text-xs text-foreground hover:underline"
              >
                admin@demo.com — Admin view
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
