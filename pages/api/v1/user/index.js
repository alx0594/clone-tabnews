import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

function getHandler(request, response) {
  return response.status(200).json({});
}
