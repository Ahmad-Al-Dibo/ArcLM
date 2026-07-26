import type { Metadata } from "next";
import { ApplicationShell } from "@/components/shell/application-shell";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcLM Studio",
  description: "A local visual workspace for preparing data, tokenizers, and ArcLM learning workflows."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <ApplicationShell>{children}</ApplicationShell>
        </AppProviders>
      </body>
    </html>
  );
}
