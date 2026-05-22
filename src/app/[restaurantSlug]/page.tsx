import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/modules/restaurants/restaurants.service";

export default async function MenuPage({
	params,
}: {
	params: Promise<{ restaurantSlug: string }>;
}) {
	const { restaurantSlug } = await params;
	const restaurant = await getRestaurantBySlug(restaurantSlug);

	if (!restaurant) notFound();

	return (
		<div style={restaurant.theme as React.CSSProperties}>
			<main className="mx-auto min-h-screen max-w-3xl bg-[var(--bg-base,#ffffff)] px-4 py-8">
				{restaurant.heroImageUrl && (
					<div className="mb-6 overflow-hidden rounded-2xl">
						<img
							src={restaurant.heroImageUrl}
							alt={restaurant.name}
							className="h-48 w-full object-cover sm:h-64"
						/>
					</div>
				)}

				<div className="mb-8 flex items-center gap-4">
					{restaurant.logoUrl && (
						<img
							src={restaurant.logoUrl}
							alt=""
							className="h-16 w-16 rounded-xl object-cover"
						/>
					)}
					<div>
						<h1 className="text-3xl font-bold text-[var(--text-primary,#111827)]">
							{restaurant.name}
						</h1>
						{restaurant.brandText && (
							<p className="mt-1 text-sm text-[var(--text-secondary,#6b7280)]">
								{restaurant.brandText}
							</p>
						)}
					</div>
				</div>

				{restaurant.description && (
					<p className="mb-8 text-[var(--text-secondary,#6b7280)]">
						{restaurant.description}
					</p>
				)}

				{restaurant.categories.map((category) => (
					<section key={category.id} className="mb-8">
						<h2 className="mb-4 border-b border-[var(--border,#e5e7eb)] pb-2 text-xl font-semibold text-[var(--text-primary,#111827)]">
							{category.name}
						</h2>
						<div className="grid gap-3 sm:grid-cols-2">
							{category.products.map((product) => (
								<div
									key={product.id}
									className={`rounded-xl border border-[var(--border,#e5e7eb)] bg-[var(--bg-card,#ffffff)] p-4 ${
										!product.available ? "opacity-50" : ""
									}`}
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<h3 className="font-medium text-[var(--text-primary,#111827)]">
												{product.name}
												{!product.available && (
													<span className="mr-2 text-xs text-red-400">
														(ناموجود)
													</span>
												)}
											</h3>
											{product.description && (
												<p className="mt-1 text-sm text-[var(--text-secondary,#6b7280)]">
													{product.description}
												</p>
											)}
										</div>
										{product.imageUrl && (
											<img
												src={product.imageUrl}
												alt=""
												className="h-16 w-16 rounded-lg object-cover"
											/>
										)}
									</div>
									<div className="mt-2 font-semibold text-[var(--text-accent,#2563eb)]">
										{formatPrice(product.price)}
									</div>
								</div>
							))}
						</div>
					</section>
				))}

				{restaurant.categories.length === 0 && (
					<p className="text-center text-gray-400">منو به زودی...</p>
				)}
			</main>
		</div>
	);
}

function formatPrice(toman: number) {
	return new Intl.NumberFormat("fa-IR").format(toman) + " تومان";
}
