import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">DevReview</h1>
        <ModeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Question</CardTitle>
          <CardDescription>JS Quirks · Easy</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Badge>JavaScript</Badge>
            <Badge variant="secondary">Quirks</Badge>
          </div>
          <Button>Start Quiz</Button>
        </CardContent>
      </Card>
    </main>
  );
}
