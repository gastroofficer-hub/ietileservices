import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-gold">404</div>
        <h1 className="mt-4 font-display text-5xl text-foreground">Stránka nenalezena</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Page not found — odkaz neexistuje nebo byl přesunut.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Něco se pokazilo</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Zkuste obnovit stránku nebo se vraťte na úvod.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth"
          >
            Zkusit znovu
          </button>
          <a
            href="/"
            className="border border-border text-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] hover:border-gold transition-smooth"
          >
            Úvod
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0d0d0d" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "I&E Tile Services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "I&E Tile Services",
          description:
            "Výroba a realizace koupelen na míru. Návrh, obklady, instalace.",
          telephone: "+420 777 123 456",
          email: "info@ie-tile.cz",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Vodičkova 22",
            postalCode: "110 00",
            addressLocality: "Praha",
            addressCountry: "CZ",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
