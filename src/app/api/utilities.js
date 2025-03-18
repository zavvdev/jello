import { Either as E } from "jello-fp";
import {
  ERROR_RESPONSE,
  MESSAGE_STATUS_MAP,
  SUCCESS_RESPONSE,
} from "./config";

/**
 * @param {import("next/server").NextRequest} request
 */
export var extractRequest = async (request) => {
  try {
    var res = await request.json();
    return E.right(res);
  } catch {
    return E.left();
  }
};

export var forward_ = (status) =>
  E.chain((gatewayResult = {}) => {
    return SUCCESS_RESPONSE({
      status: status || MESSAGE_STATUS_MAP[gatewayResult?.message],
      message: gatewayResult.message,
      data: gatewayResult.data,
    });
  });

export var catch_ = (status) =>
  E.chainLeft((gatewayResult = {}) =>
    ERROR_RESPONSE({
      status: status || MESSAGE_STATUS_MAP[gatewayResult?.message],
      message: gatewayResult.message,
      data: gatewayResult.data,
    }),
  );
