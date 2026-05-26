import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — I&E Tile Services" },
      {
        name: "description",
        content:
          "Napište nám pro nezávaznou poptávku koupelny na míru. Praha, Vodičkova 22. Telefon +420 777 123 456.",
      },
      { property: "og:title", content: "Kontakt — I&E Tile Services" },
      { property: "og:description", content: "Domluvte si nezávaznou konzultaci." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>06 — {t.nav.contact}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{t.contact.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t.contact.lead}</p>

      <div className="mt-16 grid lg:grid-cols-12 gap-12">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="lg:col-span-7 border border-border bg-card/40 p-8 md:p-10 space-y-6"
        >
          <Field label={t.contact.name} name="name" required />
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label={t.contact.email} name="email" type="email" required />
            <Field label={t.contact.phone} name="phone" type="tel" />
          </div>
          <Field label={t.contact.message} name="message" textarea required />

          <button
            type="submit"
            className="w-full sm:w-auto bg-gold text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold-soft transition-smooth"
          >
            {t.contact.send}
          </button>

          {sent && (
            <div className="text-sm text-gold border-l-2 border-gold pl-4">{t.contact.sent}</div>
          )}
        </form>

        {/* Info */}
        <aside className="lg:col-span-5 space-y-8">
          <InfoRow icon={<MapPin size={18} />} label={t.contact.address} value={t.contact.addressLine} />
          <InfoRow
            icon={<Phone size={18} />}
            label={t.contact.phoneLabel}
            value={t.contact.phoneValue}
            href={`tel:${t.contact.phoneValue.replace(/\s/g, "")}`}
          />
          <InfoRow
            icon={<Mail size={18} />}
            label={t.contact.emailLabel}
            value={t.contact.emailValue}
            href={`mailto:${t.contact.emailValue}`}
          />
          <InfoRow icon={<Clock size={18} />} label={t.contact.hours} value={t.contact.hoursValue} />

          <div className="aspect-[4/3] border border-border bg-card/40 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 39px, oklch(0.74 0.13 85 / 0.2) 39px 40px), repeating-linear-gradient(90deg, transparent 0 39px, oklch(0.74 0.13 85 / 0.2) 39px 40px)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full border border-gold/40 animate-pulse" />
                <MapPin className="text-gold" size={32} />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Praha — Vodičkova 22
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const cls =
    "w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-foreground placeholder:text-muted-foreground transition-smooth";
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={5} className={cls} />
      ) : (
        <input name={name} type={type} required={required} className={cls} />
      )}
    </label>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 items-start group">
      <span className="text-gold mt-1">{icon}</span>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
        <div className="mt-1 text-foreground group-hover:text-gold transition-smooth">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
