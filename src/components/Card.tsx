import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";

import { Post } from "../types/Post";

type PtPostWithImage = Post & {
  featuredImg: any;
};

export const Card = ({ post }: { post: PtPostWithImage }) => {
  const postLink = post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`;

  return (
    <div className="max-w-[500px] mb-16 lg:mx-6 lg:w-[calc(33.33%-48px)] lg:mb-9">
      <div className="mb-4 h-[220px] rounded-lg overflow-hidden relative">
        <Link to={postLink}>
          <div className="w-full absolute left-0 right-0 top-1/2 -translate-y-1/2">
            <Img fluid={post.featuredImg.childImageSharp.fluid} />
          </div>
        </Link>
      </div>
      <div>
        <h4 className="text-[18px] mb-3 lg:mt-3">
          <Link to={postLink} className="text-white hover:text-white hover:no-underline">{post.title}</Link>
        </h4>
        <p className="mt-3 mb-[0.5em] text-[#b3b3b3] lg:mb-3">{post.summary}</p>
        <div className="text-[12px]">
          {post.date ? <span className="text-[#868f97]">{post.date}</span> : null}
          {post.cowriter ? <span className="text-[#868f97]"> • {post.cowriter}</span> : null}
        </div>
      </div>
    </div>
  );
};
