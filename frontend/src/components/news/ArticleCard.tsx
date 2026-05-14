"use client";

/* eslint-disable @next/next/no-img-element */

import { Article } from "@/types";
import { formatArticleDate, getArticleImage, getArticleSource } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  index?: number;
  showSave?: boolean;
  isSaved?: boolean;
  onSave?: (article: Article) => void;
}

export default function ArticleCard({
  article,
  index = 0,
  showSave = false,
  isSaved = false,
  onSave,
}: ArticleCardProps) {
  return (
    <article className="news-card">
      <a href={article.url || "#"} target="_blank" rel="noreferrer">
        <div style={{ aspectRatio: "1.34 / 1" }}>
          <img
            className="article-image"
            src={getArticleImage(article, index)}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = getArticleImage({ ...article, image_url: null }, index);
            }}
          />
        </div>
      </a>
      <div style={{ padding: "16px 14px 18px" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div style={{ color: "#1f108e", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
              {getArticleSource(article)}
            </div>
            <div style={{ color: "#464553", fontSize: 12, lineHeight: "16px" }}>
              {formatArticleDate(article.published_at)}
            </div>
          </div>
          {showSave && (
            <button className="save-pill" onClick={() => onSave?.(article)} type="button">
              <span className="bookmark-glyph" aria-hidden="true" />
              {isSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
        <a href={article.url || "#"} target="_blank" rel="noreferrer">
          <h3
            className="font-newsreader"
            style={{ marginTop: 8, fontSize: 20, lineHeight: "25px", fontWeight: 500, color: "#101828" }}
          >
            {article.title}
          </h3>
        </a>
      </div>
    </article>
  );
}
