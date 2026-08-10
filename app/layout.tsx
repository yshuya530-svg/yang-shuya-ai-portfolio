import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Shay｜FDE、AI 应用交付与前端 UI 作品集";
const description = "Shay（杨舒雅）的作品集：EcomLens AI、AI 智能体与前端体验、内容增长实验、数据研究和真实交付证据。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og-shay.png`;

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, type: "website", images: [{ url: ogImage, width: 1672, height: 939, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
