"use client";

import {
  Briefcase,
  Chart,
  DocumentText,
  Folder,
  HamburgerMenu,
  Home,
  Layer,
  Logout,
  MessageText,
  Profile2User,
  Setting2,
  Sms,
  Star1,
} from "iconsax-reactjs";
import { Button, Drawer, Separator, useOverlayState } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/common/brand/Logo";
import { LocaleSwitcher } from "@/components/common/preferences/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/common/preferences/ThemeSwitcher";
import { PublicShell } from "@/components/common/shell";
import { useTranslation } from "@/common/i18n/useTranslation";
import { PATHS } from "@/common/constants";
import { useAppDispatch } from "@/stores/hooks";
import { logOutAction } from "@/stores/auth/actions";

const adminLinks = [
  { href: PATHS.ADMIN, labelKey: "admin.dashboard" as const, Icon: Chart },
  { href: PATHS.ADMIN_PROJECTS, labelKey: "admin.projects" as const, Icon: Folder },
  { href: PATHS.ADMIN_SERVICES, labelKey: "admin.services" as const, Icon: Layer },
  { href: PATHS.ADMIN_EXPERIENCE, labelKey: "admin.experience" as const, Icon: Briefcase },
  { href: PATHS.ADMIN_SKILLS, labelKey: "admin.skills" as const, Icon: Star1 },
  { href: PATHS.ADMIN_TESTIMONIALS, labelKey: "admin.testimonials" as const, Icon: MessageText },
  { href: PATHS.ADMIN_ARTICLES, labelKey: "admin.articles" as const, Icon: DocumentText },
  { href: PATHS.ADMIN_CONTACT_MESSAGES, labelKey: "admin.messages" as const, Icon: Sms },
  { href: PATHS.ADMIN_USERS, labelKey: "admin.users" as const, Icon: Profile2User },
  { href: PATHS.ADMIN_SETTINGS, labelKey: "admin.settings" as const, Icon: Setting2 },
] as const;

function NavButtons({
  pathname,
  onNavigate,
  vertical,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  vertical?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className={vertical ? "flex flex-col gap-1" : "hidden lg:flex lg:flex-col lg:gap-1"}>
      {adminLinks.map(({ href, labelKey, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Button
            key={href}
            fullWidth
            variant="ghost"
            className={`admin-nav-btn ${active ? "admin-nav-btn--active" : ""}`}
            onPress={() => onNavigate(href)}
          >
            <Icon size={18} variant={active ? "Bold" : "Linear"} />
            {t(labelKey)}
          </Button>
        );
      })}
    </div>
  );
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const drawer = useOverlayState();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  function go(href: string) {
    router.push(href);
    drawer.close();
  }

  function handleLogout() {
    dispatch(logOutAction());
    drawer.close();
    router.push(PATHS.SIGN_IN);
  }

  return (
    <PublicShell>
      <div className="admin-frame site-frame">
        <aside className="admin-sidebar">
          <div className="mb-6 px-2">
            <Logo light />
            <p className="admin-panel-subtitle mt-3">{t("admin.panel")}</p>
          </div>
          <NavButtons pathname={pathname} onNavigate={go} vertical />
          <div className="mt-auto px-1 pt-4">
            <Button fullWidth variant="ghost" className="admin-nav-btn admin-logout-btn" onPress={handleLogout}>
              <Logout size={18} variant="Linear" />
              {t("admin.logout")}
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="admin-header-bar sticky top-0 z-40">
            <div className="flex h-14 items-center justify-between gap-2 px-4 lg:px-6">
              <div className="flex items-center gap-2 lg:hidden">
                <Button isIconOnly size="sm" variant="secondary" aria-label={t("admin.navigation")} onPress={drawer.open}>
                  <HamburgerMenu size={20} variant="Linear" />
                </Button>
                <p className="text-sm font-bold">{t("admin.panel")}</p>
              </div>
              <p className="admin-panel-subtitle hidden lg:block">{t("admin.dashboardSubtitle")}</p>
              <div className="flex items-center gap-1">
                <ThemeSwitcher chrome />
                <LocaleSwitcher chrome />
                <Button size="sm" variant="ghost" className="admin-chrome-btn" onPress={() => router.push(PATHS.HOME)}>
                  <Home size={16} variant="Linear" />
                  <span className="hidden sm:inline">{t("admin.site")}</span>
                </Button>
                <Button size="sm" variant="ghost" className="admin-chrome-btn" onPress={handleLogout}>
                  <Logout size={16} variant="Linear" />
                  <span className="hidden sm:inline">{t("admin.logout")}</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="admin-main flex-1 overflow-auto px-4 py-8 lg:px-8">{children}</main>
        </div>
      </div>

      <Drawer state={drawer}>
        <Drawer.Backdrop className="bg-black/50">
          <Drawer.Content placement="left" className="max-w-[17rem] border-e border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar-bg)] text-[var(--admin-chrome-fg)]">
            <Drawer.Dialog>
              <Drawer.Header>
                <Drawer.Heading>{t("admin.navigation")}</Drawer.Heading>
                <Drawer.CloseTrigger />
              </Drawer.Header>
              <Separator />
              <Drawer.Body className="flex flex-col p-3">
                <NavButtons pathname={pathname} onNavigate={go} vertical />
                <Button fullWidth variant="ghost" className="admin-nav-btn admin-logout-btn mt-4" onPress={handleLogout}>
                  <Logout size={18} variant="Linear" />
                  {t("admin.logout")}
                </Button>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </PublicShell>
  );
}
