import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ApplicationStepperProps {
    currentStep: string;
    onAdvance: (nextStep: string) => void;
}

export const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ currentStep, onAdvance }) => {
    const steps = [
        'APPLICATION_SUBMITTED',
        'SHORTLISTED',
        'CONTRACT_SENT',
        'FLIGHT_TICKET_SENT',
        'COMPLETED',
    ];

    const currentIdx = steps.indexOf(currentStep);

    return (
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Application Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {steps.map((step, idx) => (
                    <div key={step} className="flex items-center gap-3">
                        <Badge variant={idx <= currentIdx ? 'default' : 'secondary'} className="w-48 text-center">
                            {step.replace(/_/g, ' ')}
                        </Badge>
                        {idx === currentIdx && idx < steps.length - 1 && (
                            <Button size="sm" onClick={() => onAdvance(steps[idx + 1])}>
                                <ArrowRight className="h-4 w-4 mr-1" /> Advance
                            </Button>
                        )}
                        {idx < currentIdx && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
