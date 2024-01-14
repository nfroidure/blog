import styles from "./gist.module.scss";
import Code from "./code";
import type { ReactNode, HTMLAttributes } from "react";

export default function Gist({
  children,
  className,
  username,
  id,
  ...props
}: {
  children: ReactNode;
} & HTMLAttributes<HTMLElement> & {
    username: string;
    id: string;
  }) {
  return (
    <div
      className={styles.root + (className ? " " + className : "")}
      {...props}
    >
      <iframe
        src={`data:text/html;base64,${btoa(
          `<script src="https://gist.github.com/${username}/${id}.js"></script>`,
        )}`}
      ></iframe>
      <noscript>
        <Code>{children}</Code>
      </noscript>
    </div>
  );
}
