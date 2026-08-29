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
  /** Render bare inline text — for nesting inside an existing h1/p wrapper. */
  bare?: boolean;
}) {
  const block = ledger[props.id];
  if (!block) return null;
  const badge = props.badge ?? true;
  const badgeEl =
    badge && block.claim ? (
      <span className="mt-3 block">
        <StatusChip tone="verified">Verified · {block.claim}</StatusChip>
      </span>
    ) : null;

  if (props.bare) {
    return (
      <>
        {block.copy}
        {badgeEl}
      </>
    );
  }

  return (
    <div className={cn(props.className)}>
      <p className="leading-relaxed">{block.copy}</p>
      {badgeEl}
    </div>
  );
}
