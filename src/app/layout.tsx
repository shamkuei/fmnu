import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "fmnu - منوی آنلاین رستوران",
	description: "منوی آنلاین رستورانت رو تو چند دقیقه بساز",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning>
			<body className="font-sans antialiased min-h-full flex flex-col">
				{children}
			</body>
		</html>
	);
}
