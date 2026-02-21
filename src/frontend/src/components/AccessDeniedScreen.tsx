import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <ShieldAlert className="w-6 h-6" />
          Access Denied
        </CardTitle>
        <CardDescription>
          You don't have permission to access this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This page is restricted to administrators only. If you believe you should have access, please contact your placement coordinator.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
