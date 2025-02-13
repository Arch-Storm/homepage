import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/v1/{endpoint}",
  proxyHandler: credentialedProxyHandler,
  mappings: {
    applications: {
      endpoint: "applications",
    },
    databases: {
      endpoint: "databases",
    },
    projects: {
      endpoint: "projects",
    },
  },
};

export default widget;
