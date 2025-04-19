"use client";

import cx from "clsx";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

export function Modal({
  children,
  isOpen,
  onClose,
  title,
  className,
}) {
  return (
    <dialog open={isOpen} className={cx(styles.root, className)}>
      {onClose && (
        <button onClick={onClose} className={styles.close}>
          <Icons.X width="0.9rem" />
        </button>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </dialog>
  );
}
