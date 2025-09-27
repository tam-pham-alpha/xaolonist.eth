import React from "react";

export const SEO = ({
  children,
  cover,
  url,
  title,
  desc,
  type = "website",
  publishedTime,
  author,
}: {
  children?: React.ReactNode;
  cover?: string;
  url?: string;
  title?: string;
  desc?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
}) => {
  const displayedTitle = title || "anh4gs";
  const displayedUrl = url || "https://anh4gs.xyz";
  const displayedDesc =
    desc || "he is a scientist, an anthropologist, a psychologist...";
  const displayedCover = cover || `https://anh4gs.xyz/images/anh4gs-social.jpg`;

  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <title>{displayedTitle}</title>

      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="description" content={displayedDesc} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="anh4gs" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:title" content={displayedTitle} />
      <meta property="og:description" content={displayedDesc} />
      <meta property="og:url" content={displayedUrl} />
      <meta property="og:image" content={displayedCover} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={displayedTitle} />
      
      {/* Article specific tags for blog posts */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@anh4gs" />
      <meta name="twitter:creator" content="@anh4gs" />
      <meta name="twitter:title" content={displayedTitle} />
      <meta name="twitter:description" content={displayedDesc} />
      <meta name="twitter:url" content={displayedUrl} />
      <meta name="twitter:image" content={displayedCover} />
      <meta name="twitter:image:alt" content={displayedTitle} />

      {/* LinkedIn specific optimizations */}
      <meta property="og:updated_time" content={publishedTime || new Date().toISOString()} />

      {children ? children : null}
    </>
  );
};
