import { Alert } from "~/app/components/atoms/error";
import { ErrorEntries } from "~/app/components/atoms/error-entries";

/**
 * @param {{
 *  t: Function;
 *  data: {
 *    message: string;
 *    extra?: : Record<string, string>;
 *  };
 * }} param0
 */
export function ValidationErrors({ t, data }) {
  return (
    <div>
      <Alert type="error" center>
        {t([`error.${data.message}`, "error.fallback"])}
      </Alert>
      <ErrorEntries
        map={data?.extra}
        render={(key, value) => t(`validation_error.${key}.${value}`)}
      />
    </div>
  );
}
