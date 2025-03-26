"use client";

import { useState } from "react";
import { Module, Event } from "@/types";
import {
  IconTrash,
  IconStar,
  IconEye,
  IconEyeOff,
  IconPencil,
} from "@tabler/icons-react";

interface Props {
  modules: Module[];
  setModules: (modules: Module[]) => void;
}

const randomHexColor = () =>
  "#" +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");

export default function ModuleForm({ modules, setModules }: Props) {
  const [moduleName, setModuleName] = useState("");
  const [moduleColor, setModuleColor] = useState(randomHexColor());

  const [eventTitle, setEventTitle] = useState("");
  const [eventDay, setEventDay] = useState("Montag");
  const [eventStart, setEventStart] = useState("08:00");
  const [eventEnd, setEventEnd] = useState("10:00");
  const [selectedModuleId, setSelectedModuleId] = useState("");

  const addModule = () => {
    const newModule: Module = {
      id: crypto.randomUUID(),
      name: moduleName,
      color: moduleColor,
      events: [],
    };
    setModules([...modules, newModule]);
    setModuleName("");
    setModuleColor(randomHexColor());
  };

  const timeToNumber = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
  };

  const addEventToModule = () => {
    setModules(
      modules.map((mod) => {
        if (mod.id === selectedModuleId) {
          const newEvent: Event = {
            id: crypto.randomUUID(),
            day: eventDay,
            startTime: timeToNumber(eventStart),
            endTime: timeToNumber(eventEnd),
            title: eventTitle,
            color: mod.color,
          };
          return { ...mod, events: [...mod.events, newEvent] };
        }
        return mod;
      })
    );
    setEventTitle("");
  };

  // Favorisieren korrigiert
  const toggleFavorite = (moduleId: string, eventId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              events: m.events.map((e) =>
                e.id === eventId ? { ...e, favorite: !e.favorite } : e
              ),
            }
          : m
      )
    );
  };

  // Löschen mit Bestätigung (Modul)
  const deleteModule = (id: string) => {
    if (confirm("Modul wirklich löschen?")) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  // Löschen mit Bestätigung (Event)
  const deleteEvent = (moduleId: string, eventId: string) => {
    if (confirm("Event wirklich löschen?")) {
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                events: m.events.filter((e) => e.id !== eventId),
              }
            : m
        )
      );
    }
  };

  // Sichtbarkeit (Modul)
  const toggleModuleVisibility = (moduleId: string) => {
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, hidden: !m.hidden } : m))
    );
  };

  // Sichtbarkeit (Event)
  const toggleEventVisibility = (moduleId: string, eventId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              events: m.events.map((e) =>
                e.id === eventId ? { ...e, hidden: !e.hidden } : e
              ),
            }
          : m
      )
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md space-y-6 text-black">
      {/* Modul hinzufügen */}
      <div>
        <h2 className="font-bold mb-2">Modul hinzufügen</h2>
        <input
          type="text"
          placeholder="Modulname"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="color"
          value={moduleColor}
          onChange={(e) => setModuleColor(e.target.value)}
          className="mr-2"
        />
        <button
          onClick={addModule}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Modul hinzufügen
        </button>
      </div>

      {/* Event hinzufügen */}
      <div>
        <h2 className="font-bold mb-2">Event hinzufügen</h2>
        <select
          className="border p-2 rounded mr-2"
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
        >
          <option value="">Wähle Modul...</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded mr-2"
          value={eventDay}
          onChange={(e) => setEventDay(e.target.value)}
        >
          {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
            (day) => (
              <option key={day} value={day}>
                {day}
              </option>
            )
          )}
        </select>
        <input
          type="time"
          className="border p-2 rounded mr-2"
          value={eventStart}
          onChange={(e) => setEventStart(e.target.value)}
        />
        <input
          type="time"
          className="border p-2 rounded mr-2"
          value={eventEnd}
          onChange={(e) => setEventEnd(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded mr-2"
          placeholder="Event-Titel"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <button
          onClick={addEventToModule}
          disabled={!selectedModuleId || !eventTitle}
          className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Event hinzufügen
        </button>
      </div>

      {/* Module & Events anzeigen */}
      <div className="space-y-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-2 rounded shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded"
                  style={{ background: mod.color }}
                />
                {mod.editing ? (
                  <input
                    value={mod.name}
                    onChange={(e) =>
                      setModules(
                        modules.map((m) =>
                          m.id === mod.id ? { ...m, name: e.target.value } : m
                        )
                      )
                    }
                    onBlur={() =>
                      setModules(
                        modules.map((m) =>
                          m.id === mod.id ? { ...m, editing: false } : m
                        )
                      )
                    }
                    className="border rounded p-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="font-semibold">{mod.name}</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setModules(
                      modules.map((m) =>
                        m.id === mod.id ? { ...m, editing: !m.editing } : m
                      )
                    )
                  }
                >
                  <IconPencil size={18} className="text-blue-500" />
                </button>
                <button onClick={() => toggleModuleVisibility(mod.id)}>
                  {mod.hidden ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
                <button onClick={() => deleteModule(mod.id)}>
                  <IconTrash size={18} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Events */}
            <ul className="mt-2 pl-6 space-y-1">
              {mod.events.map((ev) => (
                <li key={ev.id} className="flex justify-between items-center">
                  <div>
                    {ev.editing ? (
                      <input
                        value={ev.title}
                        onChange={(e) =>
                          setModules(
                            modules.map((m) =>
                              m.id === mod.id
                                ? {
                                    ...m,
                                    events: m.events.map((event) =>
                                      event.id === ev.id
                                        ? { ...event, title: e.target.value }
                                        : event
                                    ),
                                  }
                                : m
                            )
                          )
                        }
                        onBlur={() =>
                          setModules(
                            modules.map((m) =>
                              m.id === mod.id
                                ? {
                                    ...m,
                                    events: m.events.map((event) =>
                                      event.id === ev.id
                                        ? { ...event, editing: false }
                                        : event
                                    ),
                                  }
                                : m
                            )
                          )
                        }
                        className="border rounded p-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span>
                        {ev.day} ({ev.startTime.toFixed(2).replace(".", ":")} -{" "}
                        {ev.endTime.toFixed(2).replace(".", ":")} Uhr):{" "}
                        {ev.title}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleFavorite(mod.id, ev.id)}>
                      <IconStar
                        size={16}
                        className={
                          ev.favorite ? "text-yellow-500" : "text-gray-400"
                        }
                      />
                    </button>
                    <button
                      onClick={() => toggleEventVisibility(mod.id, ev.id)}
                    >
                      {ev.hidden ? (
                        <IconEyeOff size={16} />
                      ) : (
                        <IconEye size={16} />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setModules(
                          modules.map((m) =>
                            m.id === mod.id
                              ? {
                                  ...m,
                                  events: m.events.map((event) =>
                                    event.id === ev.id
                                      ? { ...event, editing: !event.editing }
                                      : event
                                  ),
                                }
                              : m
                          )
                        )
                      }
                    >
                      <IconPencil size={16} className="text-blue-500" />
                    </button>
                    <button onClick={() => deleteEvent(mod.id, ev.id)}>
                      <IconTrash size={16} className="text-red-500" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
