import Image from "next/image";

type MenuHeaderProps = {
  name: string;
  brandText: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
};

export function MenuHeader({
  name,
  brandText,
  logoUrl,
  heroImageUrl,
}: MenuHeaderProps) {
  if (heroImageUrl) {
    return (
      <div className="relative h-56 overflow-hidden sm:h-72">
        <Image
          src={heroImageUrl}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-6">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt=""
                width={56}
                height={56}
                className="rounded-xl border-2 border-white/30 object-cover shadow-lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-sm sm:text-3xl">
                {name}
              </h1>
              {brandText && (
                <p className="mt-0.5 text-sm text-white/80">{brandText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-6">
      <div className="flex items-center gap-4">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-xl object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{name}</h1>
          {brandText && (
            <p className="mt-1 text-sm text-muted-foreground">{brandText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
