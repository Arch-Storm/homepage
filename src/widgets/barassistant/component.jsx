import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

const MAX_ALLOWED_FIELDS = 4;

export const barassistantDefaultFields = [
  "total_shelf_cocktails",
  "total_shelf_ingredients",
  "total_bar_shelf_ingredients",
  "total_bar_shelf_cocktails",
];

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: statsData, error: statsError } = useWidgetAPI(widget, "stats");

  // Default fields
  if (!widget.fields?.length > 0) {
    widget.fields = barassistantDefaultFields;
  }

  // Limits max number of displayed fields
  if (widget.fields?.length > MAX_ALLOWED_FIELDS) {
    widget.fields = widget.fields.slice(0, MAX_ALLOWED_FIELDS);
  }

  if (statsError) {
    return <Container service={service} error={statsError} />;
  }

  if (!statsData) {
    return (
      <Container service={service}>
        <Block label="barassistant.total_cocktails" />
        <Block label="barassistant.total_ingredients" />
        <Block label="barassistant.total_favorited_cocktails" />
        <Block label="barassistant.total_shelf_cocktails" />
        <Block label="barassistant.total_shelf_ingredients" />
        <Block label="barassistant.total_bar_shelf_ingredients" />
        <Block label="barassistant.total_bar_shelf_cocktails" />
        <Block label="barassistant.total_bar_members" />
        <Block label="barassistant.total_collections" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      {widget.fields.map((field) => (
        <Block key={field} label={`barassistant.${field}`} value={t("common.number", { value: statsData[field] })} />
      ))}
    </Container>
  );
}
