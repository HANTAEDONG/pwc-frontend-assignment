import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header } from "@/features/header";
import { Banner } from "@/widgets/banner";
import { GlobalDialog } from "@/widgets/global-dialog";
import { pretendardJP } from "./fonts";
import { env } from "@/shared/config/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendardJP.variable}>
      <body className={`${pretendardJP.className} min-h-screen flex flex-col`}>
        <Providers>
          <a
            href="#main"
            className="absolute -top-10 left-0 z-[100] bg-black px-2 py-2 text-white no-underline focus:top-0"
          >
            본문으로 건너뛰기
          </a>
          <Header />
          <Banner />
          <main id="main" className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
          <GlobalDialog />
        </Providers>
      </body>
    </html>
  );
}
