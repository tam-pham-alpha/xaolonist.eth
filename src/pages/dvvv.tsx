import React from "react";
import styled from "styled-components";

import { Card } from "../components/Card";
import { Container } from "../components/Grid";
import { Layout } from "../components/Layout";
import { HeadFC, graphql } from "gatsby";
import { SEO } from "../components/SEO";

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
`;

const ScMain = styled.div`
  margin-top: 3rem;
  margin-bottom: 5rem;

  @media screen and (min-width: 992px) {
    margin-top: 3rem;
    margin-bottom: 10rem;
  }
`;

const ScPostList = styled.div`
  @media screen and (min-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    margin-left: -24px;
    margin-right: -24px;
  }
`;

const ScTitle = styled.h1`
  color: var(--text-color);
  font-size: 1.8rem;
  margin-bottom: 1.5em;
  text-align: center;
  font-weight: 400;

  @media screen and (min-width: 992px) {
    font-size: 2rem;
  }
`;

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
            category
            date
            summary
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

const Anh4gsPage = ({ data }: any) => {
  console.log("data", data);

  const posts: any[] = data.allMarkdownRemark.edges
    .map(({ node }: any) => {
      const fm = node.frontmatter;
      return {
        ...node,
        slug: fm.slug,
        title: fm.title,
        status: fm.status || "published",
        author: fm.author || "anh4gs",
        category: fm.category || "blog",
        date: fm.date || "",
        summary: fm.summary || "",
        cover:
          fm.cover?.childImageSharp?.fluid?.src ||
          "/images/anh4gs-social.jpg",
        featuredImg: fm.cover,
        markdown: true,
      };
    })
    .filter((i: any) => i.status === "published" && i.category === "anh4gs");

  return (
    <Layout blur={false}>
      <ScRoot>
        <Container>
          <ScMain>
            <ScTitle>đêm về viết văn</ScTitle>
            <ScPostList>
              {posts.map((i) => (
                <Card key={i.id} post={i} />
              ))}
            </ScPostList>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export const Head: HeadFC = () => (
  <SEO
    title="đêm về viết văn"
    desc="đêm về viết văn"
    url="https://anh4gs.xyz/anh4gs"
  />
);

export default Anh4gsPage;
