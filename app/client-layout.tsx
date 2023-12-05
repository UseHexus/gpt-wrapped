"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const LayoutProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 left-10 z-20 flex border-b border-slate-600 bg-slate-900  py-8 pl-6">
        <>
          <div className="flex">
            <Link href="/" className="fixed top-4 ">
              <Image
                width={30}
                height={100}
                className="mt-1 h-6 w-auto"
                src={
                  "https://assets-global.website-files.com/64809e6177ea6a3d2f622ed5/64974480708de09e4308b8c2_hexus%20logo%20(1).svg"
                }
                alt="logo"
              />
            </Link>
          </div>
        </>
      </header>

      <main>{children}</main>
    </>
  );
};
