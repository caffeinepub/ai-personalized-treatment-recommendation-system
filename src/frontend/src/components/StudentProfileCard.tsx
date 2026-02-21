import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Mail, Award, BookOpen, FileText } from 'lucide-react';
import type { StudentProfile } from '../backend';

interface StudentProfileCardProps {
  profile: StudentProfile;
}

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/profile-icon.dim_128x128.png"
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-primary"
          />
          <div>
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/profile/edit' })}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">CGPA</p>
              <p className="font-semibold">{profile.cgpa.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Branch</p>
              <p className="font-semibold">{profile.branches.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Resume</p>
              <a
                href={profile.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>

        {profile.skills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.bio && (
          <div>
            <p className="text-sm font-medium mb-2">Bio</p>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
