import React from "react";

export function Input({ type = "text", value, onChange, placeholder, className = "", ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 w-full ${className}`}
      {...props}
    />
  );
}
