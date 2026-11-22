import Link from 'next/link';

export default function PythonBasicPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Python Basic</h1>
      <p className="mt-3 text-fd-muted-foreground">
        CrewAI শেখার আগে দরকারি Python ভিত্তি — ভেরিয়েবল, লিস্ট, ফাংশন, ক্লাস,
        ফাইল পড়া-লেখা।
      </p>

      <div className="mt-8 rounded-xl border bg-fd-card p-6">
        <p className="text-sm text-fd-muted-foreground">
          এই সেকশনটা এখনো প্রস্তুত হচ্ছে — কন্টেন্ট শীঘ্রই যোগ করা হবে।
        </p>
      </div>

      <Link
        href="/docs"
        className="mt-6 text-sm font-medium text-fd-primary hover:underline"
      >
        CrewAI ডকুমেন্টেশনে ফিরে যাও
      </Link>
    </main>
  );
}
