import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SOCIAL_HANDLE, socialProfiles, type SocialProfileId } from "@/content/social";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function SocialIcon({ id, className }: { id: SocialProfileId; className: string }) {
  switch (id) {
    case "linkedin":
      return <Linkedin className={className} aria-hidden />;
    case "x":
      return <XIcon className={className} />;
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "facebook":
      return <Facebook className={className} aria-hidden />;
  }
}

export function SocialLinks(props: {
  className?: string;
  showHandle?: boolean;
  size?: "sm" | "md";
}) {
  const iconSize = props.size === "sm" ? "size-4" : "size-5";
  return (
    <div className={cn("flex flex-wrap items-center gap-3", props.className)}>
      {props.showHandle ? (
        <span className="text-sm text-muted-foreground">{SOCIAL_HANDLE}</span>
      ) : null}
      <ul className="flex items-center gap-1.5" aria-label="AI Workspace on social media">
        {socialProfiles.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={profile.ariaLabel}
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <SocialIcon id={profile.id} className={iconSize} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
