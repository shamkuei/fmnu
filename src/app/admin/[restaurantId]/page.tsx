import { notFound } from "next/navigation";
import { db } from "@/db/index";

export default async function RestaurantEditor({
	params,
}: {
	params: Promise<{ restaurantId: string }>;
}) {
	const { restaurantId } = await params;
	const restaurant = await db.query.restaurants.findFirst({
		where: { id: restaurantId },
	});

	if (!restaurant) notFound();

	return (
		<main className="mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">
					{restaurant.name}
				</h1>
				<a
					href={`/admin/${restaurant.id}/menu`}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
				>
					مدیریت منو
				</a>
			</div>

			<div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">نام</label>
						<p className="text-gray-900">{restaurant.name}</p>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">آدرس زیردامنه</label>
						<p dir="ltr" className="font-mono text-sm text-gray-500">
							{restaurant.slug}.fmnu.ir
						</p>
					</div>
				</div>

				{restaurant.description && (
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">توضیحات</label>
						<p className="text-gray-700">{restaurant.description}</p>
					</div>
				)}

				{restaurant.brandText && (
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">متن برند</label>
						<p className="text-gray-700">{restaurant.brandText}</p>
					</div>
				)}

				{restaurant.theme && (
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">تم (متغیرهای CSS)</label>
						<pre dir="ltr" className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-700">
							{JSON.stringify(restaurant.theme, null, 2)}
						</pre>
					</div>
				)}

				{restaurant.logoUrl && (
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">لوگو</label>
						<img src={restaurant.logoUrl} alt="لوگو" className="h-20 w-20 rounded-lg object-cover" />
					</div>
				)}

				{restaurant.heroImageUrl && (
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">تصویر اصلی</label>
						<img src={restaurant.heroImageUrl} alt="تصویر اصلی" className="h-32 w-full rounded-lg object-cover" />
					</div>
				)}

				<div className="pt-2">
					<a
						href={`/${restaurant.slug}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-blue-600 hover:underline"
					>
						مشاهده منوی عمومی &larr;
					</a>
				</div>
			</div>
		</main>
	);
}
