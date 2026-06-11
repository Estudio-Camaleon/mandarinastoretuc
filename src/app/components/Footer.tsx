import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-['Barlow_Condensed'] text-4xl font-black tracking-tight text-foreground mb-3">
              STKR<span className="text-primary">.</span>CO
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Premium vinyl stickers for the urban generation. Designed bold. Built to last.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
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

          {/* Shop */}
          <div>
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">Shop</div>
            <ul className="space-y-2">
              {["All Stickers", "Street Art", "Anime", "Nature", "Animals", "Abstract"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo("products")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">Info</div>
            <ul className="space-y-2">
              {["About Us", "Shipping", "Returns", "FAQ", "Contact", "Size Guide"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-['Barlow_Condensed'] tracking-wide">
            © 2026 STKR.CO — All rights reserved.
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-['Barlow_Condensed'] tracking-wider uppercase"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
