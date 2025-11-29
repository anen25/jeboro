'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
    // Mock data for now
    const stats = {
        totalReports: 120,
        approvalRate: 85,
        activeReporters: 45,
        pendingVerifications: 3
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">총 제보 수</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalReports}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">승인율</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.approvalRate}%</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">활동 기자</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.activeReporters}명</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">인증 대기</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-500">{stats.pendingVerifications}건</div></CardContent>
                </Card>
            </div>

            {/* Recent Reports Table */}
            <Card>
                <CardHeader>
                    <CardTitle>최근 제보 심사</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>제목</TableHead>
                                <TableHead>작성자</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>날짜</TableHead>
                                <TableHead>관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>도로 파손 제보합니다</TableCell>
                                <TableCell>user123</TableCell>
                                <TableCell><Badge variant="outline">PENDING</Badge></TableCell>
                                <TableCell>2025-11-29</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="default">승인</Button>
                                        <Button size="sm" variant="destructive">반려</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {/* More rows */}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
