import { HowItWorksStep } from "./HowItWorksStep";

export function HowItWorks({ howItWorksRef }) {
  return (
    <section ref={howItWorksRef} className="mt-16 sm:mt-20 fade-in-on-scroll">
      <h2 className="text-center font-roboto-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#538890] dark:text-white/90 mb-8">
        How 90-Second Solutions Works
      </h2>

      {/* Connector line wrapper */}
      <div className="relative max-w-6xl mx-auto">
        {/* thin horizontal connector on large screens with subtle end fade (gold to match mobile) */}
        <div
          className="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
          style={{
            background:
              "linear-gradient(to right, rgba(211,201,112,0) 0%, rgba(211,201,112,1) 15%, rgba(211,201,112,1) 85%, rgba(211,201,112,0) 100%)",
          }}
          aria-hidden="true"
        />
        {/* thin vertical connector on phones (stacked) now gold with fade gradient */}
        <div
          className="sm:hidden absolute left-3 top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(211,201,112,0) 0%, rgba(211,201,112,1) 15%, rgba(211,201,112,1) 85%, rgba(211,201,112,0) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Desktop: dots aligned to each card via an overlay 3-col grid */}
        <div className="hidden lg:grid absolute inset-0 grid-cols-3 items-center z-20">
          {/* Dot 1 with tooltip + keyboard focus */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="relative group pointer-events-auto focus:outline-none"
              tabIndex={0}
              aria-label="Notice"
              title="Notice"
            >
              <div className="w-2 h-2 rounded-full bg-[#D3C970] soft-pulse" />
              <div className="absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-[#1F2937] text-white text-[10px] font-montserrat opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] group-focus:opacity-100 group-focus:-translate-y-[110%] transition-all duration-200 shadow">
                Notice
              </div>
            </button>
          </div>
          {/* Dot 2 with tooltip + keyboard focus */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="relative group pointer-events-auto focus:outline-none"
              tabIndex={0}
              aria-label="Reset"
              title="Reset"
            >
              <div className="w-2 h-2 rounded-full bg-[#D3C970] soft-pulse" />
              <div className="absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-[#1F2937] text-white text-[10px] font-montserrat opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] group-focus:opacity-100 group-focus:-translate-y-[110%] transition-all duration-200 shadow">
                Reset
              </div>
            </button>
          </div>
          {/* Dot 3 with tooltip + keyboard focus */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="relative group pointer-events-auto focus:outline-none"
              tabIndex={0}
              aria-label="Return"
              title="Return"
            >
              <div className="w-2 h-2 rounded-full bg-[#D3C970] soft-pulse" />
              <div className="absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-[#1F2937] text-white text-[10px] font-montserrat opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] group-focus:opacity-100 group-focus:-translate-y-[110%] transition-all duration-200 shadow">
                Return
              </div>
            </button>
          </div>
        </div>

        <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-6 sm:pl-0">
          {/* Step 1 */}
          <HowItWorksStep
            number={1}
            title="Notice"
            description="Recognize when emotion takes over."
            bgColor="bg-[#E6F1EB] dark:bg-[#2B3A33]"
          />

          {/* Step 2 - linked to /reset */}
          <HowItWorksStep
            number={2}
            title="Reset"
            description="Use a guided 90-second practice to allow the emotion to complete its cycle."
            bgColor="bg-[#F4F0D6] dark:bg-[#4C4526]"
            isLink={true}
            href="/reset"
          />

          {/* Step 3 */}
          <HowItWorksStep
            number={3}
            title="Return"
            description="Regain clarity, calm, and intentional response."
            bgColor="bg-[#E6F1EB] dark:bg-[#2B3A33]"
          />
        </div>
      </div>

      {/* small Start a Reset button under steps */}
      <div className="mt-8 flex justify-center">
        <a
          href="/reset"
          className="inline-flex items-center gap-2 bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 5L20 12L13 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Start a Reset
        </a>
      </div>

      <p className="text-center font-montserrat text-sm sm:text-base text-[#538890]/80 dark:text-white/80 mt-10 max-w-3xl mx-auto">
        You don't need to fix yourself — you need to let your brain finish what
        it started.
      </p>
    </section>
  );
}
