import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, File } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const recentReports = [
    { name: "Monthly Traffic Analysis", date: "2024-01-15", type: "PDF", size: "2.4 MB", icon: FileText },
    { name: "Anomaly Detection Summary", date: "2024-01-14", type: "PDF", size: "1.8 MB", icon: FileText },
    { name: "Top Talkers Report", date: "2024-01-13", type: "CSV", size: "0.9 MB", icon: File },
    { name: "Geographic Distribution", date: "2024-01-12", type: "PDF", size: "3.2 MB", icon: FileText },
  ];

  const handleExport = (format: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    if (format.toLowerCase() === 'csv') {
      // trigger download from backend
      const url = `${apiUrl}/reports/export?format=csv`;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to generate export');
          return res.blob();
        })
        .then((blob) => {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'predictions_export.csv';
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.success('CSV export downloaded');
        })
        .catch((e) => {
          console.error(e);
          toast.error('Export failed');
        });
      return;
    }
    toast.success(`Generating ${format} report...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reports & Export</h1>
          <p className="text-muted-foreground">Generate and download analysis reports</p>
        </div>

        {/* Export Options */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Export to PDF
              </CardTitle>
              <CardDescription>Generate comprehensive PDF reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export detailed analysis with charts, graphs, and summaries in PDF format. Perfect for presentations and documentation.
              </p>
              <Button
                onClick={() => handleExport('PDF')}
                className="w-full bg-vault-gradient hover:opacity-90 text-vault-dark font-semibold shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate PDF Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <File className="h-5 w-5 text-secondary" />
                Export to CSV
              </CardTitle>
              <CardDescription>Export raw data for further analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Download filtered and analyzed data in CSV format. Ideal for importing into spreadsheets and other analysis tools.
              </p>
              <Button
                onClick={() => handleExport('CSV')}
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Recent Reports
            </CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors border border-border/30"
                >
                <div className="flex items-center gap-4">
                  <report.icon className="h-8 w-8 text-primary" />
                  <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <span className="text-primary">{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
