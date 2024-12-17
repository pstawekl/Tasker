import { cookies } from "next/headers";

export function getSidebarDefaultOpen() {
    const SIDEBAR_COOKIE_NAME = "sidebar:state";
    const cookieStore = cookies();
    return cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
}