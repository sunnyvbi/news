import { site } from "@/data/content";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-bone/60 bg-paper py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-display text-sm font-bold tracking-widest text-ink block mb-1">
            {site.name}
          </span>
          <p className="font-body text-xs text-ink/70">
            {site.tagline} • {site.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-ink/70">
          <Link to="/news" className="hover:text-indigo transition-colors font-semibold">
            AI News Wire
          </Link>
          {site.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo transition-colors"
            >
              {s.label}
            </a>
          ))}
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
