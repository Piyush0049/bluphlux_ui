import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ScheduleInterview from "./pages/ScheduleInterview";
import EditInterview from "./pages/EditInterview";
import { InterviewProvider } from "./context/InterviewContext";
import GlobalStyle from "./globalStyles";
import { Toaster } from "react-hot-toast";
import "./index.css";

const App: React.FC = () => {
  const [recEmail, setRecEmail] = useState<string | null>(
    localStorage.getItem("recEmail") || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(!recEmail);

  useEffect(() => {
    if (!recEmail) {
      setIsModalOpen(true);
    }
  }, [recEmail]);

  const handleSaveEmail = () => {
    if (recEmail && /\S+@\S+\.\S+/.test(recEmail)) {
      localStorage.setItem("recEmail", recEmail);
      setIsModalOpen(false);
    }
  };

  return (
    <InterviewProvider>
      <BrowserRouter>
        <GlobalStyle />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<ScheduleInterview />} />
          <Route path="/edit/:id" element={<EditInterview />} />
        </Routes>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-300 bg-opacity-90">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 md:w-[28rem] text-center transform transition-all scale-100 hover:scale-105 duration-300">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Welcome! 🎉
              </h2>
              <p className="text-gray-700 font-semibold text-lg mb-6">
                Please enter your email so we can send you important updates.
              </p>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                placeholder="Enter your email"
                value={recEmail || ""}
                onChange={(e) => setRecEmail(e.target.value)}
              />
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:opacity-90 transition-all"
                onClick={handleSaveEmail}
              >
                Save Email
              </button>
            </div>
          </div>
        )}

      </BrowserRouter>
    </InterviewProvider>
  );
};

export default App;
