import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  ROUTINE_SLUGS,
  getRoutine,
  isRoutineSlug,
} from "@/lib/routines";
import { RoutinePlayer } from "@/components/routines/routine-player";

export function generateStaticParams() {
  return ROUTINE_SLUGS.map((slug) => ({ slug }));
}

export default async function RoutinePlayerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isRoutineSlug(slug)) {
    notFound();
  }

  const routine = getRoutine(slug);
  if (!routine) {
    notFound();
  }

  return <RoutinePlayer routine={routine} />;
}
