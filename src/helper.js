import dayjs from "dayjs";

export const removeUnknownCharacters = (character) => {
  return character?.replaceAll("&quot;", `"`).replaceAll("&amp;", `&`).replaceAll("&lt", `<`).replaceAll("&gt", `>`).replaceAll("&#039", `'`);
};

export function formatRelativeTime(date) {
  const now = dayjs();
  const diffInSeconds = now.diff(date, "second");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes}m`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours}h`;
  } else if (diffInSeconds < 2592000) {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return diffInDays < 28 ? `${diffInDays}d` : `${Math.floor(diffInDays / 7)}w`;
  } else {
    const diffInMonths = Math.floor(diffInSeconds / 2592000);
    return diffInMonths < 12 ? `${diffInMonths}m` : `${Math.floor(diffInMonths / 12)}y`;
  }
}
