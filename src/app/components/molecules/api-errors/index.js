import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Alert } from "~/app/components/atoms/error";
import { ErrorEntries } from "~/app/components/atoms/error-entries";
import { PUBLIC_ROUTES } from "~/app/routes";
import styles from "./styles.module.css";
import {
  FALLBACK_MESSAGES,
  FALLBACK_MESSAGES_KEYS,
  TRANSLATIONS,
  UNAUTHORIZED_MSG,
} from "./config";

/**
 * @param {{
 *  t: Function;
 *  validation?: boolean;
 *  data: {
 *    message: string;
 *    extra?: : Record<string, string>;
 *  };
 * }} param0
 */
export function ApiErrors({ t, validation, data }) {
  validation = validation ?? true;

  var {
    i18n: { language },
  } = useTranslation();

  if (FALLBACK_MESSAGES_KEYS.includes(data?.message)) {
    return (
      <div>
        <Alert type="error" center>
          {FALLBACK_MESSAGES[language][data.message]}
          <br />
          {data.message === UNAUTHORIZED_MSG && (
            <Link
              href={PUBLIC_ROUTES.auth.login()}
              className={styles.logout}
            >
              {TRANSLATIONS[language].logout}
            </Link>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Alert type="error" center>
        {t([`error.${data.message}`, "error.fallback"])}
      </Alert>
      {validation && (
        <ErrorEntries
          map={data?.extra}
          render={(key, value) =>
            t(`validation_error.${key}.${value}`)
          }
        />
      )}
    </div>
  );
}
