import cache from "memory-cache";

import { httpProxy } from "utils/proxy/http";
import { formatApiCall } from "utils/proxy/api-helpers";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import widgets from "widgets/widgets";

const proxyName = "barassistantProxyHandler";
const sessionTokenCacheKey = `${proxyName}__sessionToken`;
const logger = createLogger(proxyName);

async function login(widget, service) {
  const endpoint = "auth/login";
  const api = widgets?.[widget.type]?.api;
  const loginUrl = new URL(formatApiCall(api, { endpoint, ...widget }));
  const loginBody = { email: widget.username, password: widget.password, token_name: `homepage-${new Date().getTime()}` };
  const headers = { "Content-Type": "application/json" };

  const [status, , data] = await httpProxy(loginUrl, {
    method: "POST",
    body: JSON.stringify(loginBody),
    headers,
  });

  if (status !== 200) {
    logger.error("Login failed with status %d", status);
    logger.error("loginUrl: %s", loginUrl);
    logger.error("loginBody: %s", loginBody);
    return { token: false };
  }

  try {
    const { data: { token } } = JSON.parse(data.toString());
    cache.put(`${sessionTokenCacheKey}.${service}`, token);
    return { token };
  } catch (e) {
    logger.error("Unable to login to Bar Assistant API: %s", e);
  }

  return { token: false };
}

async function apiCall(widget, endpoint, service) {
  const key = `${sessionTokenCacheKey}.${service}`;
  const headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${cache.get(key)}`,
  };

  const url = new URL(formatApiCall(widgets[widget.type].api, { endpoint, ...widget }));
  const method = "GET";

  let [status, contentType, data, responseHeaders] = await httpProxy(url, {
    method,
    headers,
  });

  if (status === 401 || status === 403) {
    logger.debug("Bar Assistant API rejected the request, attempting to obtain new token");
    const { token } = await login(widget, service);
    headers.Authorization = `Bearer ${token}`;

    // retry the request with the new token
    [status, contentType, data, responseHeaders] = await httpProxy(url, {
      method,
      headers,
    });
  }

  if (status !== 200) {
    logger.error("Error getting data from Bar Assistant: %s status %d. Data: %s", url, status, data);
    return { status, contentType, data: null, responseHeaders };
  }

  return { status, contentType, data: JSON.parse(data.toString()), responseHeaders };
}

export default async function barassistantProxyHandler(req, res) {
  const { group, service, index } = req.query;

  if (!group || !service) {
    logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service, index);
  if (!widget) {
    logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  if (!cache.get(`${sessionTokenCacheKey}.${service}`)) {
    await login(widget, service);
  }

  const { data: statsData } = await apiCall(widget, `bars/${widget.barid}/stats`, service);

  return res.status(200).send(statsData.data);
}
