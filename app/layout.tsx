import "styles/globals.css";
import cx from "classnames";
import { cal, inter } from "styles/fonts";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { LayoutProvider } from "./client-layout";

const title = "Hexus";
const description = "AI-powered product adoption";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://hexus.ai/"),
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="en">
      <Toaster />
      <body
        className={cx(
          cal.variable,
          inter.variable,
          "flex",
          "flex-col",
          "min-h-screen",
          "bg-slate-900",
        )}
      >
        <LayoutProvider>{children}</LayoutProvider>
        <footer className="mx-auto mt-auto w-full text-center text-xs lg:text-left ">
          <div className="mt-4 flex justify-center p-2 text-center text-neutral-700 ">
            <span className="text-neutral-400">
              <a href="https://hexus.ai"> Made with Hexus</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
