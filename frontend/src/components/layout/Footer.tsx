import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6" style={{ maxWidth: 1540 }}>
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-newsreader text-xl font-bold text-primary">HeadlineHub</span>
          <p className="text-xs text-on-surface-variant">© 2024 HeadlineHub News Editorial. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {["About Us", "Privacy Policy", "Terms of Service", "Help Center"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
