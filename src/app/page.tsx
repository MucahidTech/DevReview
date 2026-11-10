import { Suspense } from "react";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { CategoriesSection } from "@/components/landing/categories-section";
import { SiteFooter } from "@/components/landing/site-footer";

function CategoriesSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
