import Image from 'next/image';

export default function ShipSmartAuthVisual() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#1d69a8]">
      <Image
        src="/shipsmart-landing/main-bg.svg"
        alt="ShipSmart freight truck in transit"
        fill
        priority
        unoptimized
        sizes="(max-width: 1024px) 0px, 60vw"
        className="object-cover object-center"
      />
    </div>
  );
}
