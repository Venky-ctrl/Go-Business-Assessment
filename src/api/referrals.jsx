import Cookies from "js-cookie";

const REFERRALS_URL =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";

function buildHeaders() {
  const token = Cookies.get("jwt_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Full list, with optional search + sort
export async function fetchReferrals({ search, sort } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${REFERRALS_URL}${query}`, {
    headers: buildHeaders(),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(
      responseJson.message || `Request failed (${response.status})`,
    );
  }

  return responseJson.data;
}

// Single referral by id
export async function fetchReferralById(id) {
  const response = await fetch(`${REFERRALS_URL}?id=${id}`, {
    headers: buildHeaders(),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(
      responseJson.message || `Request failed (${response.status})`,
    );
  }

  return responseJson.data;
}
