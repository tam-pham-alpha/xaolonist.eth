import type { GatsbyConfig } from "gatsby";

const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;

const config: GatsbyConfig = {
  siteMetadata: {
    title: `gatsby notion`,
    siteUrl: `https://anh4gs.xyz/`,
  },

  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-source-notion-api",
      options: {
        token: NOTION_TOKEN,
        databaseId: NOTION_DATABASE_ID,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images-anywhere",
            options: {
              backgroundColor: "transparent",
              formats: ["auto", "jpg", "png"],
              quality: 80,
              withWebp: false,
              withAvif: false,
            },
          },
        ],
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-PVCZMHD",
        includeInDevelopment: true,
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "static/images/icon.png",
      },
    },
    // "gatsby-plugin-mdx",
    {
      resolve: "gatsby-plugin-sharp",
      options: {
        defaults: {
          formats: ["auto", "jpg", "png"],
          placeholder: "blurred",
          quality: 80,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: "transparent",
        },
        // Disable WebP for social sharing images
        forceBase64Format: "jpg",
        useMozJpeg: true,
        stripMetadata: true,
        defaultQuality: 80,
      },
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};

export default config;
