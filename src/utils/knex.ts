import _knex from "knex";

import GLOBAL_CONFIGS from "@/config/config";

import type { Knex } from "knex";

const KNEX_CONFIG = GLOBAL_CONFIGS.KNEX;

let knex;

if (!KNEX_CONFIG.ENABLED) {
  knex = new Proxy({}, {
    get: function () {
      return () => {
        throw new Error("Knex is not enabled!");
      };
    },
  });
} else {
  switch (KNEX_CONFIG.CLIENT) {
    case "mysql":
      knex = _knex({
        client: "mysql",
        connection: {
          host: KNEX_CONFIG.CONNECTION.MYSQL.HOST,
          port: KNEX_CONFIG.CONNECTION.MYSQL.PORT,
          database: KNEX_CONFIG.CONNECTION.MYSQL.DATABASE,
          user: KNEX_CONFIG.CONNECTION.MYSQL.USER,
          password: KNEX_CONFIG.CONNECTION.MYSQL.PASSWORD,
        },
      });
      break;
    case "sqlite3":
      knex = _knex({
        client: "sqlite3",
        connection: {
          filename: KNEX_CONFIG.CONNECTION.SQLITE3.FILENAME,
        },
      });
      break;
    default:
      throw new Error(`Knex client ${KNEX_CONFIG.CLIENT} is not supported!`);
  }
}

export default knex as Knex;