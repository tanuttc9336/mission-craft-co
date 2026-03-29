import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { capabilityConfigs } from '@/data/capabilityConfig';
import { industryConfigs } from '@/data/industryConfig';
import logo from '@/assets/undercat-logo.png';

type DropdownKey = 'capabilities' | 'industries' | null;

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownKey>(null);

  const isActive = (prefix: string) => {
    if (prefix === '/') return location.pathname === '/';
    return location.pathname.startsWith(prefix);
  };

  const linkCls = (active: boolean) =>
    `text-xs font-medium tracking-widest uppercase transition-colors hover:text-foreground ${active ? 'text-foreground' : 'text-muted-foreground'}`;

  /* ─── Dropdown renderer (desktop) ─── */
  const DesktopDropdown = ({ id, label, prefix, items }: {
    id: DropdownKey;
    label: string;
    prefix: string;
    items: { to: string; label: string; disabled?: boolean }[];
  }) => (
    <div
      className="relative"
      onMouseEnter={() => setOpenDropdown(id)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <button className={`${linkCls(isActive(prefix))} flex items-center gap-1`}>
        {label}
        <ChevronDown size={12} className={`transition-transform ${openDropdown === id ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {openDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
          >
            <div className="bg-background border border-border py-2 min-w-[220px] shadow-lg">
              {items.map(item => (
                item.disabled ? (
                  <span
                    key={item.to}
                    className="block px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-muted-foreground/40 cursor-default"
                  >
                    {item.label} <span className="text-[10px] normal-case tracking-normal opacity-60">— soon</span>
                  </span>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-5 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors hover:bg-secondary ${
                      location.pathname === item.to ? 'text-foreground bg-secondary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─── Accordion renderer (mobile) ─── */
  const MobileAccordion = ({ id, label, prefix, items }: {
    id: DropdownKey;
    label: string;
    prefix: string;
    items: { to: string; label: string; disabled?: boolean }[];
  }) => (
    <div>
      <button
        onClick={() => setMobileAccordion(mobileAccordion === id ? null : id)}
        className={`w-full text-left ${linkCls(isActive(prefix))} py-3 flex items-center justify-between`}
      >
        {label}
        <ChevronDown size={12} className={`transition-transform ${mobileAccordion === id ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {mobileAccordion === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 border-l border-border ml-2"
          >
            {items.map(item => (
              item.disabled ? (
                <span
                  key={item.to}
                  className="block text-xs font-medium tracking-widest uppercase py-2.5 text-muted-foreground/40"
                >
                  {item.label} <span className="text-[10px] normal-case tracking-normal opacity-60">— soon</span>
                </span>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => { setMobileOpen(false); setMobileAccordion(null); }}
                  className={`block text-xs font-medium tracking-widest uppercase py-2.5 ${
                    location.pathname === item.to ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─── Dropdown data ─── */
  const capabilityItems = capabilityConfigs.map(c => ({ to: `/capabilities/${c.slug}`, label: c.label }));
  const industryItems = industryConfigs.map(c => ({ to: `/industries/${c.slug}`, label: c.label, disabled: !c.available }));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="no-print fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Undercat" className="h-8 w-auto invert dark:invert-0" />
            <span className="font-display text-sm font-bold tracking-wider uppercase">Undercat</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkCls(isActive('/'))}>Home</Link>
            <Link to="/work" className={linkCls(isActive('/work'))}>Work</Link>
            <DesktopDropdown id="capabilities" label="What We Do" prefix="/capabilities" items={capabilityItems} />
            <DesktopDropdown id="industries" label="Industries" prefix="/industries" items={industryItems} />
            <Link to="/briefing-room" className={linkCls(isActive('/briefing-room'))}>Briefing Room</Link>
            <Link to="/contact" className={linkCls(isActive('/contact'))}>Contact</Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-b border-border bg-background"
            >
              <nav className="container py-6 flex flex-col gap-1">
                <Link to="/" onClick={() => setMobileOpen(false)} className={`${linkCls(isActive('/'))} py-3`}>Home</Link>
                <Link to="/work" onClick={() => setMobileOpen(false)} className={`${linkCls(isActive('/work'))} py-3`}>Work</Link>
                <MobileAccordion id="capabilities" label="What We Do" prefix="/capabilities" items={capabilityItems} />
                <MobileAccordion id="industries" label="Industries" prefix="/industries" items={industryItems} />
                <Link to="/briefing-room" onClick={() => setMobileOpen(false)} className={`${linkCls(isActive('/briefing-room'))} py-3`}>Briefing Room</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className={`${linkCls(isActive('/contact'))} py-3`}>Contact</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="no-print border-t border-border py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Undercat" className="h-6 w-auto invert dark:invert-0" />
                <span className="font-display text-xs font-bold tracking-wider uppercase">Undercat Creatives</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Creative production that delivers. From concept to final cut — masterful content for brands that refuse to blend in.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/undercatcreatives" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <Instagram size={16} />
                </a>
                <a href="https://www.youtube.com/@undercatcreatives" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Explore</p>
              <div className="flex flex-col gap-2.5">
                <Link to="/work" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Work</Link>
                {capabilityConfigs.map(c => (
                  <Link key={c.slug} to={`/capabilities/${c.slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{c.label}</Link>
                ))}
                <Link to="/industries/golf" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Golf Industry</Link>
              </div>
            </div>

            {/* Get Started */}
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Get Started</p>
              <div className="flex flex-col gap-2.5">
                <Link to="/briefing-room" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Briefing Room</Link>
                <Link to="/lens" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Undercat Lens</Link>
                <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Contact</p>
              <div className="flex flex-col gap-3">
                <a href="tel:+66949869882" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Phone size={12} /> (+66) 094-986-9882
                </a>
                <a href="mailto:hello@undercatcreatives.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail size={12} /> hello@undercatcreatives.com
                </a>
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin size={12} /> Bangkok, Thailand
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs text-muted-foreground tracking-wide">&copy; {new Date().getFullYear()} Undercat Creatives. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">Crafted by Human</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
