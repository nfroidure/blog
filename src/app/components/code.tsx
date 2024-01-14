import styles from "./code.module.scss";
import type { ReactNode, HTMLAttributes } from "react";

// TODO: Use syntax highlighter (compat server components or prisma like for api-docs)
export default function Code({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={styles.root + (className ? " " + className : "")}
      {...props}
    >
      <code>
        <pre>{children}</pre>
      </code>
    </div>
  );
}
