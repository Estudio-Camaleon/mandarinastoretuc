import { Instagram, Twitter, Youtube } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-14"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1774124031693-a585cf5e4771?w=1920&h=1080&fit=crop&auto=format"
          alt="Graffiti and stickers on urban wall"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      {/* Diagonal orange accent bar */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 z-0"
        style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Text */}
        <div>
          {/* Logo mark */}
          <div className="inline-block mb-6">
            <div className="font-['Barlow_Condensed'] text-6xl md:text-8xl font-black tracking-tight leading-none">
              STKR<span className="text-primary">.</span>CO
            </div>
          </div>

          <h1 className="font-['Barlow_Condensed'] text-4xl md:text-6xl font-900 leading-none uppercase tracking-tight text-foreground mb-4">
            STICK YOUR<br />
            <span className="text-primary">STYLE</span><br />
            EVERYWHERE.
          </h1>

          <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
            Premium vinyl stickers for the streets. Weather-proof, bold, and designed for those who don't follow the rules.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToProducts}
              className="bg-primary text-white px-8 py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              SHOP NOW
            </button>
            <button
              onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-border text-foreground px-8 py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              COLLECTIONS
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5 mt-10">
            <span className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase">Follow us</span>
            <div className="w-8 h-px bg-border" />
            {[
              { Icon: Instagram, label: "Instagram", href: "#" },
              { Icon: Twitter, label: "Twitter", href: "#" },
              { Icon: Youtube, label: "YouTube", href: "#" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Sticker wall collage */}
        <div className="hidden md:grid grid-cols-2 gap-3">
          {[
            "https://images.unsplash.com/photo-1763888647755-5754915925ff?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1758295099602-18bcd8c024b7?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1775496230770-d379e89b9e7e?w=600&h=400&fit=crop&auto=format",
          ].map((url, i) => (
            <div
              key={i}
              className={`overflow-hidden bg-card ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
            >
              <ImageWithFallback
                src={url}
                alt="Street sticker art"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-border">
          {[
            { value: "500+", label: "DESIGNS" },
            { value: "10K+", label: "ORDERS" },
            { value: "4.9★", label: "RATING" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <div className="font-['Barlow_Condensed'] text-xl font-900 text-primary">{value}</div>
              <div className="text-[10px] font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
