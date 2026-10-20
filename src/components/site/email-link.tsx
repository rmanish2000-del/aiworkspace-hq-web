import { useState } from "react";
import { EMAIL } from "@/content/caid";
import { cn } from "@/lib/utils";

async function copyEmail() {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(EMAIL);
    return;
  }
  const field = document.createElement("textarea");
  field.value = EMAIL;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

/** Mailto text link plus a button that copies the address. */
export function EmailCopy(props: { lead?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", props.className)}>
      <a
        href={`mailto:${EMAIL}`}
        className="text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary"
      >
        {props.lead ? `${props.lead} ${EMAIL}` : EMAIL}
      </a>
      <button
        type="button"
        className="inline-flex min-h-9 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-accent"
        aria-label={copied ? "Email address copied" : "Copy email address"}
        onClick={() => {
          void copyEmail()
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => setCopied(false));
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
