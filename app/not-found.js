import Link from "next/link";

export default function Example() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-[#206080]">404</p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          Page not found
        </h1>

        <p className="mt-6 text-lg text-gray-500 sm:text-xl">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-nhd-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-nhd-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>

          {/* <Link href="/support" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">→</span>
          </Link> */}
        </div>
      </div>
    </main>
  );
}
