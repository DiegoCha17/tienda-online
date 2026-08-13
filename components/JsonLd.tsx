import { STORE_NAME, STORE_DESCRIPTION, WHATSAPP_NUMBER } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { formatCRC } from "@/lib/currency";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STORE_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://mitienda.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`, // Placeholder
    description: STORE_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+506-${WHATSAPP_NUMBER}`,
      contactType: "customer service",
      areaServed: "CR",
      availableLanguage: "es"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    description: product.description,
    sku: product.id.toString(),
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mitienda.com"}/producto/${product.id}`,
      priceCurrency: "CRC",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
