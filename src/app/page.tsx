"use client";

import { useEffect, useState } from "react";
import ModuleForm from "@/components/ModuleForm";
import ScheduleViewComponent from "@/components/ScheduleView";
import { loadModules, saveModules } from "@/utils/cache";
import { Module } from "@/types";

export default function Home() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    setModules(loadModules());
  }, []);

  useEffect(() => {
    saveModules(modules);
  }, [modules]);

  const resetAll = () => {
    if (confirm("Möchtest du wirklich alle Module löschen?")) {
      setModules([]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">📚 Uni Stundenplaner</h1>

      <ModuleForm modules={modules} setModules={setModules} />

      <button
        onClick={resetAll}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Alle löschen
      </button>

      <div className="mt-6">
        <ScheduleViewComponent modules={modules} />
      </div>
    </div>
  );
}
