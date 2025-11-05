export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${baseUrl}${endpoint}`;
  console.log("🔹 API Request:", url, options);

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  let responseBody: any = null;
  try {
    responseBody = await res.json();
  } catch {
    // Kalau Laravel kirim HTML (error 419, 500, dll)
    const text = await res.text().catch(() => "");
    console.warn("⚠️ Non-JSON response:", text.slice(0, 300));
  }

  if (!res.ok) {
    console.error("❌ API Fetch Error", {
      status: res.status,
      statusText: res.statusText,
      body: responseBody,
    });

    const message =
      responseBody?.message ||
      `API Error (${res.status} ${res.statusText}) — lihat Network tab`;

    throw new Error(message);
  }

  return responseBody;
}
