import { userRole } from "@/utility/userRole";
import Link from "next/link";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function LandingPage() {
  return (
    <div className="bg-gray-900 h-screen ">
      <div className="relative isolate lg:px-8">
        {/* Back Light Shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        {/* CENTERED CONTENT */}
        <div className="flex justify-center items-center h-screen">
          <div className="mx-auto max-w-2xl text-center">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                An-Nahdah Online Institute - AOI{" "}
                <Link
                  href="https://an-nahdah.vercel.app/"
                  className="font-semibold text-indigo-400"
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  Go to Website <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Data to enrich your online business
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/admin"
                className="rounded-md bg-nhd-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-nhd-400 focus-visible:outline-2"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/instructor"
                className="rounded-md bg-transparent border px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg- focus-visible:outline-2"
              >
                Instructor Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Back Light Shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-25rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-42rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </div>
  );
}
