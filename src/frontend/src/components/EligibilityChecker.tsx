import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Award, BookOpen, Wrench } from 'lucide-react';
import type { JobPosting, StudentProfile } from '../backend';

interface EligibilityCheckerProps {
  job: JobPosting;
  studentProfile: StudentProfile;
}

export function EligibilityChecker({ job, studentProfile }: EligibilityCheckerProps) {
  const meetsGPA = studentProfile.cgpa >= job.minCGPA;
  const meetsBranch = studentProfile.branches.some((branch) =>
    job.eligibleBranches.includes(branch)
  );
  const matchedSkills = studentProfile.skills.filter((skill) =>
    job.requiredSkills.includes(skill)
  );
  const isEligible = meetsGPA && meetsBranch;

  return (
    <Card className={isEligible ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEligible ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-primary" />
              You are eligible for this position
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-destructive" />
              Eligibility requirements not met
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="text-sm">CGPA Requirement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {studentProfile.cgpa.toFixed(2)} / {job.minCGPA.toFixed(2)}
              </span>
              {meetsGPA ? (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Branch Eligibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{studentProfile.branches.join(', ')}</span>
              {meetsBranch ? (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4" />
              <span className="text-sm">Skill Match</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => {
                const hasSkill = matchedSkills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={hasSkill ? 'default' : 'outline'}
                    className="flex items-center gap-1"
                  >
                    {skill}
                    {hasSkill && <CheckCircle2 className="w-3 h-3" />}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {matchedSkills.length} of {job.requiredSkills.length} required skills matched
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
