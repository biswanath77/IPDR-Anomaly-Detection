import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload, Activity, AlertTriangle, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const [totalPredictions, setTotalPredictions] = useState<number | null>(null);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [anomaliesDetected, setAnomaliesDetected] = useState<number | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/system/status`)
      .then((r) => r.json())
      .then((s) => {
        setTotalUploads(s.total_uploads ?? 0);
        setUserCount(s.user_count ?? 0);
        setTotalPredictions(s.total_predictions ?? 0);
      })
      .catch(() => {});

    fetch(`${apiUrl}/reports/summary`)
      .then((r) => r.json())
      .then((r) => {
        const by = r.by_label || {};
        // count non-benign as anomalies
        let anomalies = 0;
        Object.entries(by).forEach(([k, v]: any) => {
          if (String(k).toLowerCase() !== 'benign') anomalies += Number(v || 0);
        });
        setAnomaliesDetected(anomalies);
        setTotalPredictions(r.total_predictions ?? 0);
      })
      .catch(() => {});

  }, []);

  const stats = [
    { title: "Total Records", value: totalPredictions !== null ? totalPredictions.toLocaleString() : '—', change: "+12.5%", icon: Database, color: "text-primary" },
    { title: "Uploads Today", value: totalUploads !== null ? String(totalUploads) : '—', change: "+8.2%", icon: Upload, color: "text-secondary" },
    { title: "Active Analysis", value: userCount !== null ? String(userCount) : '—', change: "+3", icon: Activity, color: "text-primary" },
    { title: "Anomalies Detected", value: anomaliesDetected !== null ? String(anomaliesDetected) : '—', change: "-2", icon: AlertTriangle, color: "text-destructive" },
  ];

  const recentActivity = [
    { action: "CSV Upload", file: "ipdr_data_2024_01.csv", time: "2 minutes ago", status: "completed" },
    { action: "ML Analysis", file: "anomaly_detection.py", time: "15 minutes ago", status: "running" },
    { action: "Report Generated", file: "monthly_report.pdf", time: "1 hour ago", status: "completed" },
    { action: "Data Export", file: "filtered_results.csv", time: "3 hours ago", status: "completed" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Command Center</h1>
          <p className="text-muted-foreground">Monitor your IPDR analysis operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'} mt-1`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest operations and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.file}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        activity.status === 'completed' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {activity.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                System Overview
              </CardTitle>
              <CardDescription>Current system status and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-semibold text-foreground">64.5 GB / 100 GB</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-vault-gradient w-[64.5%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing Power</span>
                  <span className="font-semibold text-foreground">72%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-primary w-[72%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-foreground">24 / 50</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-[48%]" />
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Last backup:</span>
                  <span className="font-semibold text-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
