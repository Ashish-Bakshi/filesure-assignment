export const API = {
  async post(url: string, body: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  },

  async get(url: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  }
};
