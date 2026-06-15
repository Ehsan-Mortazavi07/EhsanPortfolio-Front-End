import { PATHS } from "./PATHS";
import { PUBLIC_NAV } from "./nav";

export const FOOTER_NAV = PUBLIC_NAV.filter((item) => item.href !== PATHS.BLOG);
