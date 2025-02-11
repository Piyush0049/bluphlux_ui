import React from "react";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  date: Date | null;
  setDate: (value: Date | null) => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="flex items-center w-full p-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
    >
      <FiCalendar className="mr-2 text-blue-500" />
      <span className="text-gray-700">{value || "Select Date"}</span>
    </div>
  )
);

const DateInput: React.FC<DateInputProps> = ({ date, setDate }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700">Date:</label>
      <DatePicker
        selected={date}
        onChange={(date: Date | null) => setDate(date)}
        minDate={new Date()}
        customInput={<CustomInput />}
        calendarClassName="rounded-lg shadow-lg p-4 bg-white"
      />
    </div>
  );
};

export default DateInput;
