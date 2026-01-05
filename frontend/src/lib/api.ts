export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:4000";

export async function backendFetch(
  path: string,
  init: RequestInit & { authToken?: string } = {},
) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const { authToken, headers, ...rest } = init;

  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(headers || {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      "Content-Type":
        (headers as any)?.["Content-Type"] ?? "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Backend request failed (${res.status}): ${text || res.statusText}`,
    );
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return (await res.text()) as unknown;
}


