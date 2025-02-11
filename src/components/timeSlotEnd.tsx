import React, { useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { parse, format, addMinutes } from "date-fns";

interface TimeSlotProps {
  timeSlot: string;
  timeSlotStart: string;
  setTimeSlot: (value: string) => void;
  date: Date | null;
}

const TimeSlotInputEnd: React.FC<TimeSlotProps> = ({
  timeSlot,
  timeSlotStart,
  setTimeSlot,
  date,
}) => {
  // Helper to compute the next half-hour slot from a given time
  const computeNextHalfHour = (start: string): string => {
    try {
      const parsed = parse(start, "HH:mm", new Date());
      const nextTime = addMinutes(parsed, 30);
      // If nextTime goes into the next day, you may choose to handle it differently.
      return format(nextTime, "HH:mm");
    } catch (error) {
      return "";
    }
  };

  // When timeSlotStart changes, update timeSlot automatically
  useEffect(() => {
    if (timeSlotStart) {
      const nextSlot = computeNextHalfHour(timeSlotStart);
      setTimeSlot(nextSlot);
    } else {
      setTimeSlot("");
    }
  }, [timeSlotStart, setTimeSlot]);

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
        <FiClock className={`mr-2 ${date ? "text-blue-500" : "text-gray-400"}`} />
        Time Slot End:
      </label>
      <input
        type="time"
        value={timeSlot}
        readOnly
        disabled
        className="w-full p-3 border rounded-md bg-gray-100 text-gray-400"
      />
    </div>
  );
};

export default TimeSlotInputEnd;
