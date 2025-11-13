import type { KeyboardEvent } from "react";

export const KeyboardKeys = {
  Enter: "Enter",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
} as const;

export function handleKeyboardNavigation(
  event: KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
  }
) {
  switch (event.key) {
    case KeyboardKeys.Enter:
      handlers.onEnter?.();
      break;
    case KeyboardKeys.Escape:
      handlers.onEscape?.();
      break;
    case KeyboardKeys.ArrowUp:
      handlers.onArrowUp?.();
      break;
    case KeyboardKeys.ArrowDown:
      handlers.onArrowDown?.();
      break;
  }
}
