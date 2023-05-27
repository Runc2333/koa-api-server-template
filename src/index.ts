import Koa from "koa";
import Router from "koa-router";
import koaBody from "koa-body";

import load_routes from "@/loaders/route";

import logger from "@/utils/logger";

import GLOBAL_CONFIGS from "./config/config";

const app = new Koa();

const router = new Router();

load_routes(router);

app.use(koaBody());
app.use(router.routes()).use(router.allowedMethods());

app.listen(GLOBAL_CONFIGS.KOA.PORT, () => {
  logger.info(`Server running on port ${GLOBAL_CONFIGS.KOA.PORT}`);
  // Tell pm2 that the server is ready to accept connections
  if (process.send) {
    process.send("ready");
  }
});