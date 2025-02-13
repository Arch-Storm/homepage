import barassistantProxyHandler from "./proxy";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: barassistantProxyHandler,
  mappings: {
    stats: {
      endpoint: "stats",
      validate: ["data"],
      map: (data) => data.data,
      headers: {
        Accept: "application/json",
      },
    },
  },
};

export default widget;
