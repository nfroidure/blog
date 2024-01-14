"use client";

import styles from "./menu.module.scss";
import { usePathname } from "next/navigation";
import { type Dictionary } from "../../dictionary";
import { type Locale } from "../../i18n-config";

export type MenuKeys = keyof Dictionary["menu"];

export const MENU = {
  home: {
    en: "",
    fr: "",
  },
  blog: {
    en: "blog",
    fr: "blog",
  },
  projects: {
    en: "projects",
    fr: "projets",
  },
  about: {
    en: "about",
    fr: "a_propos",
  },
} as const satisfies Record<MenuKeys, Record<Locale, string>>;

export default function Menu({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary["menu"];
}) {
  const pathname = usePathname();

  return (
    <nav className={styles.iaMenu}>
      <ul className={styles.iaMenuBody}>
        {(Object.keys(MENU) as MenuKeys[]).map((pageName) => {
          const currentPathname = `/${locale}${MENU[pageName][locale] ? "/" : ""}${
            MENU[pageName][locale]
          }`;

          return (
            <li key={pageName} className={styles.iaMenuItem}>
              <a
                href={currentPathname}
                title={dictionary[pageName].title}
                className={pathname === currentPathname ? styles.selected : ""}
              >
                {dictionary[pageName].label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
