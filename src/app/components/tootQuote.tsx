import styles from "./tootQuote.module.scss";
import type { ReactNode, HTMLAttributes } from "react";

export default function TootQuote({
  children,
  className,
  url,
  ...props
}: {
  children: ReactNode;
  url: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={styles.root + (className ? " " + className : "")}
      {...props}
    >
      <iframe src={`${url}/embed`} allowFullScreen></iframe>
      <noscript>
        <blockquote>{children}</blockquote>
      </noscript>
    </div>
  );
}
