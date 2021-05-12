const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const URL_PATH = {
  landing: "/",
};

const templates = {
  landing: path.resolve("src/templates/landing/Landing.js"),
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "pages" });
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: URL_PATH.landing,
    component: templates.landing,
    context: {},
  });
};
