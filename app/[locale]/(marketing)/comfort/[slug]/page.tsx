import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  COMFORT_SLUGS,
  getComfortGuide,
  isComfortSlug,
} from "@/lib/comfort";
import { ComfortGuidePlayer } from "@/components/comfort/comfort-guide";

export function generateStaticParams() {
  return COMFORT_SLUGS.map((slug) => ({ slug }));
}

export default async function ComfortGuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isComfortSlug(slug)) {
    notFound();
  }

  const guide = getComfortGuide(slug);
  if (!guide) {
    notFound();
  }

  return <ComfortGuidePlayer guide={guide} />;
}
