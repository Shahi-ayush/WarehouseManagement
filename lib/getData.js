
export async function getData(endpoint) {
  try {
    const url = endpoint.startsWith("/") ? `/api${endpoint}` : `/api/${endpoint}`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function postData(endpoint, body) {
  try {
    const url = endpoint.startsWith("/") ? `/api${endpoint}` : `/api/${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
