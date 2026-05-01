/**
 * SEO + AEO helpers — Undercat Creatives
 *
 * Centralizes everything that touches search-engine and answer-engine
 * surfaces:
 *   - <SeoHead /> for per-page metadata (title, description, canonical, OG)
 *   - <JsonLd /> for typed structured-data injection
 *   - generators for Organization, LocalBusiness, Person, CreativeWork,
 *     BreadcrumbList, FAQPage, ItemList
 *
 * Brand voice rule (Pattern 4 — same-room language) is enforced at the
 * source: no schema generator below emits a `price`, `priceRange`,
 * `Offer`, or "starting at X" string. Undercat positions on access and
 * craft, not tier-pricing.
 *
 * Site-wide entity IDs match the @graph in /index.html so the JSON-LD
 * payload from page-level <JsonLd /> can reference the canonical
 * Organization/LocalBusiness without duplicating those entities.
 */

import { Helmet } from 'react-helmet-async';
import type { CaseStudy } from '@/types/brief';

const SITE_URL = 'https://www.undercatcreatives.com';
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#founder`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ── Helmet wrapper ─────────────────────────────────────────────

interface SeoHeadProps {
  /** Page title — kept under 60 chars for SERP truncation. */
  title: string;
  /** Page description — under 160 chars. */
  description: string;
  /** Path relative to site root, e.g. "/work/audi-launch-films". */
  path: string;
  /** Page-specific OG image (1200×630). Falls back to og-default.jpg. */
  image?: string;
  /** OG type — "website" for landing pages, "article" for case studies. */
  ogType?: 'website' | 'article';
  /** Set to true for pages that should not be indexed (drafts, gated). */
  noindex?: boolean;
  /** Optional structured-data graph nodes for this page. */
  jsonLd?: object | object[];
}

export function SeoHead({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const url = `${SITE_URL}${path}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const graph = jsonLd
    ? Array.isArray(jsonLd)
      ? { '@context': 'https://schema.org', '@graph': jsonLd }
      : { '@context': 'https://schema.org', ...(jsonLd as object) }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Undercat Creatives" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {graph && (
        <script type="application/ld+json">{JSON.stringify(graph)}</script>
      )}
    </Helmet>
  );
}

// ── JSON-LD primitive ──────────────────────────────────────────

/**
 * Render a JSON-LD payload outside of <Helmet>. Useful when a page
 * wants additional structured data after first paint without
 * blocking <head> emission. Prefer SeoHead's `jsonLd` prop where
 * possible — it keeps everything in <head> for crawler reads.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Trusted source — content is generated from typed data, not
      // user input. Still avoid embedding strings with raw </script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Schema generators ──────────────────────────────────────────

/** Reference to the site-wide Organization entity (defined in index.html). */
export const orgRef = () => ({ '@id': ORG_ID });

/** Reference to the founder Person entity (defined in index.html). */
export const founderRef = () => ({ '@id': PERSON_ID });

/**
 * BreadcrumbList for a page.
 * Pass an ordered array of `[label, path]` from root → current page.
 *
 * Example:
 *   breadcrumbSchema([
 *     ['Home', '/'],
 *     ['Work', '/work'],
 *     ['Audi Thailand — Launch Films', '/work/audi-launch-films'],
 *   ])
 */
export function breadcrumbSchema(items: [label: string, path: string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([label, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: label,
      item: `${SITE_URL}${path}`,
    })),
  };
}

/**
 * CreativeWork schema for a single case study.
 *
 * Maps Undercat case data → schema.org entity that AEO answer engines
 * (Perplexity, ChatGPT, Google AI Overview) can extract when someone
 * asks "Bangkok production house Audi" or similar.
 */
export function creativeWorkSchema(c: CaseStudy) {
  return {
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/work/${c.id}`,
    name: c.title,
    description: c.description,
    url: `${SITE_URL}/work/${c.id}`,
    image: c.thumbnail,
    creator: orgRef(),
    publisher: orgRef(),
    creditText: 'Undercat Creatives',
    inLanguage: ['en', 'th'],
    genre: c.industry,
    keywords: [
      c.industry,
      ...(c.outputs || []),
      ...(c.styleDNA || []),
    ].join(', '),
    ...(c.videoUrl
      ? {
          video: {
            '@type': 'VideoObject',
            name: c.title,
            description: c.description,
            thumbnailUrl: c.thumbnail,
            contentUrl: c.videoUrl,
            uploadDate: '2025-01-01',
            publisher: orgRef(),
          },
        }
      : {}),
  };
}

/**
 * ItemList schema for a list of case studies (Work index page).
 * Tells search engines this is a curated index, not a flat page.
 */
export function workIndexSchema(cases: CaseStudy[]) {
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/work#itemlist`,
    name: 'Undercat Selected Work',
    description: 'Selected brand films and creative production from Undercat Creatives.',
    numberOfItems: cases.length,
    itemListElement: cases.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/work/${c.id}`,
      name: c.title,
    })),
  };
}

/**
 * FAQPage schema — most direct AEO win Undercat can ship.
 *
 * Each Q/A pair becomes a fact AI engines can quote directly. Keep
 * answers concise (under ~50 words) and self-contained — they get
 * extracted out of context.
 */
export interface FAQ {
  question: string;
  answer: string;
}
export function faqSchema(faqs: FAQ[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Service schema for a single Undercat service offering.
 * Used on /services/* pages.
 */
export function serviceSchema(args: {
  id: string;
  name: string;
  description: string;
  serviceType?: string;
  url: string;
}) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${args.url}#service`,
    name: args.name,
    description: args.description,
    serviceType: args.serviceType ?? args.name,
    provider: orgRef(),
    areaServed: { '@type': 'Country', name: 'Thailand' },
    url: `${SITE_URL}${args.url}`,
  };
}
