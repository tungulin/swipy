import type { Icon as TablerIcon } from "@tabler/icons-react";

import {
  IconBook,
  IconChartLine,
  IconHome,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { NavLink } from "react-router";

import { cn } from "@/shared/lib/shadcn-utils";

const NAV_ITEMS = [
  { to: "/", label: "Учить", icon: IconHome },
  { to: "/words", label: "Слова", icon: IconBook },
  { to: "/progress", label: "Прогресс", icon: IconChartLine },
  { to: "/friends", label: "Друзья", icon: IconUsers },
  { to: "/profile", label: "Профиль", icon: IconUser },
];

export const Footer = () => (
  <footer className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
    <nav className="mx-auto rounded-t-3xl border-x border-t bg-card/90 backdrop-blur-md xl:max-w-[85rem]">
      <ul className="grid h-18 grid-cols-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              className={(props) =>
                cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                  props.isActive && "text-blue hover:text-blue",
                )
              }
              end={to === "/"}
              to={to}
            >
              {(props) => (
                <>
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full transition-colors",
                      props.isActive && "bg-blue/15 ring-2 ring-blue",
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </footer>
);
