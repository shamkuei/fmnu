export default function LandingPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
			<div className="text-center">
				<h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					فستمنو
				</h1>
				<p className="mb-8 max-w-md text-lg text-gray-500">
					منوی آنلاین رستورانت رو تو چند دقیقه بساز.
					با یه QR کد مشتری‌هات راحت منو رو ببینن.
				</p>
				<div className="flex justify-center gap-3">
					<a
						href="/auth/login"
						className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
					>
						ورود
					</a>
				</div>
			</div>
		</main>
	);
}
