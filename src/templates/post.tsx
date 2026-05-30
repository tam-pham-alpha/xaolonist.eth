import React from "react";
import Img from "gatsby-image";

import { Container } from "../components/Grid";
import { Layout } from "../components/Layout";
import { SEO } from "../components/SEO";

const PostTemplate = ({ pageContext: context }: any) => {
  const post = context.post;

  return (
    <Layout blur={true} lang={post.lang}>
      <div className="bg-darkmode">
        <Container>
          <div className="mt-8 mb-16 relative lg:mt-[80px] lg:mb-40">
            <div className="max-w-[760px] mx-auto mb-12">
              <h1 className="max-w-[760px] mx-auto text-2xl leading-tight mb-3 lg:text-[40px] font-bold">
                {post.title}
              </h1>
              <div className="text-[14px] text-[#868f97] max-w-[760px] mx-auto">
                {post.date}
                {post.cowriter ? ` • ${post.cowriter}` : null}
              </div>
            </div>

            {post.featuredImg?.childImageSharp?.fluid && (
              <div className="mb-12 text-center max-w-[960px] mx-auto">
                <Img
                  fluid={post.featuredImg.childImageSharp.fluid}
                  alt={post.title}
                />
              </div>
            )}

            <section className="text-[17px] text-[rgba(255,255,255,0.8)] leading-[1.5] max-w-[760px] mx-auto markdown-content">
              <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </section>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export const Head = ({ pageContext: context }: any) => {
  const post = context.post;
  const url = "https://anh4gs.xyz";
  const link = post.lang === "en" ? `${url}/en/blog/${post.slug}/` : `${url}/blog/${post.slug}/`;
  const cover = `${url}${post.cover}`;
  const title = post.title;
  const desc = post.summary;

  return (
    <SEO
      title={title}
      cover={cover}
      desc={desc}
      url={link}
      type="article"
      publishedTime={post.date}
      author="anh4gs"
    />
  );
};

export default PostTemplate;

