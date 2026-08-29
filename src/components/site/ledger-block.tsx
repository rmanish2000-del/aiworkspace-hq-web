import { ledger } from "@/content/ledger";
import { cn } from "@/lib/utils";
import { StatusChip } from "./primitives";

/**
 * Renders a canonical ledger block (CB-xx) with its verification badge,
 * mirroring the Astro site's LedgerBlock component.
 */
export function LedgerBlock(props: {
  id: string;
  className?: string;
  badge?: boolean;
  as?: "p" | "h1" | "h2";
}) {
  const block = ledger[props.id];
  if (!block) return null;
  const Tag = props.as ?? "p";
  const badge = props.badge ?? true;

  return (
    <span className={cn("block", props.className)}>
      <Tag className="leading-relaxed">{block.copy}</Tag>
      {badge && block.claim ? (
        <span className="mt-3 inline-block">
          <StatusChip tone="verified">Verified · {block.claim}</StatusChip>
        </span>
      ) : null}
    </span>
  );
}
