import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
}

export default function SEO({
  title = "Nestion | Ingat Staycation, Ingat Nestion",
  description = "Pesan penginapan yang kamu banget.",
  name = "Nestion",
  type = "website",
}: SEOProps) {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={name} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
    </Helmet>
  );
}