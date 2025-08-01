import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "model/password.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      //LIMIT 1: Encontrou um registro, já pode parar de buscar.
      text: `
      SELECT 
        *
      FROM 
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1 
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function hashPasswordInObject(userInputValues) {
    const hashPassord = await password.hash(userInputValues.password);
    userInputValues.password = hashPassord;
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  // ... spread. Espalhar o que tem dentro do objeto.
  // O que está na direita irá sobrescrever o que está na esquerda
  const userWithNewValue = { ...currentUser, ...userInputValues };

  const updateUser = await runUpdateQuery(userWithNewValue);
  return updateUser;

  async function runUpdateQuery(userWithNewValue) {
    const results = await database.query({
      text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE 
        id = $1
      RETURNING
        *
      `,
      values: [
        userWithNewValue.id,
        userWithNewValue.username,
        userWithNewValue.email,
        userWithNewValue.password,
      ],
    });
    return results.rows[0];
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
    SELECT 
      username
    FROM 
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O usuário informado já está sendo utilizado.",
      action: "Utilize outro usuário para realizar esta operação.",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
    SELECT 
      email
    FROM 
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
