import Koa from "koa";

import stdrtn from "@/utils/stdrtn";

export default [{
  method: "get",
  handler: async (ctx: Koa.Context) => {
    stdrtn.success(ctx.res, `Wanna get ${ctx.params.id}?`);
  },
}];