import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-status-high' };
  if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-status-medium' };
  if (score <= 5) return { score: 3, label: 'Good', color: 'bg-status-open' };
  return { score: 4, label: 'Strong', color: 'bg-status-resolved' };
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);

  return (
    <div className="space-y-1.5 animate-fade-in">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              level <= score ? color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}
