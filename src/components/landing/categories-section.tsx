import { fetchCategories } from "@/server/actions/quiz.actions";
import { CategoryCard } from "./category-card";

export async function CategoriesSection() {
  const result = await fetchCategories();

  if (!result.success) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p className="text-center text-destructive">Failed to load categories. Please try again.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Browse by category</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {result.data.map(({ category, count }) => (
          <CategoryCard key={category} category={category} count={count} />
        ))}
      </div>
    </section>
  );
}
