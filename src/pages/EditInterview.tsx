import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewForm from "../components/InterviewForm";
import { FiEdit, FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";

const EditInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { interviews } = useSelector((state: any) => state.interviews);
  const interview = interviews.find((i: any) => i.id === id);

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-50 to-gray-50">
        <p className="text-gray-700 text-2xl font-semibold">Interview not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50 p-0 md:p-4">
      <button onClick={() => navigate(-1)} className="hidden md:flex absolute top-4 left-4  items-center gap-1 text-blue-600 hover:text-blue-800">
        <FiArrowLeft size={24} />
        Back
      </button>
      <button onClick={() => navigate(-1)} className="flex md:hidden absolute top-4 left-4 items-center gap-1 text-blue-600 hover:text-blue-800">
        <FiArrowLeft size={24} />
      </button>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl py-6">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="hidden sm:flex text-3xl lg:text-4xl font-bold lg:font-extrabold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent justify-center items-center gap-2">
              <FiEdit className="text-blue-500" />
              Edit Interview
            </h2>
            <h2 className="flex sm:hidden text-2xl lg:text-4xl font-bold lg:font-extrabold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent justify-center items-center gap-1">
              <FiEdit className="text-blue-500" />
              Edit
            </h2>
            <p className="mt-1 md:mt-2 text-base sm:text-lg text-gray-600">
              Update your interview details below.
            </p>
          </div>
          <div className="p-3 rounded-xl transform transition duration-500 hover:scale-105">
            <InterviewForm existingInterview={interview} isEdit />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInterview;
