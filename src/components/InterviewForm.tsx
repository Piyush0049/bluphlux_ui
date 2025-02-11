import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addInterview, updateInterview, Interview } from "../store/interviewSlice";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLayers, FiPlus, FiEdit3 } from "react-icons/fi";
import DateInput from "./datePicker";
import TimeSlotInputStart from "./timeSlotStart";
import TimeSlotInputEnd from "./timeSlotEnd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { parse, format } from "date-fns";


interface InterviewFormProps {
  existingInterview?: Interview;
  isEdit?: boolean;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ existingInterview, isEdit = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const interviews = useSelector((state: RootState) => state.interviews.interviews);

  const [candidate, setCandidate] = useState(existingInterview?.candidate || "");
  const [interviewer, setInterviewer] = useState(existingInterview?.interviewer || "");
  const [date, setDate] = useState<Date | null>(existingInterview?.date ?? null);
  const [timeSlotStart, setTimeSlotStart] = useState(existingInterview?.timeSlotStart || "");
  const [timeSlotEnd, setTimeSlotEnd] = useState(existingInterview?.timeSlotEnd || "");
  const [interviewType, setInterviewType] = useState<Interview["interviewType"] | "">(
    existingInterview?.interviewType || ""
  );
  const [error, setError] = useState("");

  // Helper function to add 10 minutes to a "HH:mm" string.
  const addTenMinutes = (time: string): string | null => {
    const [hoursStr, minutesStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const totalMinutes = hours * 60 + minutes + 10;
    if (totalMinutes >= 24 * 60) {
      return null;
    }
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  };

  const convertToAmPm = (time: string): string => {
    // Parse the time using a dummy date (today)
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  // When start time changes, update the start time and auto-set end time if needed.
  const handleTimeSlotStartChange = (value: string) => {
    setTimeSlotStart(value);
    // If no end time or end time is earlier than or equal to start, auto-update end time.
    if (!timeSlotEnd || timeSlotEnd <= value) {
      const newEnd = addTenMinutes(value);
      if (newEnd) {
        setTimeSlotEnd(newEnd);
      } else {
        setError("Start time too late to allow a 10 minute slot.");
      }
    }
  };

  const handleTimeSlotEndChange = (value: string) => {
    setTimeSlotEnd(value);
  };

  // Helper function: convert "HH:mm" to minutes from midnight.
  const timeToMinutes = (time: string): number => {
    const [hoursStr, minutesStr] = time.split(":");
    return parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If scheduling a new interview (not updating), check if recEmail exists.
    if (!isEdit) {
      const recEmail = localStorage.getItem("recEmail");
      if (!recEmail) {
        setError("Recipient email not found. Please set up your email notifications.");
        return;
      }
    }

    // Validate times only if scheduling (or if you want to validate for both)
    if (!timeSlotStart || !timeSlotEnd) {
      setError("Both start and end times are required.");
      return;
    }
    const startTotal = timeToMinutes(timeSlotStart);
    const endTotal = timeToMinutes(timeSlotEnd);
    if (endTotal <= startTotal) {
      setError("End time must be later than start time.");
      return;
    }
    if (endTotal - startTotal < 10) {
      setError("Time slot must be at least 10 minutes.");
      return;
    }

    // If scheduling (not updating), perform conflict check.
    if (!isEdit) {
      const isConflict = interviews.some(
        (i) =>
          i.id !== existingInterview?.id &&
          (i.candidate === candidate || i.interviewer === interviewer) &&
          i.date?.toString() === date?.toString() &&
          i.timeSlotStart === timeSlotStart &&
          i.timeSlotEnd === timeSlotEnd
      );
      if (isConflict) {
        setError("Conflict: Candidate or Interviewer is already booked at this time.");
        return;
      }
    }

    const interviewData: Interview = {
      id: existingInterview ? existingInterview.id : uuidv4(),
      candidate,
      interviewer,
      date,
      timeSlotStart,
      timeSlotEnd,
      interviewType: interviewType as Interview["interviewType"],
    };

    if (isEdit && existingInterview) {
      dispatch(updateInterview(interviewData));
    } else {
      dispatch(addInterview(interviewData));
    }

    // If scheduling (not updating), send email.
    const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";
    if (!isEdit) {
      const recEmail = localStorage.getItem("recEmail"); // We know it exists from earlier check.
      try {
        const interviewDateStr = new Date(interviewData.date as Date)
          .toISOString()
          .split("T")[0];
        // Convert start and end times to AM/PM format.
        const interviewTimeStartAmPm = convertToAmPm(timeSlotStart);
        const interviewTimeEndAmPm = convertToAmPm(timeSlotEnd);
        const interviewTimeStr = `${interviewTimeStartAmPm} - ${interviewTimeEndAmPm}`;
        
        await axios.post(`${apiUrl}/sendemail`, {
          recipientName: candidate,
          interviewDate: interviewDateStr,
          interviewTime: interviewTimeStr,
          recEmail,
        });
        toast.success("Email sent successfully!");
      } catch (error: any) {
        console.error("Error sending email:", error);
        const errorMessage =
          error.response?.data?.message || "Error sending email.";
        toast.error(errorMessage);
      }
    }
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-sm md:text-base bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4">
      <Toaster position="top-center" />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Candidate Input */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 flex items-center">
          <FiUser className="mr-2" /> Candidate Name:
        </label>
        <input
          type="text"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Interviewer Input */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 flex items-center">
          <FiUser className="mr-2" /> Interviewer Name:
        </label>
        <input
          type="text"
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <DateInput date={date} setDate={setDate} />

      {/* Start Time Input */}
      <TimeSlotInputStart date={date} timeSlot={timeSlotStart} setTimeSlot={handleTimeSlotStartChange} />

      {/* End Time Input */}
      <TimeSlotInputEnd date={date} timeSlot={timeSlotEnd} setTimeSlot={handleTimeSlotEndChange} />

      {/* Interview Type Input */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 flex items-center">
          <FiLayers className="mr-2" /> Interview Type:
        </label>
        <select
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value as Interview["interviewType"])}
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="Technical">Technical</option>
          <option value="HR">HR</option>
          <option value="Behavioral">Behavioral</option>
        </select>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-600 flex items-center justify-center text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
        <div className="flex items-center">
          {isEdit ? <FiEdit3 className="mr-2" /> : <FiPlus className="mr-2" />}
          {isEdit ? <span>Update</span> : <span>Schedule</span>}
        </div>
      </button>
    </form>
  );
};

export default InterviewForm;
