"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const navLinkVariants = cva(
  "text-sm font-semibold leading-5 tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-center align-middle transition-colors",
  {
    variants: {
      active: {
        true: "text-gray-700 hover:text-gray-900",
        false: "text-gray-500 hover:text-gray-900",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export function Header() {
  const pathname = usePathname();
  const isGeneralTask = pathname === "/";

  return (
    <header className="h-[60px] border-b border-gray-200 bg-white">
      <div className="container mx-auto h-full px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/pwc_logo.svg"
              alt="PwC 로고"
              width={106}
              height={24}
              priority
              className="h-6 w-[106px]"
            />
          </div>
          <nav aria-label="주요 네비게이션" className="h-5">
            <ul className="flex h-full items-center gap-[60px]">
              <li>
                <Link
                  href="/"
                  className={cn(navLinkVariants({ active: isGeneralTask }))}
                  aria-current={isGeneralTask ? "page" : undefined}
                >
                  일반과제
                </Link>
              </li>
              <li>
                <Link
                  href="/specialized"
                  className={cn(navLinkVariants({ active: !isGeneralTask }))}
                  aria-current={!isGeneralTask ? "page" : undefined}
                >
                  산업 전문화 과제
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
