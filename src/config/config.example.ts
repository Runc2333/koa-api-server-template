// Common Config
const GLOBAL_CONFIGS = {
  KOA: {
    PORT: 1551,
  },
  KNEX: {
    ENABLED: false,
    CLIENT: "mysql",
    CONNECTION: {
      MYSQL: {
        HOST: "localhost",
        PORT: 3306,
        DATABASE: "",
        USER: "",
        PASSWORD: "",
      },
      SQLITE3: {
        FILENAME: "",
      },
    },
  }
};

export default GLOBAL_CONFIGS;