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
        {isModalOpen && (o-indigo-600 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:opacity-90 transition-all"
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
