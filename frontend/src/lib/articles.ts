import { Article } from "@/types";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=85",
];

export function getArticleImage(article: Article, index = 0) {
  return article.image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export function getArticleSource(article: Article) {
  return article.source || article.category || "HeadlineHub";
}

export function getArticleKey(article: Article) {
  return article.article_id || String(article.id || article.url || article.title);
}

export function formatArticleDate(date: string | null | undefined) {
  if (!date) return "Oct 24, 2024 • 4h ago";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Oct 24, 2024 • 4h ago";

  return `${parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} • ${relativeTime(parsed)}`;
}

export function formatRelativePublished(date: string | null | undefined) {
  if (!date) return "Published 2 hours ago";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Published 2 hours ago";
  return `Published ${relativeTime(parsed)}`;
}

export function relativeTime(date: Date) {
  const delta = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(delta / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} months ago`;
}

export function readingTime(article: Article) {
  const words = `${article.title} ${article.description || ""}`.split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 35))} min read`;
}
