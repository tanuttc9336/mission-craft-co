export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm focus:tracking-wide focus:outline-none focus:ring-2 focus:ring-white/80"
    >
      Skip to main content
    </a>
  );
}
