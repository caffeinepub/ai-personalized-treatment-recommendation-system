import { useNavigate } from '@tanstack/react-router';
import { Briefcase, LayoutDashboard, User, Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';

export function Header() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate({ to: '/' })}>
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="PlacementPro"
              className="h-12 md:h-14 w-auto rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                PlacementPro
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Student Placement Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 min-w-[120px] justify-end">
            {isAuthenticated ? (
              <nav className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/' })}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/profile/edit' })}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/admin' })}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                )}
                <LoginButton />
              </nav>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
