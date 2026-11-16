import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-xs font-mono uppercase tracking-widest text-indigo mb-3 block">
        404
      </span>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink mb-4">
        Page Not Found
      </h1>
      <p className="font-body text-lg text-ink/70 mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-indigo text-paper font-display text-xs font-semibold tracking-wider uppercase hover:bg-indigoDeep transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
