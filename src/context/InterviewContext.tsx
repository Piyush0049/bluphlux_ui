import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  
  export interface Interview {
    id: string;
    candidate: string;
    interviewer: string;
    date: string;
    timeSlot: string;
    interviewType: "Technical" | "HR" | "Behavioral";
  }
  
  interface InterviewContextProps {
    interviews: Interview[];
    addInterview: (interview: Interview) => boolean;
    updateInterview: (interview: Interview) => boolean;
    deleteInterview: (id: string) => void;
  }
  
  const InterviewContext = createContext<InterviewContextProps | undefined>(
    undefined
  );
  
  export const InterviewProvider = ({ children }: { children: ReactNode }) => {
    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
      const storedInterviews = localStorage.getItem("interviews");
      if (storedInterviews) {
        setInterviews(JSON.parse(storedInterviews));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem("interviews", JSON.stringify(interviews));
    }, [interviews]);
    
    const hasConflict = (newInterview: Interview): boolean => {
      return interviews.some(
        (i) =>
          i.date === newInterview.date &&
          i.timeSlot === newInterview.timeSlot &&
          (i.candidate === newInterview.candidate ||
            i.interviewer === newInterview.interviewer) &&
          i.id !== newInterview.id
      );
    };
  
    const addInterview = (interview: Interview) => {
      if (hasConflict(interview)) return false;
      setInterviews((prev) => [...prev, interview]);
      return true;
    };
  
    const updateInterview = (updated: Interview) => {
      if (hasConflict(updated)) return false;
      setInterviews((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      return true;
    };
  
    const deleteInterview = (id: string) => {
      setInterviews((prev) => prev.filter((i) => i.id !== id));
    };
  
    return (
      <InterviewContext.Provider
        value={{ interviews, addInterview, updateInterview, deleteInterview }}
      >
        {children}
      </InterviewContext.Provider>
    );
  };
  
  export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
      throw new Error("useInterview must be used within an InterviewProvider");
    }
    return context;
  };
  