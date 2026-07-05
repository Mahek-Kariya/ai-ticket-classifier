import { cn } from "@/lib/utils";
import { HeroLiveCard } from "@/components/base";
import "./HeroBanner.css";
import type { HeroBannerProps } from "./HeroBannerTypes";

export function HeroBanner({ className }: HeroBannerProps) {
  return (
    <section className={cn("hero-banner", className)}>
      <div className="hero-banner-content">
        <div className="hero-banner-text">
          <span className="hero-banner-label">AI-Powered Support</span>
          <h1 className="hero-banner-heading">Support Intelligence</h1>
          <p className="hero-banner-subtitle">
            Automatically classify, prioritize, and draft responses to customer
            support messages with AI-powered intelligence.
          </p>
        </div>

        <HeroLiveCard count={3} />
      </div>
    </section>
  );
}
