/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // Para referência, GitHub limita usernames para 39 caracteres
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Por que 254? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Por que 60? https://www.npmjs.com/package/bcrypt#hash-info
    // bcryptcalculator.com
    // bycrypt - npm
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Timestamp com time zone: timestamptz
    // Sempre use timestamp com time zone: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now()"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now()"),
    },
  });
};

exports.down = false;
