import React from "react";
import { FiClock } from "react-icons/fi";
import { parse, format } from "date-fns";

interface TimeSlotProps {
  timeSlot: string;
  setTimeSlot: (value: string) => void;
  date: Date | null;
}

const TimeSlotInputStart: React.FC<TimeSlotProps> = ({ timeSlot, setTimeSlot, date }) => {
  // Function to get current IST time in HH:mm format
  const getISTTime = (): string => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().slice(11, 16);
  };

  const currentTimeIST = getISTTime();

  // Validate the provided date
  const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : null;

  // Check if the selected date is today
  const isToday = validDate ? validDate.toDateString() === new Date().toDateString() : false;

  // Convert a time string in 24-hour format to AM/PM format
  const convertToAmPm = (time: string): string => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  // Generate half-hour slots for the day.
  // If the selected date is today, skip slots earlier than the current time.
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        if (isToday && value < currentTimeIST) continue; // Skip past slots for today
        slots.push(value);
      }
    }
    return slots;
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
        <FiClock className={`mr-2 ${date ? "text-blue-500" : "text-gray-400"}`} />
        Time Slot Start:
      </label>
      <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        required
        disabled={!validDate}
        className={`w-full p-3 border rounded-md transition ease-in-out duration-200 
          ${validDate ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"}`}
      >
        <option value="">Select Time Slot</option>
        {generateTimeSlots().map((slot, index) => (
          <option key={index} value={slot}>
            {convertToAmPm(slot)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotInputStart;
