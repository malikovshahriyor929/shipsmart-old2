import Image from 'next/image';

const LANDING_ASSET_ROOT = '/shipsmart-landing';

export function LandingBrandMark({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex items-center" aria-label="ShipSmart Solutions">
      <Image
        src={`${LANDING_ASSET_ROOT}/${inverse ? 'logo.png' : 'logo.svg'}`}
        alt="ShipSmart Solutions"
        width={311}
        height={69}
        unoptimized
        className={`h-auto w-auto ${
          compact
            ? 'max-w-[150px] sm:max-w-[185px] xl:max-w-[220px]'
            : 'max-w-[220px]'
        }`}
      />
    </span>
  );
}
