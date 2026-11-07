import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: string;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link href={`/quiz?category=${encodeURIComponent(category)}`} className="block">
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{category}</span>
            <Badge variant="secondary">{count}</Badge>
          </CardTitle>
          <CardDescription>
            {count === 0 ? "No questions yet" : `${count} question${count === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Test your knowledge of {category.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
