export interface Event {
  id: string;
  day: string;
  startTime: number;
  endTime: number;
  title: string;
  color: string;
  favorite?: boolean;
  hidden?: boolean;
  editing?: boolean;
}

export interface Module {
  id: string;
  name: string;
  color: string;
  events: Event[];
  hidden?: boolean;
  editing?: boolean;
}
