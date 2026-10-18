import { IconQrcode, IconSettings, IconShare } from "@tabler/icons-react";
import { Link } from "react-router";

import { Button } from "@/shared/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-3 flex h-14 items-center justify-between xl:mx-auto xl:max-w-[85rem]">
        <Button
          aria-label="Настройки"
          nativeButton={false}
          render={<Link to="/settings" />}
          size="icon-lg"
          variant="ghost"
        >
          <IconSettings className="size-6" />
        </Button>

        <div className="flex items-center gap-1">
          <Button aria-label="Поделиться" size="icon-lg" variant="ghost">
            <IconShare className="size-6" />
          </Button>
          <Button aria-label="QR-код" size="icon-lg" variant="ghost">
            <IconQrcode className="size-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
