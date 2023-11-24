import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useRef } from "react";
import "./calendar.css";

export default function FullCalendarTimeLineView() {
  const myRef = useRef();
  function MyAddEvent(e) {
    console.log(e.resource.id);
    var event1 = {
      title: "MyEvent",
      start: e.date,
      id: "a",
      resourceId: e.resource.id,
      display: "auto",
      title: "Auditorium A",
      color: "#ff9f89",
    };
    myRef.current.getApi().addEvent(event1);
  }
  function MyEventClick(info) {
    console.log(info.view);
    console.log(info);
    console.log(info.el.fcSeg);
    alert(info.event.start + "-" + info.event.end);
  }
  function MyDropEvent(e) {
    console.log(e.event.start);
    console.log(e.event.end);
  }
  return (
    <FullCalendar
      //   themeSystem="asd"

      ref={myRef}
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      plugins={[resourceTimelinePlugin, interactionPlugin]}
      initialView="resourceTimeline"
      //   selectable={true}
      editable={true}
      events={[
        {
          // this object will be "parsed" into an Event Object
          title: "The Title", // a property!
          start: "2023-11-21T09:00:00+08:00", // a property!
          end: "2023-11-21T10:00:00+08:00", // a property! ** see important note below about 'end' **
          id: "a",
          resourceId: "a",
          display: "auto",
          title: "tetet",
          color: "#ff9f89",
        },
      ]}
      eventDrop={MyDropEvent}
      //   dateClick={MyAddEvent}
      eventClick={MyEventClick}
      resources={[
        { id: "a", building: "asd", title: "Auditorium A" },
        { id: "b", building: "asd", title: "Auditorium B" },
        { id: "c", building: "asd", title: "Auditorium C" },
        { id: "d", building: "asd", title: "Auditorium D" },
        { id: "e", building: "asd", title: "Auditorium E" },
        { id: "f", building: "asd", title: "Auditorium F" },
        { id: "g", building: "564 Pacific", title: "Auditorium G" },
        { id: "h", building: "564 Pacific", title: "Auditorium H" },
        { id: "i", building: "564 Pacific", title: "Auditorium I" },
        { id: "j", building: "564 Pacific", title: "Auditorium J" },
        { id: "k", building: "564 Pacific", title: "Auditorium K" },
        { id: "l", building: "564 Pacific", title: "Auditorium L" },
        { id: "m", building: "564 Pacific", title: "Auditorium M" },
        { id: "n", building: "564 Pacific", title: "Auditorium N" },
        { id: "o", building: "101 Main St", title: "Auditorium O" },
        { id: "p", building: "101 Main St", title: "Auditorium P" },
        { id: "q", building: "101 Main St", title: "Auditorium Q" },
        { id: "r", building: "101 Main St", title: "Auditorium R" },
        { id: "s", building: "101 Main St", title: "Auditorium S" },
        { id: "t", building: "101 Main St", title: "Auditorium T" },
        { id: "u", building: "101 Main St", title: "Auditorium U" },
        { id: "v", building: "101 Main St", title: "Auditorium V" },
        { id: "w", building: "101 Main St", title: "Auditorium W" },
        { id: "x", building: "101 Main St", title: "Auditorium X" },
        { id: "y", building: "101 Main St", title: "Auditorium Y" },
        { id: "z", building: "101 Main St", title: "Auditorium Z" },
      ]}
    />
  );
}
