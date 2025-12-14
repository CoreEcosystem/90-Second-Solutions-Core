export function BackgroundImages() {
  return (
    <>
      {/* Full-page background image (light mode) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 dark:hidden"
        aria-hidden="true"
      >
        <img
          src="https://ucarecdn.com/de2a1c8b-0c13-489e-99cb-85a05bfe4c35/-/format/auto/"
          alt="Abstract network visualization with flowing data connections"
          className="w-full h-full object-cover contrast-150 saturate-200"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Full-page background image (dark mode) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        aria-hidden="true"
      >
        <img
          src="https://ucarecdn.com/de2a1c8b-0c13-489e-99cb-85a05bfe4c35/-/format/auto/"
          alt="Abstract network visualization with flowing data connections"
          className="w-full h-full object-cover contrast-150 saturate-200"
          loading="eager"
          decoding="async"
        />
      </div>
    </>
  );
}
