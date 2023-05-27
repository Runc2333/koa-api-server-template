import Koa from "koa";
import fs from "fs-extra";
import path from "path";

import logger from "@/utils/logger";
import stdrtn from "@/utils/stdrtn";

import Router from "koa-router";

export default function load_routes (router: Router) {
  // read files in the 'routes' folder
  const root_path = path.join(__dirname, "../routes");

  const registered_paths: string[] = [];

  const handle_file = (item: fs.Dirent, path_prefix: string) => {
    if (item.name.endsWith(".js") || item.name.endsWith(".ts")) {
      const api_name = item.name.split(".").slice(0, -1).join(".").replace(/^_/, ":");
      const api_path = api_name === "index" ? path_prefix : (path_prefix + api_name).replace(/\/*$/g, "/");
      const file_path = path.join(root_path, path_prefix.split(/\/|\\/).map(s => s.replace(/^:/, "_")).join("/"), item.name);
      let configuration;
      try {
        configuration = require(file_path);
      } catch (e: any) {
        throw new Error(`Failed to load ${file_path}: ${e.message}`);
      }
      configuration = configuration.default ?? configuration;
      if (!(configuration instanceof Array)) {
        throw new Error(`Failed to load ${file_path}: route file must export an array, but got ${typeof configuration}`);
      }
      for (const { method, handler } of configuration) {
        if (typeof method !== "string") throw new Error(`Failed to load ${path.join(root_path, path_prefix, item.name)}: Method must be a string, but got ${typeof method}`);
        if (typeof handler !== "function") throw new Error(`Failed to load ${path.join(root_path, path_prefix, item.name)}: Handler must be a function, but got ${typeof handler}`);
        const method_path = `${method.toUpperCase()} ${api_path}`;
        if (!registered_paths.includes(method_path.toLowerCase())) {
          registered_paths.push(method_path.toLowerCase());
          const packed_handler = async (ctx: Koa.Context) => {
            try {
              await handler(ctx);
            } catch (e: any) {
              const { res } = ctx;
              logger.e(`Failed to handle ${method_path}: ${e.message}`);
              logger.e(e.stack);
              if (!res.headersSent) stdrtn.server_error(res);
            }
          };
          switch (method.toLowerCase()) {
            case "get":
              router.get(api_path, packed_handler);
              break;
            case "post":
              router.post(api_path, packed_handler);
              break;
            case "put":
              router.put(api_path, packed_handler);
              break;
            case "delete":
              router.delete(api_path, packed_handler);
              break;
            case "patch":
              router.patch(api_path, packed_handler);
              break;
            case "options":
              router.options(api_path, packed_handler);
              break;
            case "head":
              router.head(api_path, packed_handler);
              break;
            default:
              throw new Error(`Failed to load ${path.join(root_path, path_prefix, item.name)}: Unknown method ${method}`);
          }
          logger.d(`${method_path} => ${path.join(root_path, path_prefix, item.name)}`);
        } else {
          throw new Error(`Failed to load ${path.join(root_path, path_prefix, item.name)}: ${method_path} is already registered`);
        }
      }
    }
  };

  const handle_directory = (item: fs.Dirent, path_prefix: string) => {
    const sub_path = `${path_prefix}${item.name.replace(/^_/, ":")}/`;
    let sub_items = fs.readdirSync(path.join(root_path, path_prefix.split(/[/\\]/).map(i => i.replace(/^:/, "_")).join("/"), item.name), { withFileTypes: true });
    sub_items = sub_items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return 1;
      if (!a.isDirectory() && b.isDirectory()) return -1;
      return a.name.localeCompare(b.name);
    });
    sub_items = sub_items.sort((a, b) => {
      if (b.name.startsWith("_")) return -1;
      if (a.name.startsWith("_")) return 1;
      return 0;
    });
    for (const sub_item of sub_items) {
      if (sub_item.isDirectory()) {
        handle_directory(sub_item, sub_path);
      } else {
        handle_file(sub_item, sub_path);
      }
    }
  };

  // Load all router scripts
  try {
    let items = fs.readdirSync(path.join(root_path), { withFileTypes: true });
    items = items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return 1;
      if (!a.isDirectory() && b.isDirectory()) return -1;
      return a.name.localeCompare(b.name);
    });
    for (const item of items) {
      if (item.isDirectory()) {
        try {
          handle_directory(item, "/");
        } catch (e: any) {
          logger.e(`An error occurred while loading routes: ${e}\n${e.stack}`);
        }
      } else {
        try {
          handle_file(item, "/");
        } catch (e: any) {
          logger.e(`An error occurred while loading routes: ${e}\n${e.stack}`);
        }
      }
    }
  } catch (e: any) {
    logger.e(`An error occurred while loading routes: ${e}\n${e.stack}`);
  }
}