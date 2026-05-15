"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { label: "Tech", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Business", value: "business" },
  { label: "Science", value: "science" },
  { label: "Entertainment", value: "entertainment" },
];

interface NavbarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
}

export default function Navbar({
  activeCategory = "technology",
  onCategoryChange,
  onSearch,
}: NavbarProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const isHomePage = pathname === "/";

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60]" style={{ background: "#4648d4" }}>
        <div className="w-1/3 h-full" style={{ background: "#3730a3" }} />
      </div>

      {/* Navbar */}
      <nav
        className="fixed top-[2px] left-0 w-full z-50 border-b border-outline-variant"
        style={{ background: "rgba(250,248,255,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="site-navbar-inner mx-auto flex items-center">
          {/* Brand */}
          <Link href="/" className="site-navbar-brand flex-shrink-0">
            <span
              className="font-newsreader font-bold tracking-tight"
              style={{ fontSize: 26, color: "#1f108e" }}
            >
              HeadlineHub
            </span>
          </Link>

          {/* Category Links — Desktop */}
          {isHomePage && (
            <div className="hidden lg:flex items-center gap-1 xl:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange?.(cat.value)}
                  className="transition-all duration-200"
                  style={{
                    fontSize: 14,
                    fontWeight: activeCategory === cat.value ? 600 : 500,
                    padding: "7px clamp(10px, 1vw, 16px)",
                    borderRadius: 9999,
                    background: activeCategory === cat.value ? "#3730a3" : "transparent",
                    color: activeCategory === cat.value ? "#ffffff" : "#131b2e",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar */}
          {isHomePage && (
            <div
              className="site-navbar-search hidden lg:block"
              style={{
                marginLeft: "auto",
              }}
            >
              <div className="relative">
                <span className="search-glyph" style={{ left: 18 }} aria-hidden="true" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder="Search technical articles..."
                  style={{
                    width: "100%",
                    height: 38,
                    background: "#f7f6ff",
                    border: "1px solid #bfc0d1",
                    borderRadius: 9999,
                    padding: "0 18px 0 50px",
                    fontSize: 15,
                    color: "#131b2e",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4648d4";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#bfc0d1";
                    e.target.style.background = "#f7f6ff";
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            className={`site-navbar-actions ${
              isHomePage ? "site-navbar-actions-home" : "site-navbar-actions-away"
            } flex items-center gap-1`}
          >
            {loading ? (
              <div
                className="animate-pulse rounded-full"
                style={{ width: 80, height: 34, background: "#eaedff" }}
              />
            ) : user ? (
              <>
                {/* Bookmark */}
                <Link
                  href="/favourites"
                  className="flex items-center justify-center rounded-full transition-all hover:bg-surface-container-low"
                  style={{ width: 36, height: 36 }}
                  title="Saved Articles"
                >
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: "#111827" }}>
                    <path d="M7 4.75h10v15l-5-3.1-5 3.1v-15Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center rounded-full transition-all hover:bg-surface-container-low"
                    style={{ width: 36, height: 36 }}
                    aria-label="Account menu"
                  >
                    <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" style={{ color: "#111827" }}>
                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9" />
                      <circle cx="12" cy="9.6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M7.8 17.2c.9-2 2.4-3 4.2-3s3.3 1 4.2 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full"
                      style={{
                        marginTop: 8,
                        width: 224,
                        background: "#ffffff",
                        border: "1px solid #c8c4d5",
                        borderRadius: 12,
                        boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
                        zIndex: 70,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#131b2e" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#464553" }}>{user.email}</div>
                      </div>
                      <div style={{ height: 1, background: "#c8c4d5" }} />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg transition-colors hover:bg-red-50"
                        style={{
                          padding: "8px 8px",
                          fontSize: 14,
                          color: "#ba1a1a",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4H18v16h-6.5a1.5 1.5 0 0 1-1.5-1.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M4 12h9m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <button
                  className="font-semibold transition-all"
                  style={{
                    background: "#1f108e",
                    color: "#ffffff",
                    padding: "8px 24px",
                    borderRadius: 9999,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#4648d4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#1f108e")}
                >
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile hamburger */}
            {isHomePage && (
              <button
                className="lg:hidden flex items-center justify-center rounded-full transition-all hover:bg-surface-container-low"
                style={{ width: 36, height: 36, outline: "none" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <span aria-hidden="true" className={mobileMenuOpen ? "close-lines" : "hamburger-lines"} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isHomePage && mobileMenuOpen && (
          <div
            className="site-navbar-mobile lg:hidden border-t border-outline-variant"
            style={{ background: "#faf8ff" }}
          >
            {/* Mobile Search */}
            <div className="relative mb-3">
              <span className="search-glyph" style={{ left: 16 }} aria-hidden="true" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Search articles..."
                style={{
                  width: "100%",
                  background: "#f2f3ff",
                  border: "1px solid #c8c4d5",
                  borderRadius: 9999,
                  padding: "8px 16px 8px 44px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            {/* Mobile Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    onCategoryChange?.(cat.value);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: 13,
                    fontWeight: activeCategory === cat.value ? 600 : 500,
                    padding: "6px 14px",
                    borderRadius: 9999,
                    background: activeCategory === cat.value ? "#3730a3" : "#eaedff",
                    color: activeCategory === cat.value ? "#ffffff" : "#464553",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      {isHomePage && mobileMenuOpen && (
        <div className="site-navbar-menu-spacer lg:hidden" aria-hidden="true" />
      )}
    </>
  );
}
