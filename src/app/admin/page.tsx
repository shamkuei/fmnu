import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { getMyRestaurantsAction } from "@/actions/restaurants";

export default async function AdminDashboard() {
	const user = await getMeAction();
	if (!user) redirect("/auth/login");

	const restaurants = await getMyRestaurantsAction();

	return (
		<main className="mx-auto max-w-4xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
				<p className="text-sm text-gray-500">
					<span dir="ltr">{(user as any).phone}</span>
				</p>
			</div>

			<div className="mb-6">
				<h2 className="mb-3 text-lg font-semibold text-gray-800">
					رستوران‌های من
				</h2>
				{restaurants.length === 0 && (
					<p className="text-gray-400">هنوز رستورانی ثبت نشده.</p>
				)}
				<div className="grid gap-3 sm:grid-cols-2">
					{restaurants.map((ra: any) => (
						<a
							key={ra.restaurant.id}
							href={`/admin/${ra.restaurant.id}`}
							className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
						>
							<h3 className="font-semibold text-gray-900">
								{ra.restaurant.name}
							</h3>
							<p dir="ltr" className="mt-1 font-mono text-sm text-gray-400">
								{ra.restaurant.slug}.fmnu.ir
							</p>
						</a>
					))}
				</div>
			</div>
		</main>
	);
}
