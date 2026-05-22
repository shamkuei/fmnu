"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	requestOtpAction,
	checkCodeAction,
	otpLoginAction,
} from "@/actions/auth";

export default function LoginPage() {
	const router = useRouter();
	const [step, setStep] = useState<"phone" | "code">("phone");
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [codeValid, setCodeValid] = useState<boolean | null>(null);

	async function handleRequestOtp(e: React.FormEvent) {
		e.preventDefault();
		if (!phone.trim()) return;
		setLoading(true);
		setError("");

		try {
			await requestOtpAction(phone);
			setStep("code");
		} catch (err: any) {
			setError(err?.message ?? "ارسال کد ناموفق بود");
		} finally {
			setLoading(false);
		}
	}

	async function handleCheckCode(value: string) {
		if (value.length === 6) {
			try {
				const result = await checkCodeAction(phone, value);
				setCodeValid((result as any).valid);
			} catch {
				setCodeValid(false);
			}
		} else {
			setCodeValid(null);
		}
	}

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		if (code.length !== 6) return;
		setLoading(true);
		setError("");

		try {
			await otpLoginAction(phone, code);
			router.push("/admin");
		} catch (err: any) {
			setError(err?.message ?? "ورود ناموفق بود");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[var(--bg-base, #f8fafc)] p-4">
			<div className="w-full max-w-sm rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-8 shadow-lg">
				<h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
					{step === "phone" ? "ورود" : "کد تأیید"}
				</h1>

				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
						{error}
					</div>
				)}

				{step === "phone" ? (
					<form onSubmit={handleRequestOtp} className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								شماره موبایل
							</label>
							<input
								type="tel"
								dir="ltr"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="09121234567"
								className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
						<button
							type="submit"
							disabled={loading || !phone.trim()}
							className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? "در حال ارسال..." : "ارسال کد"}
						</button>
					</form>
				) : (
					<form onSubmit={handleLogin} className="space-y-4">
						<p className="text-center text-sm text-gray-500">
							کد ارسال شده به{" "}
							<span dir="ltr" className="font-mono text-gray-700">
								{phone}
							</span>
						</p>
						<div>
							<input
								type="text"
								dir="ltr"
								inputMode="numeric"
								maxLength={6}
								value={code}
								onChange={(e) => {
									const val = e.target.value.replace(/\D/g, "").slice(0, 6);
									setCode(val);
									handleCheckCode(val);
								}}
								placeholder="000000"
								className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
							{codeValid === true && (
								<p className="mt-1 text-center text-sm text-green-600">
									کد صحیح است
								</p>
							)}
							{codeValid === false && (
								<p className="mt-1 text-center text-sm text-red-500">
									کد نادرست است
								</p>
							)}
						</div>
						<button
							type="submit"
							disabled={loading || code.length !== 6}
							className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? "در حال بررسی..." : "ورود"}
						</button>
						<button
							type="button"
							onClick={() => setStep("phone")}
							className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
						>
							تغییر شماره موبایل
						</button>
					</form>
				)}
			</div>
		</main>
	);
}
