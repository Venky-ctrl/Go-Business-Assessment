const AUTH_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin";

export async function loginUser(email, password) {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    // e.g. { message: "Invalid email or password" }
    throw new Error(responseJson.message || "Login failed");
  }

  // success
  return responseJson.data.token;
}
