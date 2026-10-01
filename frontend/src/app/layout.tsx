import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ApolloProvider from "@/providers/ApolloProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Board",
  description: "Manage projects and tasks",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ApolloProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ApolloProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
