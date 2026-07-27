"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./button";

interface DialogProps {
  triggerLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Dialog({ triggerLabel, title, description, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button ref={triggerRef} variant="secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="ui-dialog-backdrop" onMouseDown={close}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className="ui-dialog"
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ui-dialog-header">
              <h2 id={titleId} className="ui-dialog-title">{title}</h2>
              {description ? (
                <p id={descriptionId} className="ui-dialog-description">{description}</p>
              ) : null}
            </div>
            <div className="ui-stack">{children}</div>
            <div className="ui-row">
              <Button variant="secondary" onClick={close}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

interface DropdownItem {
  label: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export function DropdownMenu({ triggerLabel, items }: { triggerLabel: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="ui-dropdown">
      <Button
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        {triggerLabel}
      </Button>
      {open ? (
        <div id={menuId} role="menu" className="ui-dropdown-menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="ui-dropdown-item"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <span className="ui-tooltip" tabIndex={0} aria-describedby={id}>
      {children}
      <span id={id} role="tooltip" className="ui-tooltip-content">
        {label}
      </span>
    </span>
  );
}
