import React from "react";
import { format } from "date-fns";
import { InterviewEvent } from "./InterviewCalendar";
import { AiOutlineClose } from "react-icons/ai";

interface NotificationModalProps {
  notifications: InterviewEvent[];
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notifications, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upcoming Interviews</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <AiOutlineClose size={24} />
          </button>
        </div>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notif) => {
              const effectiveDate = notif.date ? new Date(notif.date) : null;
              const dateStr = effectiveDate ? format(effectiveDate, "yyyy-MM-dd") : "No date available";
              const startTimeStr =
                notif.timeSlotStart &&
                format(new Date(`1970-01-01T${notif.timeSlotStart}:00`), "h:mm a");
              const endTimeStr =
                notif.timeSlotEnd &&
                format(new Date(`1970-01-01T${notif.timeSlotEnd}:00`), "h:mm a");

              return (
                <li key={notif.id} className="border-b py-2">
                  <p className="font-semibold">
                    {notif.candidate} with {notif.interviewer}
                  </p>
                  <p className="text-sm text-gray-600">
                    {dateStr}
                    {startTimeStr && endTimeStr && `, ${startTimeStr} - ${endTimeStr}`}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">No upcoming interviews within the next 2 hours.</p>
        )}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
