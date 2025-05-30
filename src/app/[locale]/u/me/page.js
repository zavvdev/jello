import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { I18nProvider } from "~/app/i18n/provider";
import { LangChanger } from "~/app/components/atoms/lang-changer";
import { Alert } from "~/app/components/atoms/error";
import { FormInfo } from "./_components/atoms/form-info";
import { FormPassword } from "./_components/atoms/form-password";
import { DeleteProfile } from "./_components/atoms/delete-profile";

var I18N_NAMESPACES = [NAMESPACES.profile];

export default async function Profile({ params }) {
  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  var data = await query(API_ROUTES.me.get());

  var profile = data?.data || {};

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <h1>{t("title")}</h1>
      {!data?.success ? (
        <Alert type="error">{t("error.fetch")}</Alert>
      ) : (
        <>
          <FormInfo
            initialValues={{
              firstName: profile.first_name,
              lastName: profile.last_name,
              username: profile.username,
              email: profile.email,
              bio: profile.bio,
            }}
          />
          <hr />
          <FormPassword />
          <br />
          <hr />
          <br />
          <DeleteProfile />
          <LangChanger />
        </>
      )}
    </I18nProvider>
  );
}
