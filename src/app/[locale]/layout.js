import { Inter } from "next/font/google";
import { dir } from "i18next";
import "~/app/[locale]/layout.css";
import { NAMESPACES } from "~/app/i18n/config";
import { getI18nFromParams } from "~/app/i18n";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }) {
  var { t } = await getI18nFromParams(params)([NAMESPACES.common]);

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function RootLayout({ children, params }) {
  var { locale } = await params;

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
