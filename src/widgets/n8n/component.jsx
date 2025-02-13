import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: workflowsData } = useWidgetAPI(widget, "workflows");
  const { data: executionsData } = useWidgetAPI(widget, "executions");

  if (!workflowsData || !executionsData) {
    return (
      <Container service={service}>
        <Block label="n8n.workflows" />
        <Block label="n8n.executions" />
      </Container>
    );
  }

  const stats = {
    workflows: workflowsData.data.length,
    executions: executionsData.data.length,
  };

  return (
    <Container service={service}>
      <Block label="n8n.workflows" value={t("common.number", { value: stats.workflows })} />
      <Block label="n8n.executions" value={t("common.number", { value: stats.executions })} />
    </Container>
  );
}
