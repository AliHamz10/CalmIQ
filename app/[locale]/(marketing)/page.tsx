import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeRoutinesTeaser } from "@/components/routines/home-routines-teaser";
import { HomeComfortTeaser } from "@/components/comfort/home-comfort-teaser";
import { PhysioDirectory } from "@/components/marketing/physio-directory";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <HomeRoutinesTeaser />
      <HomeComfortTeaser />
      <PhysioDirectory />
    </>
  );
}
