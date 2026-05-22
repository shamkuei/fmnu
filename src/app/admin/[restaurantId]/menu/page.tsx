import { notFound } from "next/navigation";
import { db } from "@/db/index";

export default async function MenuManager({
	params,
}: {
	params: Promise<{ restaurantId: string }>;
}) {
	const { restaurantId } = await params;
	const restaurant = await db.query.restaurants.findFirst({
		where: { id: restaurantId },
		with: {
			categories: {
				orderBy: (c, { asc }) => [asc(c.sortOrder)],
				with: {
					products: {
						orderBy: (p, { asc }) => [asc(p.sortOrder)],
					},
				},
			},
		},
	});

	if (!restaurant) notFound();

	return (
		<main className="mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6">
				<a
					href={`/admin/${restaurant.id}`}
					className="text-sm text-gray-500 hover:text-gray-700"
				>
					&larr; بازگشت به {restaurant.name}
				</a>
				<h1 className="mt-2 text-2xl font-bold text-gray-900">مدیریت منو</h1>
			</div>

			{restaurant.categories.map((category) => (
				<section key={category.id} className="mb-8">
					<h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
						{category.name}
					</h2>
					<div className="grid gap-2">
						{category.products.map((product) => (
							<div
								key={product.id}
								className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 ${
									!product.available ? "opacity-50" : ""
								}`}
							>
								<div>
									<span className="font-medium text-gray-900">{product.name}</span>
									{!product.available && (
										<span className="mr-2 text-xs text-red-400">(ناموجود)</span>
									)}
								</div>
								<span className="text-sm text-gray-600">
									{product.price.toLocaleString("fa-IR")} تومان
								</span>
							</div>
						))}
						{category.products.length === 0 && (
							<p className="py-2 text-sm text-gray-400">هنوز محصولی اضافه نشده</p>
						)}
					</div>
				</section>
			))}

			{restaurant.categories.length === 0 && (
				<p className="mb-6 text-center text-gray-400">هنوز دسته‌بندی اضافه نشده.</p>
			)}
		</main>
	);
}
