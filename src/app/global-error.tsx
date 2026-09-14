"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself (where next-intl's
 * provider and translations live) — so this cannot depend on translations
 * or any component from the app tree, and must render its own <html>/<body>.
 * Deliberately plain inline styles only, independent of Tailwind/theme CSS.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#faf8f5",
          color: "#3c332b",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Something went wrong — حدث خطأ ما
        </h1>
        <p style={{ marginTop: "12px", maxWidth: "420px", fontSize: "0.9rem", opacity: 0.8 }}>
          Please try again. / يرجى المحاولة مرة أخرى.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "24px",
            padding: "10px 24px",
            background: "#3c332b",
            color: "#faf8f5",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Retry / إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
