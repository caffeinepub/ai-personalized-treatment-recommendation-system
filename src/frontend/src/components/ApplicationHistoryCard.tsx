import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Clock } from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../backend';

interface ApplicationHistoryCardProps {
  application: JobApplication;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  applied: { label: 'Applied', variant: 'default' },
  reviewed: { label: 'Under Review', variant: 'secondary' },
  interviewed: { label: 'Interview Scheduled', variant: 'outline' },
  offered: { label: 'Offer Received', variant: 'default' },
  rejected: { label: 'Not Selected', variant: 'destructive' },
};

export function ApplicationHistoryCard({ application }: ApplicationHistoryCardProps) {
  const config = statusConfig[application.status];
  
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{application.companyName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{application.jobTitle}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Applied: {formatDate(application.submittedTime)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Badge variant={config.variant} className="whitespace-nowrap">
              {config.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
