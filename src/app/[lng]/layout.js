import { Inter } from "next/font/google";
import { dir } from "i18next";
import "~/app/styles/globals.css";
import { NAMESPACES } from "~/app/i18n/config";
import { LOCALES } from "~/app/i18n/config";
import { getI18nFromParams } from "~/app/i18n";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.common);

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export async function generateStaticParams() {
  return Object.values(LOCALES).map((lng) => ({ lng }));
}

export default async function RootLayout({ children, params }) {
  var { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
