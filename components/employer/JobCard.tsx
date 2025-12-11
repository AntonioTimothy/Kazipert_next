import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DollarSign, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface JobCardProps {
    job: any;
    onView: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onView, onEdit, onDelete }) => {
    return (
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm group">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                            {job.category?.replace('_', ' ')}
                        </Badge>
                        <CardTitle className="text-xl line-clamp-2">{job.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs border-0">
                        {job.salary} {job.salaryCurrency}
                    </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.city}</span>
                    <Clock className="h-4 w-4 ml-4 text-muted-foreground" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </CardDescription>
                <CardDescription className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{job._count?.applications || 0} applications</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onView}>View</Button>
                {onEdit && <Button variant="default" size="sm" onClick={onEdit}>Edit</Button>}
                {onDelete && <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>}
            </CardContent>
        </Card>
    );
};
