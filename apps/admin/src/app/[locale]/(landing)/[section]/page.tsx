import { notFound } from 'next/navigation';
import { getSection, landingSections, SectionPage } from '../ship-smart-content';

export function generateStaticParams() {
  return landingSections.map((section) => ({ section: section.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionSlug } = await params;
  const section = getSection(sectionSlug);

  if (!section) {
    notFound();
  }

  return <SectionPage section={section} />;
}
