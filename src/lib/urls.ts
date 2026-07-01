export function getRestaurantUrl(slug: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "fmnu.ir";
  return `https://${domain}/r/${slug}`;
}
