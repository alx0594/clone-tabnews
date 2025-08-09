import bcryptjs from "bcryptjs";

//TODO: Adiciona o pepper.
async function hash(password) {
  const rounds = getNumberOfRounds(); // Tempo de criptografia. https://bcrypt-generator.com/
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
