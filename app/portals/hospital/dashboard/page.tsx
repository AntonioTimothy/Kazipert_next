"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HospitalAdminDashboardPage() {
  return (
    <div className="space-y-6 p-2 sm:p-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hospital Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Medical verifications and records overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Medicals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Recent approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Unread alerts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button className="btn btn-primary">Review Medicals</button>
            <button className="btn btn-outline">View Records</button>
            <button className="btn btn-outline">Manage Staff</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
