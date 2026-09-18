import { notFound } from 'next/navigation';
import { DetailPage, getItem, landingSections } from '../../ship-smart-content';

export function generateStaticParams() {
  return landingSections.flatMap((section) =>
    section.items.map((item) => ({
      section: section.slug,
      slug: item.slug,
    }))
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section: sectionSlug, slug } = await params;
  const { section, item } = getItem(sectionSlug, slug);

  if (!section || !item) {
    notFound();
  }

  return <DetailPage section={section} item={item} />;
}
