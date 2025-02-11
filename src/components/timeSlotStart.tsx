import React from "react";
import { FiClock } from "react-icons/fi";

interface TimeSlotProps {
  timeSlot: string;
  setTimeSlot: (value: string) => void;
  date: Date | null;
}

const TimeSlotInputStart: React.FC<TimeSlotProps> = ({ timeSlot, setTimeSlot, date }) => {
  const getISTTime = (): string => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().slice(11, 16);
  };

  const currentTimeIST = getISTTime();

  const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : null;
  
  const isToday = validDate ? validDate.toDateString() === new Date().toDateString() : false;

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
        <FiClock className={`mr-2 ${date ? "text-blue-500" : "text-gray-400"}`} />
        Time Slot Start:
      </label>
      <input
        type="time"
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        required
        disabled={!validDate}
        min={isToday ? currentTimeIST : undefined}
        className={`w-full p-3 border rounded-md transition ease-in-out duration-200 
          ${validDate ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                 : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"}`}
      />
    </div>
  );
};

export default TimeSlotInputStart;
