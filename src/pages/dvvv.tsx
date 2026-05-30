import React from "react";

import { Card } from "../components/Card";
import { Container } from "../components/Grid";
import { Layout } from "../components/Layout";
import { HeadFC, graphql } from "gatsby";
import { SEO } from "../components/SEO";

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 1000
    ) {
      edges {
        node {
          frontmatter {
            slug
            status
            title
            author
            cowriter
            category
            date(formatString: "MMMM D, YYYY")
            summary
            lang
            cover {
              childImageSharp {
                fluid(maxWidth: 800, quality: 80) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  srcWebp
                  srcSetWebp
                  sizes
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Anh4gsPage = ({ data, location }: any) => {
  console.log("data", data);

  const isEn = location?.pathname?.startsWith("/en") || false;
  const targetLang = isEn ? "en" : "vn";

  const posts: any[] = data.allMarkdownRemark.edges
    .map(({ node }: any) => {
      const fm = node.frontmatter;
      return {
        ...node,
        slug: fm.slug,
        title: fm.title,
        status: fm.status || "published",
        author: fm.author || "anh4gs",
        cowriter: fm.cowriter || "",
        category: fm.category || "blog",
        date: fm.date || "",
        summary: fm.summary || "",
        lang: fm.lang || "vn",
        cover:
          fm.cover?.childImageSharp?.fluid?.src ||
          "/images/anh4gs-social.jpg",
        featuredImg: fm.cover,
        markdown: true,
      };
    })
    .filter((i: any) => i.status === "published" && i.category === "anh4gs" && i.lang === targetLang);

  return (
    <Layout blur={false} lang={isEn ? "en" : "vn"}>
      <div className="bg-darkmode pt-[1px]">
        <Container>
          <div className="mt-12 mb-20 lg:mt-12 lg:mb-40">
            <h1 className="text-textColor text-[1.8rem] mb-[1.5em] text-center font-normal lg:text-[2rem]">
              {isEn ? "writing prose by night" : "đêm về viết văn"}
            </h1>
            <div className="lg:flex lg:flex-wrap lg:-mx-6">
              {posts.map((i) => (
                <Card key={i.id} post={i} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export const Head = ({ location }: any) => {
  const isEn = location?.pathname?.startsWith("/en") || false;
  return (
    <SEO
      title={isEn ? "writing prose by night" : "đêm về viết văn"}
      desc={isEn ? "writing prose by night" : "đêm về viết văn"}
      url={isEn ? "https://anh4gs.xyz/en/dvvv" : "https://anh4gs.xyz/dvvv"}
    />
  );
};

export default Anh4gsPage;

