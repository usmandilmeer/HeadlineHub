"use client";

/* eslint-disable @next/next/no-img-element */

import { Article } from "@/types";
import { formatRelativePublished, getArticleImage, getArticleSource } from "@/lib/articles";

interface FeaturedCardProps {
  article: Article;
  showSave?: boolean;
  isSaved?: boolean;
  onSave?: (article: Article) => void;
}

export default function FeaturedCard({ article, showSave = false, isSaved = false, onSave }: FeaturedCardProps) {
  return (
    <article className="news-card">
      <a href={article.url || "#"} target="_blank" rel="noreferrer">
        <div style={{ aspectRatio: "1.78 / 1", minHeight: 280 }}>
          <img
            className="article-image"
            src={getArticleImage(article, 0)}
            alt=""
            onError={(event) => {
              event.currentTarget.src = getArticleImage({ ...article, image_url: null }, 0);
            }}
          />
        </div>
      </a>
      <div style={{ padding: "24px 26px 28px" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="chip" style={{ padding: "6px 14px" }}>
              {getArticleSource(article)}
            </span>
            <div className="flex items-center gap-1" style={{ marginTop: 7, color: "#464553", fontSize: 13 }}>
              <span className="clock-glyph" aria-hidden="true" />
              <span>{formatRelativePublished(article.published_at)}</span>
            </div>
          </div>
          {showSave && (
            <button className="save-pill" onClick={() => onSave?.(article)} type="button">
              <span className="bookmark-glyph" aria-hidden="true" />
              {isSaved ? "Saved" : "Save Article"}
            </button>
          )}
        </div>
        <a href={article.url || "#"} target="_blank" rel="noreferrer">
          <h2 className="font-newsreader" style={{ marginTop: 16, fontSize: 32, lineHeight: "38px", fontWeight: 600 }}>
            {article.title}
          </h2>
        </a>
        {article.description && (
          <p style={{ marginTop: 18, color: "#283044", fontSize: 16, lineHeight: "26px" }}>{article.description}</p>
        )}
      </div>
    </article>
  );
}
