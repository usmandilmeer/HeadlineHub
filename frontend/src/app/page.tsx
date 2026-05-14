"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/news/ArticleCard";
import FeaturedCard from "@/components/news/FeaturedCard";
import SidebarCard from "@/components/news/SidebarCard";
import api from "@/lib/api";
import { getArticleKey } from "@/lib/articles";
import { useAuth } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";
import { Article } from "@/types";

const SAMPLE_ARTICLES: Article[] = [
  {
    id: 1,
    article_id: "sample-quantum-leap",
    title: "The Quantum Leap: How Next-Gen Processors are Redefining AI Capabilities",
    description:
      "New breakthroughs in silicon photonics suggest that the next generation of computing power will be 100x faster while consuming only a fraction of the power.",
    url: "#",
    image_url: null,
    source: "The Verge",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
  {
    id: 2,
    article_id: "sample-zero-trust",
    title: "Securing the New Web: Zero-Trust Architectures Go Mainstream",
    description: "Enterprise security teams are rebuilding access around identity-first controls.",
    url: "#",
    image_url: null,
    source: "TechCrunch",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
  {
    id: 3,
    article_id: "sample-spatial-computing",
    title: "Beyond Screens: Why Spatial Computing is Finally Ready for the Office",
    description: "Lightweight headsets and better collaboration tooling are changing desk work.",
    url: "#",
    image_url: null,
    source: "TechCrunch",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
  {
    id: 4,
    article_id: "sample-generative-ethics",
    title: "The Ethics of Generative AI: Setting New Industry Standards",
    description: "New benchmarks are helping publishers and researchers audit model output.",
    url: "#",
    image_url: null,
    source: "TechCrunch",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
  {
    id: 5,
    article_id: "sample-moores-law",
    title: "Moore's Law 2.0: The New Era of Stacked Chip Design",
    description: "Three-dimensional silicon is pushing performance gains beyond transistor scaling.",
    url: "#",
    image_url: null,
    source: "TechCrunch",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
  {
    id: 6,
    article_id: "sample-starlink",
    title: "Global Starlink: Bridging the Digital Divide in Remote Regions",
    description: "Satellite networks are bringing resilient connectivity to remote communities.",
    url: "#",
    image_url: null,
    source: "TechCrunch",
    category: "technology",
    published_at: null,
    cached_at: "",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [category, setCategory] = useState("technology");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadNews = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = query.trim()
          ? `/news/search?q=${encodeURIComponent(debouncedQuery.trim())}`
          : `/news?category=${encodeURIComponent(category)}`;
        const response = await api.get<{ articles: Article[] }>(endpoint, { signal: controller.signal });
        setArticles(response.data.articles?.length ? response.data.articles : SAMPLE_ARTICLES);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setArticles(SAMPLE_ARTICLES);
        setError("Showing curated sample stories until the news feed responds.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    return () => {
      controller.abort();
    };
  }, [category, debouncedQuery]);

  useEffect(() => {
    if (!user) return;

    api
      .get<{ articles: Article[] }>("/favourites")
      .then((response) => setSavedIds(new Set(response.data.articles.map((article) => article.article_id))))
      .catch(() => setSavedIds(new Set()));
  }, [user]);

  const visibleArticles = useMemo(() => {
    return articles.length >= 6 ? articles.slice(0, 6) : [...articles, ...SAMPLE_ARTICLES].slice(0, 6);
  }, [articles]);

  const saveArticle = async (article: Article) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const key = getArticleKey(article);
    const next = new Set(savedIds);

    try {
      if (savedIds.has(key)) {
        await api.delete(`/favourites/${encodeURIComponent(key)}`);
        next.delete(key);
      } else {
        await api.post("/favourites", { article_id: key });
        next.add(key);
      }
      setSavedIds(next);
    } catch {
      setError("Could not update your saved articles. Please try again.");
    }
  };

  const [featured, firstSide, secondSide, ...moreArticles] = visibleArticles;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeCategory={category} onCategoryChange={setCategory} onSearch={setQuery} />
      <main className="flex-1" style={{ paddingTop: 118, paddingBottom: 82 }}>
        <section className="page-shell" style={{ maxWidth: 1540 }}>
          <p
            style={{
              color: "#0000cc",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {category} Feed
          </p>
          <h1
            className="font-newsreader"
            style={{ maxWidth: 650, fontSize: 48, lineHeight: "58px", fontWeight: 700, color: "#101828" }}
          >
            The latest breakthroughs in tech, AI, and digital culture.
          </h1>

          {error && (
            <p style={{ marginTop: 18, color: "#464553", fontSize: 14 }}>{error}</p>
          )}

          <div
            className="saved-layout grid gap-6"
            style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 0.96fr)", marginTop: 34 }}
          >
            <FeaturedCard
              article={featured}
              showSave={Boolean(user)}
              isSaved={savedIds.has(getArticleKey(featured))}
              onSave={saveArticle}
            />
            <aside className="grid gap-6" style={{ alignContent: "start" }}>
              {[firstSide, secondSide].map((article, index) => (
                <SidebarCard
                  key={getArticleKey(article)}
                  article={article}
                  index={index + 1}
                  showSave={Boolean(user)}
                  isSaved={savedIds.has(getArticleKey(article))}
                  onSave={saveArticle}
                />
              ))}
            </aside>
          </div>

          <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 28 }}>
            {moreArticles.slice(0, 3).map((article, index) => (
              <ArticleCard
                key={getArticleKey(article)}
                article={article}
                index={index + 3}
                showSave={Boolean(user)}
                isSaved={savedIds.has(getArticleKey(article))}
                onSave={saveArticle}
              />
            ))}
          </div>

          <div className="flex justify-center" style={{ marginTop: 80 }}>
            <button
              type="button"
              style={{
                width: 330,
                height: 72,
                border: "1px solid #090f20",
                borderRadius: 8,
                background: "#11182c",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Older Articles
              <span className="material-symbols-outlined" style={{ marginLeft: 12, fontSize: 20, verticalAlign: "middle" }}>
                expand_more
              </span>
            </button>
          </div>

          {loading && (
            <div aria-hidden="true" style={{ marginTop: 20, textAlign: "center", color: "#464553", fontSize: 13 }}>
              Refreshing feed...
            </div>
          )}
        </section>
      </main>
      <Footer />
      <style jsx>{`
        @media (max-width: 900px) {
    .saved-layout {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 38px !important;
      line-height: 46px !important;
    }
  }

  @media (max-width: 640px) {
    main {
      padding-top: 40px !important;
      padding-bottom: 40px !important;
    }

    .news-card {
      min-height: auto !important;
    }

    article div[style*="padding: 46px 48px"] {
      padding: 24px !important;
    }

    h2 {
      font-size: 28px !important;
      line-height: 36px !important;
    }

    h3 {
      font-size: 20px !important;
      line-height: 28px !important;
    }
  }
      `}</style>
    </div>
  );
}
