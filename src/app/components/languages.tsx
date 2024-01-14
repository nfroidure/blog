"use client";

import styles from "./languages.module.scss";
import { type Locale, i18n } from "../../i18n-config";
import { type MenuKeys, MENU } from "./menu";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Languages({ locale }: { locale: Locale }) {
  const pathName = usePathname();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    const currentMenuKey =
      ((Object.keys(MENU) as MenuKeys[]).find(
        (key) => MENU[key][segments[1] as Locale] === segments[2]
      ) as MenuKeys) || "home";

    segments[2] = MENU[currentMenuKey][locale];
    segments[1] = locale;
    return segments.slice(0, 3).join("/");
  };

  return (
    <nav className={styles.iaLanguages}>
      <ul>
        {i18n.locales.map((aLocale) => {
          return (
            <li
              key={aLocale}
              className={[
                styles.iaLanguagesFlag,
                styles[
                  `iaLanguagesFlag${aLocale[0].toUpperCase()}${aLocale.substring(
                    1
                  )}`
                ],
                ...(aLocale !== locale ? [styles.selected] : []),
              ].join(" ")}
            >
              <Link href={redirectedPathName(aLocale)}>
                <span>{aLocale}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
