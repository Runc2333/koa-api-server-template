import Koa from "koa";

export const check_response_sent = (res: Koa.Context["res"]) => {
  if (res.headersSent) {
    throw new Error("Response has already been sent.");
  }
};

export const success = (res: Koa.Context["res"], data: any = null) => {
  check_response_sent(res);
  if (data === null) {
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify({
      ret: 0,
      message: "ok",
    }));
  } else {
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify({
      ret: 0,
      message: "ok",
      data: data,
    }));
  }
};

export const fail = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -1,
    message: msg,
  }));
};

export const permission_denied = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -401,
    message: msg ?? "无权限",
  }));
};

export const session_expired = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -403,
    message: msg ?? "会话已过期",
  }));
};

export const not_found = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10000,
    message: msg ?? "请求的资源未找到",
  }));
};

export const param_error = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10001,
    message: msg ?? "请求不合法",
  }));
};

export const server_error = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10002,
    message: msg ?? "服务器内部错误",
  }));
};

export const unknown_error = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10003,
    message: msg ?? "未知错误",
  }));
};

export const signature_error = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10004,
    message: msg ?? "签名无效",
  }));
};

export const not_implemented = (res: Koa.Context["res"], msg?: string) => {
  check_response_sent(res);
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.statusCode = 200;
  res.end(JSON.stringify({
    ret: -10005,
    message: msg ?? "功能未实现",
  }));
};

const stdrtn = {
  success,
  fail,
  permission_denied,
  session_expired,
  not_found,
  param_error,
  server_error,
  unknown_error,
  signature_error,
  not_implemented,
};

export default stdrtn;