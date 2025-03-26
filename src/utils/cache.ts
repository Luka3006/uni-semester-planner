import { Module } from "@/types";

export const saveModules = (modules: Module[]) => {
  localStorage.setItem("modules", JSON.stringify(modules));
};

export const loadModules = (): Module[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("modules");
  return stored ? JSON.parse(stored) : [];
};
