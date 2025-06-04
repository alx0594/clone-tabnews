import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "model/migrator.js";

const router = createRouter();

router.get(getHandler); //recebe um handler
router.post(postHandler); //recebe um handler

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const migratedMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(migratedMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
