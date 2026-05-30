import React from "react";
import { graphql } from "gatsby";
import IndexPage from "../index";

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

export { Head } from "../index";
export default IndexPage;
