export function formatDate(isoDate) {
  // "YYYY-MM-DD" -> "YYYY/MM/DD"
  if (!isoDate) return "";
  return isoDate.replaceAll("-", "/");
}

export function formatProfit(amount) {
  // number -> "$1,234" (USD, no decimals, en-US)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
