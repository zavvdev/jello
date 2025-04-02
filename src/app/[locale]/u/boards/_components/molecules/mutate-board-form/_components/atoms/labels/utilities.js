import { v4 as uuidv4 } from "uuid";

var _signature = "label-id";

export var NewLabelId = {
  create: () => `${_signature}-${uuidv4()}`,
  match: (id) => id.startsWith(_signature),
};
