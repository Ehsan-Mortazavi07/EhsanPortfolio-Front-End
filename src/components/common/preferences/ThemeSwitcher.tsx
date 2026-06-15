"use client";

import { Button, Dropdown } from "@heroui/react";
import { Global, Moon, Sun1 } from "iconsax-reactjs";
import type { ThemeMode } from "@/common/i18n";
import { useTranslation } from "@/common/i18n/useTranslation";
import { changeTheme } from "@/stores/preferences/actions";
import { themeSelector } from "@/stores/preferences/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

type Props = {
  light?: boolean;
  chrome?: boolean;
};

const options: { id: ThemeMode; Icon: typeof Sun1 }[] = [
  { id: "light", Icon: Sun1 },
  { id: "dark", Icon: Moon },
  { id: "system", Icon: Global },
];

export function ThemeSwitcher({ light, chrome }: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(themeSelector);
  const { t } = useTranslation();
  const ActiveIcon = options.find((o) => o.id === theme)?.Icon ?? Moon;

  return (
    <Dropdown>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        aria-label={t("prefs.theme")}
        className={chrome ? "admin-chrome-btn site-chrome-btn" : light ? "site-chrome-btn" : ""}
      >
        <ActiveIcon size={18} variant="Linear" />
      </Button>
      <Dropdown.Popover className="min-w-[9rem]">
        <Dropdown.Menu
          aria-label={t("prefs.theme")}
          selectedKeys={[theme]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const id = Array.from(keys)[0] as ThemeMode | undefined;
            if (id) dispatch(changeTheme(id));
          }}
        >
          {options.map(({ id, Icon }) => (
            <Dropdown.Item key={id} id={id} textValue={t(`prefs.theme.${id}`)}>
              <span className="flex items-center gap-2">
                <Icon size={16} variant="Linear" />
                {t(`prefs.theme.${id}`)}
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
