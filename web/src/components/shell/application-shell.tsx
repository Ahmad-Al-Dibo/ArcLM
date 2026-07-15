"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge, Button } from "@/components/ui";
import {
  getBreadcrumbs,
  getNavigationItem,
  navigationItems,
  navigationSections,
  type NavigationItem
} from "@/config/navigation";
import { readStorage, writeStorage } from "@/lib/storage";
import { useInterfaceMode } from "@/providers/interface-mode-provider";
import { useTheme } from "@/providers/theme-provider";
import { sidebarStorageKey } from "./preference-keys";

function routeIsActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavigationStatus({ item }: { item: NavigationItem }) {
  if (item.status === "available") {
    return null;
  }
  return <Badge variant={item.status}>{item.status === "planned" ? "Planned" : "Experimental"}</Badge>;
}

function NavigationLink({
  item,
  pathname,
  collapsed,
  onNavigate
}: {
  item: NavigationItem;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const active = routeIsActive(pathname, item.href);
  const tooltipId = `nav-tip-${item.shortLabel.toLowerCase()}`;

  return (
    <Link
      href={item.href}
      className="app-nav-link"
      aria-current={active ? "page" : undefined}
      aria-describedby={collapsed ? tooltipId : undefined}
      onClick={onNavigate}
    >
      <span className="app-nav-mark" aria-hidden="true">
        {item.shortLabel}
      </span>
      <span className="app-nav-copy">
        <span>{item.title}</span>
        {!collapsed ? <NavigationStatus item={item} /> : null}
      </span>
      {collapsed ? (
        <span id={tooltipId} role="tooltip" className="app-nav-tooltip">
          {item.title}
        </span>
      ) : null}
    </Link>
  );
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = readStorage(sidebarStorageKey);
    return stored === "true";
  });

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    writeStorage(sidebarStorageKey, String(next));
  }

  return (
    <aside className="app-sidebar" data-collapsed={collapsed} aria-label="Primary navigation">
      <div className="app-sidebar-header">
        <Link href="/" className="app-wordmark" aria-label="ArcLM overview">
          <span className="app-wordmark-mark">A</span>
          {!collapsed ? <span>ArcLM</span> : null}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          {collapsed ? ">" : "<"}
        </Button>
      </div>
      <nav className="app-sidebar-nav" aria-label="Main">
        {navigationSections.map((section) => (
          <div className="app-nav-section" key={section}>
            {!collapsed ? <p className="app-nav-section-title">{section}</p> : null}
            {navigationItems
              .filter((item) => item.section === section)
              .map((item) => (
                <NavigationLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
              ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function MobileNavigation({
  pathname,
  open,
  onClose,
  triggerRef
}: {
  pathname: string;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, triggerRef]);

  function handleDrawerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !drawerRef.current) {
      return;
    }
    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="app-mobile-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        ref={drawerRef}
        className="app-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        tabIndex={-1}
        onKeyDown={handleDrawerKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="app-mobile-header">
          <span className="app-wordmark">
            <span className="app-wordmark-mark">A</span>
            <span>ArcLM</span>
          </span>
          <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={onClose}>
            x
          </Button>
        </div>
        <nav className="app-mobile-nav" aria-label="Mobile main">
          {navigationSections.map((section) => (
            <div className="app-nav-section" key={section}>
              <p className="app-nav-section-title">{section}</p>
              {navigationItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavigationLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
                ))}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ModeControl() {
  const { mode, setMode } = useInterfaceMode();
  return (
    <div className="app-segment" aria-label="Interface mode">
      <button
        type="button"
        aria-pressed={mode === "simple"}
        onClick={() => setMode("simple")}
      >
        Simple
      </button>
      <button
        type="button"
        aria-pressed={mode === "advanced"}
        onClick={() => setMode("advanced")}
      >
        Advanced
      </button>
    </div>
  );
}

function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  return (
    <label className="app-theme-select">
      <span>Theme</span>
      <select value={theme} onChange={(event) => setTheme(event.target.value as "system" | "light" | "dark")}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const breadcrumbs = getBreadcrumbs(pathname);
  return (
    <nav className="app-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {breadcrumbs.map((item, index) => {
          const current = index === breadcrumbs.length - 1;
          return (
            <li key={item.href}>
              {current ? (
                <span aria-current="page">{item.title}</span>
              ) : (
                <Link href={item.href}>{item.title}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function TopBar({
  pathname,
  onOpenMobile,
  triggerRef
}: {
  pathname: string;
  onOpenMobile: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const current = useMemo(() => getNavigationItem(pathname), [pathname]);

  return (
    <header className="app-topbar">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="app-mobile-trigger"
        aria-label="Open navigation"
        onClick={onOpenMobile}
      >
        =
      </Button>
      <div className="app-current-page">
        <p>{current.title}</p>
        <span>{current.description}</span>
      </div>
      <div className="app-topbar-actions">
        <ModeControl />
        <ThemeSelect />
      </div>
    </header>
  );
}

export function ApplicationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  function closeMobile() {
    setMobileOpen(false);
    mobileTriggerRef.current?.focus();
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="app-skip-link">
        Skip to main content
      </a>
      <DesktopSidebar pathname={pathname} />
      <MobileNavigation
        pathname={pathname}
        open={mobileOpen}
        onClose={closeMobile}
        triggerRef={mobileTriggerRef}
      />
      <div className="app-main-column">
        <TopBar
          pathname={pathname}
          onOpenMobile={() => setMobileOpen(true)}
          triggerRef={mobileTriggerRef}
        />
        <Breadcrumbs pathname={pathname} />
        <main id="main-content" className="app-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
