import Link from "next/link";

export function Hero() {
  return (
    <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Master the depths of web engineering
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Deep technical questions on JavaScript internals, web architecture, accessibility, and
        networking. Each answer comes with a thorough explanation.
      </p>
      <Link
        href="/quiz"
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Start a Quiz
      </Link>
    </section>
  );
}
