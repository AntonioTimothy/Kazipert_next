"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PhotoStudioAdminDashboardPage() {
  return (
    <div className="space-y-6 p-2 sm:p-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Photo Studio Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Photo capture and verification overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Awaiting capture</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Verified photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Quality issues</p>
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
            <button className="btn btn-primary">Start New Session</button>
            <button className="btn btn-outline">View Queue</button>
            <button className="btn btn-outline">Manage Equipment</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
