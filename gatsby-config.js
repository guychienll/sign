module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `sign`,
        short_name: `sign`,
        start_url: `/`,
        background_color: `#f8f8f8`,
        theme_color: `#f8f8f8`,
        display: `standalone`,
        icon: `src/images/sign.png`, // This path is relative to the root of the site.
        permissions: {
          "audio-capture": {
            description: "Required to capture audio using getUserMedia()",
          },
          "video-capture": {
            description: "Required to capture video using getUserMedia()",
          },
        },
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    `gatsby-plugin-offline`,
  ],
  flags: { DEV_SSR: false },
};
