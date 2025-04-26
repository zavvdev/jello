import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { I18nProvider } from "~/app/i18n/provider";
import { DeleteButton } from "./_components/atoms/delete-button";

var I18N_NAMESPACES = [NAMESPACES.task];

export default async function Task({ params }) {
  var { id } = await params;

  var { i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <div>
        <h1>Task {id}</h1>
        <p>Task details will be displayed here.</p>
        <DeleteButton boardId={1} id={id} />
      </div>
    </I18nProvider>
  );
}
