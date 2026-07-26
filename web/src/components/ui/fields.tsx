"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

interface FieldMeta {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
}

function FieldShell({
  id,
  label,
  description,
  error,
  required,
  children
}: FieldMeta & { id: string; children: ReactNode }) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={id}>
        {label} {required ? <span className="ui-required">*</span> : null}
      </label>
      {children}
      {description ? (
        <p id={descriptionId} className="ui-description">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ui-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, description?: string, error?: string) {
  return cn(description && `${id}-description`, error && `${id}-error`) || undefined;
}

export interface TextInputProps
  extends FieldMeta,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id?: string;
}

export function TextInput({ id: providedId, label, description, error, required, className, ...props }: TextInputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldShell id={id} label={label} description={description} error={error} required={required}>
      <input
        id={id}
        className={cn("ui-input", className)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, description, error)}
        {...props}
      />
    </FieldShell>
  );
}

export interface TextareaProps
  extends FieldMeta,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id?: string;
}

export function Textarea({ id: providedId, label, description, error, required, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldShell id={id} label={label} description={description} error={error} required={required}>
      <textarea
        id={id}
        className={cn("ui-textarea", className)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, description, error)}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectProps
  extends FieldMeta,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id?: string;
  children: ReactNode;
}

export function Select({ id: providedId, label, description, error, required, className, children, ...props }: SelectProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldShell id={id} label={label} description={description} error={error} required={required}>
      <select
        id={id}
        className={cn("ui-select", className)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, description, error)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export interface CheckboxProps
  extends FieldMeta,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id?: string;
}

export function Checkbox({ id: providedId, label, description, error, required, className, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="ui-check-row">
      <input
        id={id}
        type="checkbox"
        className={cn("ui-checkbox", className)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, description, error)}
        {...props}
      />
      <div className="ui-field">
        <label className="ui-label" htmlFor={id}>
          {label} {required ? <span className="ui-required">*</span> : null}
        </label>
        {description ? <p id={`${id}-description`} className="ui-description">{description}</p> : null}
        {error ? <p id={`${id}-error`} className="ui-error">{error}</p> : null}
      </div>
    </div>
  );
}

export interface SwitchProps extends FieldMeta {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ label, description, error, checked, defaultChecked = false, disabled, onCheckedChange }: SwitchProps) {
  const id = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  function toggle() {
    if (disabled) {
      return;
    }
    const next = !isChecked;
    setInternalChecked(next);
    onCheckedChange?.(next);
  }

  return (
    <div className="ui-check-row">
      <button
        id={id}
        type="button"
        role="switch"
        className="ui-switch"
        aria-checked={isChecked}
        aria-describedby={describedBy(id, description, error)}
        disabled={disabled}
        onClick={toggle}
      >
        <span className="ui-switch-thumb" aria-hidden="true" />
      </button>
      <div className="ui-field">
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
        {description ? <p id={`${id}-description`} className="ui-description">{description}</p> : null}
        {error ? <p id={`${id}-error`} className="ui-error">{error}</p> : null}
      </div>
    </div>
  );
}
