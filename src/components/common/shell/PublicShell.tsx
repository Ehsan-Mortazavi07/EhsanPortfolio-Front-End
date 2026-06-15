"use client";

import type { PropsWithChildren } from "react";

export function PublicShell({ children }: PropsWithChildren) {
  return (
    <div className="site-shell">
      <div className="site-frame">{children}</div>
    </div>
  );
}
