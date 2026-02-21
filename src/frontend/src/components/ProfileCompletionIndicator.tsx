import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { StudentProfile } from '../backend';

interface ProfileCompletionIndicatorProps {
  profile: StudentProfile;
}

export function ProfileCompletionIndicator({ profile }: ProfileCompletionIndicatorProps) {
  const fields = [
    { name: 'Name', filled: !!profile.name },
    { name: 'Email', filled: !!profile.email },
    { name: 'CGPA', filled: profile.cgpa > 0 },
    { name: 'Branch', filled: profile.branches.length > 0 },
    { name: 'Skills', filled: profile.skills.length > 0 },
    { name: 'Resume Link', filled: !!profile.resumeLink },
    { name: 'Bio', filled: !!profile.bio },
  ];

  const filledCount = fields.filter((f) => f.filled).length;
  const percentage = Math.round((filledCount / fields.length) * 100);
  const missingFields = fields.filter((f) => !f.filled);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Completion</span>
          <Badge variant={percentage === 100 ? 'default' : 'secondary'}>
            {percentage}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={percentage} className="h-2" />
        
        {percentage < 100 && (
          <div>
            <p className="text-sm font-medium mb-2">Complete your profile to improve visibility:</p>
            <ul className="space-y-1">
              {missingFields.map((field) => (
                <li key={field.name} className="text-sm text-muted-foreground flex items-center gap-2">
                  <Circle className="w-3 h-3" />
                  {field.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {percentage === 100 && (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">Your profile is complete!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
