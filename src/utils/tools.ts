export function bytesToReadableSize (bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

export async function sleep (ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}