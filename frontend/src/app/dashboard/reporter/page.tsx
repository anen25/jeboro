'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Lock, Unlock } from 'lucide-react';

interface Report {
    id: string;
    title: string;
    content: string;
    publishType: 'OPEN' | 'EXCLUSIVE';
    region: string | null;
    createdAt: string;
    author: { name: string | null };
}

export default function ReporterDashboard() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports?status=APPROVED') // Only show approved reports or pending? Prompt says "Feed (Open, Exclusive)"
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handlePick = async (reportId: string) => {
        // Implement Pick logic
        alert('Pick functionality to be implemented');
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">기자 대시보드</h1>
                <Button>제안서 작성</Button>
            </div>

            <Tabs defaultValue="feed">
                <TabsList className="mb-6">
                    <TabsTrigger value="feed">실시간 피드</TabsTrigger>
                    <TabsTrigger value="picked">내 취재 목록</TabsTrigger>
                    <TabsTrigger value="exclusive">독점 제보</TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="space-y-6">
                    {reports.map(report => (
                        <Card key={report.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div className="flex gap-2 mb-2">
                                        <Badge variant={report.publishType === 'EXCLUSIVE' ? 'destructive' : 'secondary'}>
                                            {report.publishType === 'EXCLUSIVE' ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                                            {report.publishType}
                                        </Badge>
                                        {report.region && <Badge variant="outline">{report.region}</Badge>}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                                <CardTitle>{report.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3 text-muted-foreground">
                                    {report.publishType === 'EXCLUSIVE' ? '독점 제보입니다. 내용을 확인하려면 Pick하세요.' : report.content}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handlePick(report.id)} className="w-full">
                                    {report.publishType === 'EXCLUSIVE' ? '독점 취재하기 (Pick)' : '취재하기'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="picked">
                    <div className="text-center text-muted-foreground py-10">취재 중인 제보가 없습니다.</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
