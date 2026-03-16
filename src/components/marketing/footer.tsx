import Link from "next/link";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {group.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Tariff<span className="text-emerald-500">Verify</span>
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} TariffVerify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
