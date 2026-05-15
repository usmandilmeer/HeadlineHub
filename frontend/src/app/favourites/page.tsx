"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import {
  getArticleKey,
  relativeTime,
} from "@/lib/articles";
import { useAuth } from "@/context/AuthContext";
import { Article } from "@/types";

function TrashIcon({ size = 25 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 4h6m-8 4h10m-8.5 0 .6 11h5.8l.6-11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon({
  size = 24,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path
        d="M7 4.75h10v15l-5-3.1-5 3.1v-15Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v5l3.2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getPublishedText(date: string | null | undefined) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return `Published ${relativeTime(parsed)}`;
}

function SavedArticleMeta({ article }: { article: Article }) {
  const publishedText = getPublishedText(article.published_at);
  if (!publishedText) return null;

  return (
    <div className="saved-meta">
      <ClockIcon />
      <span>{publishedText}</span>
    </div>
  );
}

function SavedArticleImage({
  article,
  className = "article-image",
}: {
  article: Article;
  className?: string;
}) {
  if (!article.image_url) return null;

  return (
    <img
      className={className}
      src={article.image_url}
      alt=""
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function SavedTopbar({ userName }: { userName: string }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderTop: "3px solid #1f108e",
        borderBottom: "1px solid #c8c4d5",
        background: "rgba(250,248,255,0.9)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="page-shell flex items-center justify-between gap-7"
        style={{ height: 62, maxWidth: 1540 }}
      >
        <Link href="/" className="flex-shrink-0">
          <span
            className="font-newsreader font-bold tracking-tight"
            style={{ fontSize: 26, color: "#1f108e" }}
          >
            HeadlineHub
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <Link
            href="/favourites"
            className="icon-button"
            style={{
              width: 42,
              height: 42,
              color: "#1f108e",
              borderBottom: "2px solid #1f108e",
            }}
          >
            <BookmarkIcon size={23} filled />
          </Link>

          <span
            className="hidden md:inline font-newsreader"
            style={{ color: "#464553", fontSize: 15 }}
          >
            Welcome, {userName}
          </span>
        </div>
      </div>
    </header>
  );
}

export default function FavouritesPage() {
  const { user, loading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    api
      .get<{ articles: Article[] }>("/favourites")
      .then((res) => setArticles(res.data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setFetching(false));
  }, [user]);

  const removeArticle = async (article: Article) => {
    const key = getArticleKey(article);
    await api.delete(`/favourites/${encodeURIComponent(key)}`);
    setArticles((curr) =>
      curr.filter((item) => getArticleKey(item) !== key)
    );
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </main>
    );
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#faf8ff",
          padding: 24,
        }}
      >
        <section
          className="news-card"
          style={{ maxWidth: 460, padding: 42, textAlign: "center" }}
        >
          <h1 className="font-newsreader" style={{ fontSize: 34, fontWeight: 700 }}>
            Sign in to view saved articles
          </h1>
          <p style={{ marginTop: 12, color: "#464553" }}>
            Your personal library appears here after you bookmark stories.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              marginTop: 26,
              paddingInline: 32,
              borderRadius: 999,
              background: "#1f108e",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  const isEmpty = articles.length === 0;

  const featured = articles[0];
  const rest = articles.slice(1);
  const sideArticles = rest.slice(0, 2);
  const gridArticles = rest.slice(2, articles.length);

  return (
    <div className="min-h-screen flex flex-col">
      <SavedTopbar userName={user.name.split(" ")[0] || user.name} />

      <main className="flex-1" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <section className="page-shell" style={{ maxWidth: 1540 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 className="font-newsreader" style={{ fontSize: 48, fontWeight: 700 }}>
              Your Saved Articles
            </h1>
          </div>

          {isEmpty ? (
            <div
              style={{
                minHeight: 420,
                border: "1px dashed #c8c4d5",
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                background: "#f7f5ff",
                textAlign: "center",
                padding: 40,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <BookmarkIcon size={42} />
                <h3 style={{ marginTop: 16, fontSize: 22 }}>
                  No saved articles yet
                </h3>
                <p style={{ marginTop: 8, color: "#464553" }}>
                  Start bookmarking stories to build your library.
                </p>
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    marginTop: 22,
                    padding: "10px 26px",
                    background: "#1f108e",
                    color: "#fff",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  Explore Feed
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* MAIN LAYOUT */}
              <div className="saved-layout grid gap-6">
                {/* FEATURED */}
                <article className="news-card featured-card">
                  <div className={featured.image_url ? "featured-media" : "featured-media no-image"}>
                    <SavedArticleImage article={featured} />
                    <button
                      onClick={() => removeArticle(featured)}
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "#f2f0ff",
                        color: "#1f108e",
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid rgba(31,16,142,0.15)",
                      }}
                    >
                      <TrashIcon size={22} />
                    </button>
                  </div>

                  <div className="featured-content">
                    <span className="chip">
                      {featured.source || featured.category}
                    </span>
                    <SavedArticleMeta article={featured} />

                    <h2 className="featured-title">
                      {featured.title}
                    </h2>

                    <p className="featured-desc">
                      {featured.description}
                    </p>
                  </div>
                </article>

                {/* SIDE */}
                <aside className="grid gap-6">
                  {sideArticles.map((article) => (
                    <article
                      key={getArticleKey(article)}
                      className="news-card"
                      style={{ padding: 24 }}
                    >
                      <div style={{ marginBottom: 12 }}>
                        <SavedArticleImage article={article} className="side-img" />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span className="chip">
                          {article.source || article.category}
                        </span>

                        <button
                          onClick={() => removeArticle(article)}
                          style={{
                            width: 32,
                            height: 32,
                            display: "grid",
                            placeItems: "center",
                            color: "#777584",
                          }}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                      <SavedArticleMeta article={article} />

                      <h3 style={{ marginTop: 14 }}>{article.title}</h3>

                      <p style={{ marginTop: 8, color: "#464553" }}>
                        {article.description}
                      </p>
                    </article>
                  ))}
                </aside>
              </div>

              {/* GRID */}
              <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 28 }}>
                {gridArticles.map((article) => (
                  <article key={getArticleKey(article)} className="news-card">
                    <SavedArticleImage article={article} className="saved-grid-img" />
                    <div style={{ padding: 24 }}>
                      <div className="flex justify-between">
                        <span className="chip">
                          {article.source || article.category}
                        </span>
                        <button onClick={() => removeArticle(article)}>
                          <TrashIcon />
                        </button>
                      </div>
                      <SavedArticleMeta article={article} />

                      <h3 style={{ marginTop: 14 }}>{article.title}</h3>
                      <p style={{ marginTop: 8, color: "#464553" }}>
                        {article.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {fetching && (
            <p style={{ marginTop: 20, textAlign: "center", color: "#464553" }}>
              Loading your library...
            </p>
          )}
        </section>
      </main>

      <Footer />

      {/* ONLY MOBILE FIX CSS */}
      <style jsx>{`
        .saved-layout {
          grid-template-columns: minmax(0, 2fr) minmax(315px, 0.98fr);
        }

        .featured-media {
          position: relative;
          aspect-ratio: 1.92 / 1;
        }

        .featured-media.no-image {
          aspect-ratio: auto;
          min-height: 78px;
        }

        :global(.side-img) {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 10px;
        }

        :global(.saved-grid-img) {
          width: 100%;
          aspect-ratio: 1.72 / 1;
          display: block;
          object-fit: cover;
          background: #e2e7ff;
        }

        :global(.saved-meta) {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: #464553;
          font-size: 13px;
          line-height: 1.2;
        }

        .featured-content {
          padding: 40px;
        }

        .featured-title {
          margin-top: 16px;
          font-size: 32px;
        }

        .featured-desc {
          margin-top: 16px;
          color: #464553;
        }

        /* MOBILE FIX */
        @media (max-width: 768px) {
          .saved-layout {
            grid-template-columns: 1fr;
          }

          .featured-content {
            padding: 20px;
          }

          .featured-title {
            font-size: 22px;
          }

          .featured-desc {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
