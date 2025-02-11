import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus, FiCalendar, FiList, FiBell } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InterviewCalendar from "../components/InterviewCalendar";
import { removeInterview, updateInterview } from "../store/interviewSlice";
import { InterviewEvent } from "../components/InterviewCalendar";
import { AiOutlineClose } from "react-icons/ai";
import NotificationModal from "../components/Notification";
import toast from "react-hot-toast";
import { parse, format } from "date-fns";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const interviews = useSelector((state: any) => state.interviews.interviews);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState({ date: "", candidate: "", interviewer: "" });
  const [notifications, setNotifications] = useState<InterviewEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleEventUpdate = (updatedEvent: InterviewEvent) => {
    console.log(updatedEvent);
    dispatch(updateInterview(updatedEvent));
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  const handleDelete = (id: string) => {
    toast.success("Slot Deleted!")
    dispatch(removeInterview(id));
  };

  const filteredInterviews = interviews.filter((i: any) =>
    (!filter.date || i.date === filter.date) &&
    (!filter.candidate || i.candidate.toLowerCase().includes(filter.candidate.toLowerCase())) &&
    (!filter.interviewer || i.interviewer.toLowerCase().includes(filter.interviewer.toLowerCase()))
  );

  const events =filteredInterviews.map((i: any) => {
    const baseDate = new Date(i.date);
    const [startHour, startMinute] = i.timeSlotStart.split(":").map(Number);
    const start = new Date(baseDate);
    start.setHours(startHour, startMinute, 0, 0);
    const [endHour, endMinute] = i.timeSlotEnd.split(":").map(Number);
    const end = new Date(baseDate);
    end.setHours(endHour, endMinute, 0, 0);

    return {
      ...i,
      id: i.id,
      title: `${i.candidate} - ${i.interviewer}`,
      start,
      end,
      allDay: false,
    };
  });
  

  

  const convertToAmPm = (time: string): string => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  useEffect(() => {
    const getEffectiveStart = (event: InterviewEvent): Date | null => {
      if (!event.date || !event.timeSlotStart) return null;
      const d = new Date(event.date);
      const [h, m] = event.timeSlotStart.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const upcoming = interviews.filter((i: InterviewEvent) => {
      const effectiveStart = getEffectiveStart(i);
      if (!effectiveStart) return false;
      return effectiveStart > now && effectiveStart <= twoHoursLater;
    });

    setNotifications(upcoming);
  }, [interviews]);



  return (
    <div className="min-h-screen font-poppins bg-gradient-to-r from-blue-50 via-indigo-50 to-gray-50 py-6 sm:py-10 px-0 sm:px-5 lg:px-32" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="mx-auto px-3 sm:px-4">
        <div className="flex flex-row justify-between items-center mb-8">
          <h1 className="text-2xl lg:text-3xl hidden sm:block font-extrabold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Interview Dashboard
          </h1>
          <h1 className="text-2xl lg:text-3xl block sm:hidden font-bold bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 md:space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="relative flex items-center bg-gray-700 text-white px-3 py-3  cursor-pointer  rounded-full shadow-md hover:bg-gray-900 transition duration-300"
            >
              <FiBell />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
              className="flex items-center bg-gray-700 text-white px-3 py-3 cursor-pointer rounded-full shadow-md hover:bg-gray-900 transition duration-300"
            >
              {viewMode === "list" ? <FiCalendar /> : <FiList />}
            </button>
            <Link
              to="/schedule"
              className="hidden md:flex items-center bg-blue-600 text-white font-semibold px-6 py-2 cursor-pointer rounded-full shadow-md hover:bg-blue-700 transition duration-300"
            >
              <FiPlus className="mr-2" />
              Schedule Interview
            </Link>
            <Link
              to="/schedule"
              className="flex md:hidden items-center bg-blue-600 text-white font-semibold px-3 cursor-pointer py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
            >
              <FiPlus />
            </Link>
          </div>
        </div>

        {viewMode === "list" ? (
          <>
            <div className="bg-white p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block font-semibold text-sm text-gray-700">Filter by Date</label>
                  <div className="relative">
                    <DatePicker
                      selected={filter.date ? new Date(filter.date) : null}
                      onChange={(date) =>
                        setFilter({ ...filter, date: date ? date.toISOString().split("T")[0] : "" })
                      }
                      customInput={
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Add date"
                            value={filter.date}
                            readOnly
                            className="mt-2 w-full border border-gray-300 rounded-sm px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none pr-10"
                          />
                          {filter.date && (
                            <button
                              type="button"
                              className="absolute right-3 top-[57%] transform -translate-y-[50%] text-gray-500 hover:text-red-500"
                              onClick={() => setFilter({ ...filter, date: "" })}
                            >
                              <AiOutlineClose size={18} />
                            </button>
                          )}
                        </div>
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-sm text-gray-700">Candidate</label>
                  <input
                    type="text"
                    placeholder="Search candidate"
                    value={filter.candidate}
                    onChange={(e) => setFilter({ ...filter, candidate: e.target.value })}
                    className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm text-gray-700">Interviewer</label>
                  <input
                    type="text"
                    placeholder="Search interviewer"
                    value={filter.interviewer}
                    onChange={(e) => setFilter({ ...filter, interviewer: e.target.value })}
                    className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg text-sm lg:text-base overflow-auto shadow-sm">
              <table className="min-w-full">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Interviewer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Start</th>
                    <th className="px-6 py-4">End</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-blue-50">
                  {filteredInterviews.map((i: any) => (
                    <tr key={i.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{i.candidate}</td>
                      <td className="px-6 py-4">{i.interviewer}</td>
                      <td className="px-6 py-4">{formatDate(i.date)}</td>
                      <td className="px-6 py-4">{convertToAmPm(i.timeSlotStart)}</td>
                      <td className="px-6 py-4">{convertToAmPm(i.timeSlotEnd)}</td>
                      <td className="px-6 py-4 flex space-x-3">
                        <button onClick={() => { navigate(`/edit/${i.id}`) }} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          <FiEdit size={20} />
                        </button>
                        <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-800 cursor-pointer">
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInterviews.length === 0 && (
                <div className="flex justify-center">
                  <p className="px-6 py-4 text-center text-lg text-gray-500 font-medium">
                    🎉 WooHoo! No interviews are pending!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <InterviewCalendar events={events} onEventUpdate={handleEventUpdate} />
        )}
      </div>
      {showModal && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
