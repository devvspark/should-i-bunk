import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"
import toast from "react-hot-toast";

export const useTimetable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ========== FETCH TIMETABLE ========== */
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/classes");

      if (response.data.success) {
        setClasses(response.data.classes);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError(err.response?.data?.message || "Failed to fetch timetable");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  /* ========== ADD CLASS ========== */
  const addClass = async (classData) => {
    try {
      const response = await axiosInstance.post("/classes", classData);

      if (response.data.success) {
        setClasses([...classes, response.data.class]);
        toast.success("Class added successfully");
        return { success: true, class: response.data.class };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add class";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /* ========== UPDATE CLASS ========== */
  const updateClass = async (classId, classData) => {
    try {
      const response = await axiosInstance.put(`/classes/${classId}`, classData);

      if (response.data.success) {
        setClasses(
          classes.map((c) => (c._id === classId ? response.data.class : c))
        );
        toast.success("Class updated successfully");
        return { success: true, class: response.data.class };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update class";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /* ========== DELETE CLASS ========== */
  const deleteClass = async (classId) => {
    try {
      const response = await axiosInstance.delete(`/classes/${classId}`);

      if (response.data.success) {
        setClasses(classes.filter((c) => c._id !== classId));
        toast.success("Class deleted successfully");
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete class";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /* ========== CLEAR TIMETABLE ========== */
  const clearTimetable = async () => {
    try {
      const response = await axiosInstance.delete("/classes/clear/all");

      if (response.data.success) {
        setClasses([]);
        toast.success("Timetable cleared successfully");
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to clear timetable";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return {
    classes,
    loading,
    error,
    fetchTimetable,
    addClass,
    updateClass,
    deleteClass,
    clearTimetable,
    setClasses,
  };
};
