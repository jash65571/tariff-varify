import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = 24,
  showText = true,
  href = "/",
  className,
}: {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Image
        src="/apple-touch-icon.png"
        alt="TariffVerify"
        width={size}
        height={size}
        className="shrink-0"
      />
      {showText && (
        <span className="text-base font-semibold tracking-tight">
          TariffVerify
        </span>
      )}
    </Link>
  );
}
