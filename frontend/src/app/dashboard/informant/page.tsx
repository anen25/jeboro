'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Report {
    id: string;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    publishType: 'OPEN' | 'EXCLUSIVE';
    createdAt: string;
}

export default function InformantDashboard() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/my') // We need to implement this API or filter in /api/reports
            .then(res => {
                if (res.ok) return res.json();
                // Fallback for demo if API not ready or auth missing
                return [];
            })
            .then(data => setReports(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">내 제보 현황</h1>

            <div className="grid gap-6">
                {reports.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-muted-foreground">
                            제출한 제보가 없습니다.
                        </CardContent>
                    </Card>
                ) : (
                    reports.map(report => (
                        <Card key={report.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{report.title}</CardTitle>
                                        <CardDescription>{new Date(report.createdAt).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={report.publishType === 'EXCLUSIVE' ? 'destructive' : 'secondary'}>
                                            {report.publishType}
                                        </Badge>
                                        <Badge variant={report.status === 'APPROVED' ? 'default' : report.status === 'REJECTED' ? 'destructive' : 'outline'}>
                                            {report.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
