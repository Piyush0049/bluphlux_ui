import React from "react";
import InterviewForm from "../components/InterviewForm";
import { FiCalendar } from "react-icons/fi";

const ScheduleInterview: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50 flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-2xl py-6">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="hidden sm:flex text-3xl lg:text-4xl font-bold lg:font-extrabold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent justify-center items-center gap-2">
            <FiCalendar className="text-blue-500" />
            Schedule New Interview
          </h2>
          <h2 className="flex sm:hidden text-2xl lg:text-4xl font-bold lg:font-extrabold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent justify-center items-center gap-1">
            <FiCalendar className="text-blue-500" />
            Schedule
          </h2>
          <p className="mt-1 md:mt-2 text-base sm:text-lg text-gray-600">
            Plan and book your interviews.
          </p>
        </div>
        <div className=" p-3 rounded-xl transform transition duration-500 hover:scale-105">
          <InterviewForm />
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
