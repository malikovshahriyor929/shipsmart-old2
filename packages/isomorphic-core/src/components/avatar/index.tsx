import { Avatar as RizzuiAvatar, type AvatarProps } from "rizzui";
import cn from "@core/utils/class-names";

type GradientOption = {
  gradientClass: string;
  ringClass: string;
};

const gradientPalette: GradientOption[] = [
  {
    gradientClass: "!bg-[linear-gradient(180deg,_#134074_0%,_#2478da_100%)]",
    ringClass: "!ring-[#2478da]",
  },
  {
    gradientClass: "!bg-[linear-gradient(180deg,_#4fe9d3_0%,_#29c9b7_100%)]",
    ringClass: "!ring-[#29c9b7]",
  },
  {
    gradientClass: "!bg-[linear-gradient(180deg,_#80a9ff_0%,_#665fff_100%)]",
    ringClass: "!ring-[#665fff]",
  },
  {
    gradientClass: "!bg-[linear-gradient(180deg,_#70d3fc_0%,_#2a9ef1_100%)]",
    ringClass: "!ring-[#2a9ef1]",
  },
  {
    gradientClass: "!bg-[linear-gradient(180deg,_#df9cf2_0%,_#d669ed_100%)]",
    ringClass: "!ring-[#d669ed]",
  },
];

function pickGradient(name: string) {
  const firstChar = name?.trim()?.[0];

  if (!firstChar) return gradientPalette[0];

  const index = firstChar.toUpperCase().charCodeAt(0) - 65;

  if (index >= 0 && index < 26) {
    return gradientPalette[index % gradientPalette.length];
  }

  return gradientPalette[firstChar.charCodeAt(0) % gradientPalette.length];
}

type GradientAvatarProps = AvatarProps & {
  fallbackSrc?: string;
};

export default function Avatar({
  name,
  src,
  className,
  fallbackSrc,
  rounded = "full",
  ...rest
}: GradientAvatarProps) {
  const { gradientClass, ringClass } = pickGradient(name);
  const avatarSrc = src ?? fallbackSrc;

  return (
    <div>
      <RizzuiAvatar
        {...rest}
        rounded={rounded}
        name={name}
        src={avatarSrc}
        className={cn(
          "text-white  border border-white ring-1 ",
          gradientClass,
          ringClass,
          className,
        )}
      />
    </div>
  );
}
