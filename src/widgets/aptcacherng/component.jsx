import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data, error } = useWidgetAPI(widget);

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="aptcacherng.fetched_overall" />
        <Block label="aptcacherng.served_overall" />
        <Block label="aptcacherng.fetched_recently" />
        <Block label="aptcacherng.served_recently" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="aptcacherng.fetched_overall" value={t("common.number", { value: data.fetchedOverall })} />
      <Block label="aptcacherng.served_overall" value={t("common.number", { value: data.servedOverall })} />
      <Block label="aptcacherng.fetched_recently" value={t("common.number", { value: data.fetchedRecently })} />
      <Block label="aptcacherng.served_recently" value={t("common.number", { value: data.servedRecently })} />
    </Container>
  );
}
