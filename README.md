# Interview Scheduling Application

Hi, I'm Piyush Joshi. This project is an Interview Scheduling application designed to streamline the process of scheduling, managing, and tracking interviews. The app offers a seamless user experience by providing a responsive interface and robust functionalities for scheduling interviews with candidates and interviewers.

## Assignment Overview

This project was developed as part of an assignment with the following requirements:

- **Interview Scheduling**
  - Display a list of available time slots.
  - Allow users to schedule an interview by selecting:
    - Candidate name.
    - Interviewer name.
    - Date and time slot.
    - Interview type (e.g., Technical, HR, Behavioral).
  - Validate for conflicts (e.g., overlapping interviews for the same interviewer or candidate).

- **Interview Dashboard**
  - Display a calendar or timeline view of all scheduled interviews.
  - Enable filtering by date, interviewer, or candidate.

- **Rescheduling/Editing Interviews**
  - Allow updates to an interview’s details (e.g., time or interviewer).
  - Persist changes seamlessly.

- **Deleting Interviews**
  - Enable deleting scheduled interviews with confirmation.

- **Notifications**
  - Display success or error messages upon scheduling, updating, or deleting interviews.

## Features

- **Responsive Design:** The website is fully responsive for optimal viewing on various devices.
- **Interactive Calendar:** Integrated calendar view using [react-big-calendar](https://github.com/jquense/react-big-calendar) for visualizing scheduled interviews.
- **User-Friendly Interface:** Built with Vite, React, and TypeScript for a fast and modern experience.
- **State Management:** Utilizes Redux Toolkit and redux-persist to manage and persist application state.
- **Notifications:** Real-time feedback using react-hot-toast.
- **API Integration:** Seamless integration with the backend, using environment variables to differentiate between production and local development.

## Technologies Used

- **Frontend:** 
  - Vite
  - React with TypeScript
  - React Big Calendar
  - React Icons
  - React Datepicker
  - React Router DOM
  - Redux Toolkit & react-redux
  - redux-persist
  - Tailwind CSS (via @tailwindcss/vite)
  - Styled Components
  - Axios
  - UUID
  - Date-fns

- **Backend:** (Refer to the associated backend repository for details)

## Setup Instructions

- **Frontend:**  
  ```bash
  - git clone https://github.com/Piyush0049/bluphlux_ui.git
  - cd bluphlux_ui
  - npm run dev
