import { valid } from "node-html-parser";
import { asJson } from "utils/proxy/api-helpers";
import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/v1/{endpoint}",
  proxyHandler: credentialedProxyHandler,
  mappings: {
    workflows: {
      endpoint: "workflows",
      validate: ["data"],
    },
    executions: {
      endpoint: "executions",
      validate: ["data"],
    },
  },
};

export default widget;
