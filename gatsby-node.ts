import path from "path";

import { Post } from "./src/types/Post";

export const createSchemaCustomization = ({ actions }: any) => {
  const { createTypes } = actions;

  createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
    type MarkdownRemarkFrontmatter {
      slug: String
      title: String
      status: String
      author: String
      cowriter: String
      category: String
      date: Date @dateformat
      summary: String
      lang: String
      cover: File @fileByRelativePath
    }
  `);
};

export const createPages = ({ actions, graphql }: any) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            html
            frontmatter {
              slug
              title
              status
              author
              cowriter
              category
              date(formatString: "MMMM D, YYYY")
              summary
              lang
              cover {
                childImageSharp {
                  fluid(maxWidth: 800, quality: 80, toFormat: JPG) {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
            }
          }
        }
      }
    }
  `).then((result: any) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const allPosts: Post[] = result.data.allMarkdownRemark.edges
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
      .filter((i: any) => i.status === "published");

    return allPosts.forEach((post: Post) => {
      const pagePath = post.lang === "en" ? `en/blog/${post.slug}` : `blog/${post.slug}`;
      createPage({
        path: pagePath,
        component: path.resolve(`./src/templates/post.tsx`),
        context: {
          slug: post.slug,
          post,
        },
      });
    });
  });
};
