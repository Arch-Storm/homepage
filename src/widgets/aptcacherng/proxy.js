import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import createLogger from "utils/logger";
import { parse } from 'node-html-parser';
import widgets from "widgets/widgets";
import getServiceWidget from "utils/config/service-helpers";

const logger = createLogger("aptcacherngProxyHandler");

export default async function aptcacherngProxyHandler(req, res) {
  const { group, service, index } = req.query;

  if (!group || !service) {
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service, index);
  const api = widgets?.[widget.type]?.api;
  if (!api) {
    return res.status(403).json({ error: "Service does not support API calls" });
  }

  const url = formatApiCall(api, widget);
  const [status, _, data] = await httpProxy(url);

  if (status !== 200) {
    logger.debug("Error %d calling apt-cacher-ng endpoint %s", status, url);
    return res.status(status).json({ error: { message: `HTTP Error ${status}`, url, data } });
  }

  try {
    const root = parse(data.toString());
    const html = root.querySelector('html');
    const table = html.querySelector('table');
    const stats = table.querySelectorAll('.colcont');

    if (stats.length !== 4) {
      throw new Error('Could not find expected statistics');
    }

    const response = {
      fetchedOverall: stats[0].innerText.trim(),
      fetchedRecently: stats[1].innerText.trim(),
      servedOverall: stats[2].innerText.trim(),
      servedRecently: stats[3].innerText.trim(),
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error("Error parsing apt-cacher-ng response", error);
    return res.status(500).json({ error: { message: "Failed to parse response", url } });
  }
}
