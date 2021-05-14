const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const URL_PATH = {
  landing: "/",
  userInfo: "/user-info",
  scan: "/scan",
};

const templates = {
  landing: path.resolve("src/templates/landing/Landing.js"),
  userInfo: path.resolve("src/templates/userInfo/userInfo.js"),
  scan: path.resolve("src/templates/scan/Scan.js"),
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

  createPage({
    path: URL_PATH.userInfo,
    component: templates.userInfo,
    context: {},
  });

  createPage({
    path: URL_PATH.scan,
    component: templates.scan,
    context: {},
  });
};
