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
  const computeNextHalfHour = (start: string): string => {
    try {
      const parsed = parse(start, "HH:mm", new Date());
      const nextTime = addMinutes(parsed, 30);
      return format(nextTime, "HH:mm");
    } catch (error) {
      return "";
    }
  };
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
