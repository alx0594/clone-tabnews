const { exec } = require("node:child_process");

function checkPosgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPosgres(); // recursividade
      return;
    }
    console.log("\n🟢 Postgres está pronto e aceitando conexões\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
checkPosgres();
