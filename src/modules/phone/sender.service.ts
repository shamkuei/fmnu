export async function sendSMS({ text, to }: { to: string; text: string }) {
	if (process.env.NO_SMS !== "false") {
		console.info(
			`[sms] to: ${to}, content:\n${text}`,
		);
		return;
	}

	await send(to, text);
}

async function send(phone: string, code: string) {
	const url = "https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber";
	const params = new URLSearchParams({
		username: process.env.SMS_USERNAME ?? "",
		password: process.env.SMS_PASSWORD ?? "",
		to: phone,
		text: code,
		bodyId: process.env.SMS_FROM ?? "",
	});

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: params.toString(),
	});

	const contentType = res.headers.get("content-type") ?? "";
	if (contentType.includes("application/json")) {
		return await res.json();
	}
	return await res.text();
}
