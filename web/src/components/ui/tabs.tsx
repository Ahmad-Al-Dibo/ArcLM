"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, defaultId }: { items: TabItem[]; defaultId?: string }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));

  function selectByIndex(index: number) {
    const next = items[(index + items.length) % items.length];
    setActiveId(next.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectByIndex(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectByIndex(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectByIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectByIndex(items.length - 1);
    }
  }

  return (
    <div className="ui-tabs">
      <div role="tablist" aria-label="Design system tabs" className="ui-tab-list" onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              id={`${baseId}-${item.id}-tab`}
              type="button"
              role="tab"
              className="ui-tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${item.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) =>
        item.id === activeId ? (
          <div
            key={item.id}
            id={`${baseId}-${item.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-${item.id}-tab`}
          >
            {item.content}
          </div>
        ) : null
      )}
    </div>
  );
}
