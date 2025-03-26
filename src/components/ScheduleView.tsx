"use client";
import { createTheme, ScheduleView, CalendarEvent } from "react-schedule-view";
import { Module } from "@/types";
import { toJpeg, toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { IconDownload } from "@tabler/icons-react";
import { useRef } from "react";

interface Props {
  modules: Module[];
}

const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const CustomTileContent: React.FC<{ event: CalendarEvent }> = ({ event }) => (
  <div style={{ padding: "4px" }}>
    <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{event.title}</div>
    {event.description && (
      <div style={{ fontSize: "0.8rem" }}>{event.description}</div>
    )}
  </div>
);


const customTheme = createTheme("google", {
  hourHeight: "50px",
  timeFormatter: formatTime,
  style: {
    eventTiles: (event: any) => ({
      border: event.favorite ? "3px solid gold" : "none",
      boxSizing: "border-box",
    }),
  },
  themeTileContent: CustomTileContent,
});

export default function ScheduleViewComponent({ modules }: Props) {
  const scheduleRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (scheduleRef.current) {
      toJpeg(scheduleRef.current, {
        cacheBust: true,
      })
        .then((dataUrl) => {
          saveAs(dataUrl, "stundenplan.jpg");
        })
        .catch((err) => {
          console.error("Export fehlgeschlagen:", err);
        });
    }
  };

  const data = days.map((day) => ({
    name: day,
    events: modules.flatMap((mod) =>
      mod.hidden
        ? []
        : mod.events
            .filter((ev) => ev.day === day && !ev.hidden)
            .map((ev) => ({
              startTime: ev.startTime,
              endTime: ev.endTime,
              title: mod.name,
              description: `${ev.title} (${formatTime(ev.startTime)}–${formatTime(ev.endTime)})`,
              color: mod.color,
              favorite: ev.favorite,
            }))
    ),
  }));

  return (
    <div>
      <button
        onClick={handleExport}
        className="mb-4 bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
      >
        <IconDownload size={18} />
        Als Bild exportieren
      </button>

      <div ref={scheduleRef}>
        <ScheduleView
          daySchedules={data}
          viewStartTime={8}
          viewEndTime={20}
          theme={customTheme}
        />
      </div>
    </div>
  );
}
