import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  type = 'website', 
  image, 
  article = false 
}) => {
  const baseTitle = 'Aswad Herbs | Authentic Homemade Spices';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const siteUrl = 'https://aswadherbs.com';

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update OG Tags
    const updateMetaTag = (property: string, content: string) => {
      const tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute('content', content);
    };

    updateMetaTag('og:title', fullTitle);
    if (description) updateMetaTag('og:description', description);
    updateMetaTag('og:type', article ? 'article' : type);
    if (image) updateMetaTag('og:image', image);

  }, [fullTitle, description, type, image, article]);

  // Dynamic Structured Data
  const structuredData: any = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Aswad Herbs",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": "Authentic naturally grown, stone-ground homemade spices from Maharashtra.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7499585453",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://facebook.com/aswadherbs",
        "https://instagram.com/aswadherbs"
      ]
    }
  ];

  // Add Breadcrumbs if not homepage
  if (title && title !== "Home") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": `${siteUrl}/${title.toLowerCase().replace(/\s+/g, '-')}`
        }
      ]
    });
  }

  // Add Article Schema if it's a blog post
  if (article) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "image": image,
      "author": {
        "@type": "Organization",
        "name": "Aswad Herbs"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Aswad Herbs",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "description": description
    });
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export default SEO;
