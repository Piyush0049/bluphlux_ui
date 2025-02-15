import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import toast from "react-hot-toast";

export interface InterviewEvent {
  id: string;
  candidate: string;
  interviewer: string;
  date: Date | null;
  timeSlotStart: string;
  timeSlotEnd: string;
  interviewType: "Technical" | "HR" | "Behavioral";
  start: Date;
  end: Date;
  title?: string;
}

interface EventInteractionArgs {
  event: InterviewEvent;
  start: Date | string;
  end: Date | string;
  revert?: () => void;
}

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop<InterviewEvent, {}>(Calendar);

interface InterviewCalendarProps {
  events: InterviewEvent[];
  onEventUpdate: (updatedEvent: InterviewEvent) => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({ events, onEventUpdate }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const adjustedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const handleEventDrop = (args: EventInteractionArgs) => {
    const { event, start: newStartInput, end: newEndInput, revert } = args;
    const newStart = newStartInput instanceof Date ? newStartInput : new Date(newStartInput);
    const newEnd = newEndInput instanceof Date ? newEndInput : new Date(newEndInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    if (newStart < today) {
      toast.error("Cannot drop an event on a past date.");
      if (revert) revert();
      return;
    }
    if (newStart.toDateString() === now.toDateString() && newStart < now) {
      toast.error("Cannot drop an event on today's date if its start time has already passed.");
      if (revert) revert();
      return;
    }
    const existingEvent = events.find((e) => e.id === event.id);
    if (!existingEvent) {
      if (revert) revert();
      return;
    }
    if (!existingEvent.candidate || !existingEvent.interviewer) {
      toast.error("Both candidate and interviewer must be selected for this event.");
      if (revert) revert();
      return;
    }
    const newTimeSlotStart = format(newStart, "HH:mm");
    let conflictFound = false;
    events.forEach((e) => {
      if (e.id === event.id) return;
      if (!e.date) return;
      const eDate = new Date(e.date);
      if (eDate.toDateString() !== newStart.toDateString()) return;
      if (e.timeSlotStart === newTimeSlotStart) {
        if (e.candidate === existingEvent.candidate || e.interviewer === existingEvent.interviewer) {
          conflictFound = true;
        }
      }
    });
    if (conflictFound) {
      toast.error("Conflict: Candidate or Interviewer already has an interview scheduled at this start time on the selected date.");
      if (revert) revert();
      return;
    }
    const updatedEvent: InterviewEvent = {
      ...existingEvent,
      date: newStart,
      start: newStart,
      end: newEnd,
    };
    onEventUpdate(updatedEvent);
    const storedData = localStorage.getItem("secondaryinterviews");
    if (storedData) {
      const storedEvents: InterviewEvent[] = JSON.parse(storedData);
      const index = storedEvents.findIndex((e) => e.id === updatedEvent.id);
      if (index !== -1) {
        storedEvents[index] = updatedEvent;
      } else {
        storedEvents.push(updatedEvent);
      }
      localStorage.setItem("secondaryinterviews", JSON.stringify(storedEvents));
    }
  };

  const handleEventClick = (event: InterviewEvent, e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    navigate(`/edit/${event.id}`);
  };

  return (
    <div className="bg-transparent md:bg-white p-0 md:p-6 md:shadow-lg rounded-2xl md:border md:border-gray-300 transition duration-300 transform hover:scale-105">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 md:p-5 rounded-lg shadow-md flex justify-between items-center text-sm md:text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
        <h2 className="font-bold tracking-wide flex items-center gap-2 text-white">📅 InterviewEvent Calendar</h2>
      </div>
      <div className="mt-4 md:mt-5 border border-gray-300 rounded-xl shadow-md bg-gray-50 p-2 md:p-3 overflow-hidden">
        <div className="overflow-auto md:overflow-hidden">
          <DnDCalendar
            localizer={localizer}
            events={adjustedEvents}
            startAccessor={(event: InterviewEvent) => event.start}
            endAccessor={(event: InterviewEvent) => event.end}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            view={view}
            onView={(newView) => setView(newView)}
            onEventDrop={handleEventDrop}
            draggableAccessor={() => true}
            resizableAccessor={() => true}
            style={{ height: "auto", minHeight: 400, maxHeight: 600 }}
            className="rounded-lg text-xs md:text-base"
            onSelectEvent={(event, e) => handleEventClick(event, e)}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewCalendar;
