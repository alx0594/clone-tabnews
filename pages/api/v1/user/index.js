import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import session from "model/session.js";
import user from "model/user.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);

  const renewedSessionObject = await session.renew(sessionObject.id);

  controller.setSessionCookie(renewedSessionObject.token, response);

  const userFound = await user.findOneById(sessionObject.user_id);

  // tratando E-tag que retorna 304 quando os dados não foram alterados
  // E ninguém usar cache no meio do caminho, tipo Next, Vercel..
  // Rever aula para reter conhecimento
  // https://github.com/filipedeschamps/clone-tabnews/pull/55

  response.setHeader(
    "Cache-Control",
    "no-store",
    "no-cache",
    "max-age=0",
    "must-revalidate",
  );
  return response.status(200).json(userFound);
}
