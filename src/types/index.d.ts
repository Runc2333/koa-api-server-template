declare module "@/config/config" {
  const GLOBAL_CONFIGS: {
    KOA: {
      PORT: number;
    };
    KNEX: {
      ENABLED: boolean;
      CLIENT: "mysql" | "sqlite3";
      CONNECTION: {
        MYSQL: {
          HOST: string;
          PORT: number;
          DATABASE: string;
          USER: string;
          PASSWORD: string;
        };
        SQLITE3: {
          FILENAME: string;
        };
      };
    };
  };
  export default GLOBAL_CONFIGS;
}