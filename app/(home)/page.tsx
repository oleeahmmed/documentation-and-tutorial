import Link from 'next/link';
import { ArrowRight, Boxes, Code, Sparkles, WandSparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Python Developer Documentation
      </h1>
      <p className="mt-3 max-w-2xl text-fd-muted-foreground">
        বাংলায় শেখো Python — ভিত্তি থেকে শুরু করে CrewAI দিয়ে AI Agent বানানো
        পর্যন্ত।
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs"
          className="group rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
        >
          <Sparkles className="size-6 text-fd-primary" />
          <h2 className="mt-4 text-lg font-semibold">CrewAI</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Getting Started থেকে production পর্যন্ত — সম্পূর্ণ বাংলা CrewAI
            ডকুমেন্টেশন।
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
            ডকুমেন্টেশন দেখো
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/python-basic"
          className="group rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
        >
          <Code className="size-6 text-fd-primary" />
          <h2 className="mt-4 text-lg font-semibold">Python Basic</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            CrewAI শেখার আগে দরকারি Python ভিত্তি — ভেরিয়েবল, লিস্ট, ফাংশন,
            ক্লাস, ফাইল।
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
            শুরু করো
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/django"
          className="group rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
        >
          <Boxes className="size-6 text-fd-primary" />
          <h2 className="mt-4 text-lg font-semibold">Django Tutorial</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            একই প্রজেক্টে Classic Django ওয়েবসাইট আর DRF Student API — CORS,
            JWT, Swagger, ছবি আপলোড, SMTP সহ।
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
            টিউটোরিয়াল দেখো
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/prompt-master"
          className="group rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
        >
          <WandSparkles className="size-6 text-fd-primary" />
          <h2 className="mt-4 text-lg font-semibold">Prompt Master</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            ডিপ্লয় আর সমস্যা নির্ণয়ের মাস্টার প্রম্পট — কপি করে AI-কে দিলেই
            কাজ শুরু।
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
            প্রম্পট দেখো
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </main>
  );
}
