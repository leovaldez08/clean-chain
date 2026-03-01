import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { DemoToggle } from "./demo-toggle";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#000000] mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between px-4 sm:px-8">
          <div className="mb-6 md:mb-0 flex items-center gap-3">
            <Image
              src="/icons/icon-192.webp"
              alt="CleanChain Logo"
              width={56}
              height={56}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mr-16 mt-2">
              CleanChain
            </h1>
          </div>
          <div className="max-w-xl flex flex-col gap-6">
            <h1 className="text-sm sm:text-base text-slate-600 dark:text-slate-300 drop-shadow-sm leading-relaxed">
              Helo! I&apos;m Rishi, a Software Engineer. Clean Chain is
              Progressive Web Application built to manage and supervise
              effective waste management in Urban Cities. Stay tuned for some
              awesome stuff ahead! Feel free to explore my other work using the
              social links below.
            </h1>
            <DemoToggle />
          </div>
        </div>

        <hr className="my-6 border-slate-200 dark:border-slate-800 sm:mx-auto lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between px-4">
          <span className="text-sm text-slate-500 sm:text-center dark:text-slate-400">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline font-medium">
              Cryonyx Lab
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <a
              href="https://github.com/leovaldez08"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Account"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/rishi-ganesh/"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Page"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/Rishi_Ganesh_I"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Page"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/leo_valdez_28/"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Page"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
