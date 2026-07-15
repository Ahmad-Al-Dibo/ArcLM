import type { Metadata } from "next";
import { ApplicationShell } from "@/components/shell/application-shell";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcLM Web Interface Foundation",
  description: "Local frontend foundation for the ArcLM Web Experience."
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
