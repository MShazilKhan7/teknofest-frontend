// pages/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, TicketIcon, Loader2 } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn, isSignInPending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const remember = watch('remember');

  const onSubmit = (data: LoginFormData) => {
    signIn(
      { email: data.email, password: data.password },
      {
        onError: () => {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left */}
      <div className="hidden lg:flex lg:flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 mx-auto mb-8">
            <TicketIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Support Dashboard</h1>
          <p className="text-lg text-white/80">
            Manage your support tickets efficiently.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className={cn('w-full max-w-md space-y-8', shake && 'animate-shake')}>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setValue('remember', v === true)}
              />
              <Label className="text-sm font-normal">Remember me</Label>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={isSignInPending}
            >
              {isSignInPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
