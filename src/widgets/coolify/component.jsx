import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: projectsData } = useWidgetAPI(widget, "projects");
  const { data: databasesData } = useWidgetAPI(widget, "databases");
  const { data: applicationsData } = useWidgetAPI(widget, "applications");

  if (!projectsData || !databasesData || !applicationsData) {
    return (
      <Container service={service}>
        <Block label="coolify.projects" />
        <Block label="coolify.applications" />
        <Block label="coolify.databases" />
      </Container>
    );
  }

  const stats = {
    projects: projectsData.length,
    databases: databasesData.length,
    applications: applicationsData.length,
  };

  return (
    <Container service={service}>
      <Block label="coolify.projects" value={t("common.number", { value: stats.projects })} />
      <Block label="coolify.applications" value={t("common.number", { value: stats.applications })} />
      <Block label="coolify.databases" value={t("common.number", { value: stats.databases })} />
    </Container>
  );
}
