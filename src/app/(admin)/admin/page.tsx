import { statsService } from "@/server/services/stats.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const stats = await statsService.getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalQuestions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.categoryCounts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Difficulties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.difficultyCounts.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats.categoryCounts.map((item) => (
              <li key={item.category} className="flex justify-between text-sm">
                <span>{item.category}</span>
                <span className="font-medium">{item.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
