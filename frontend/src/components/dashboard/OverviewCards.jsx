

import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function OverviewCards() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalPercentage: 0,
    totalClasses: 0,
    attendedClasses: 0,
    missedClasses: 0,
    overallStatus: "No Data",
    safeSubjects: 0,
    warningSubjects: 0,
    dangerSubjects: 0,
    averageMinPercentage: 75,
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/subjects");
      setSubjects(res.data);
      calculateOverallStats(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = (subjectsData) => {
    if (subjectsData.length === 0) {
      setOverallStats({
        totalPercentage: 0,
        totalClasses: 0,
        attendedClasses: 0,
        missedClasses: 0,
        overallStatus: "No Data",
        safeSubjects: 0,
        warningSubjects: 0,
        dangerSubjects: 0,
        averageMinPercentage: 75,
      });
      return;
    }

    let totalClasses = 0;
    let attendedClasses = 0;
    let totalMinPercentage = 0;
    let safeCount = 0;
    let warningCount = 0;
    let dangerCount = 0;

    subjectsData.forEach(subject => {
      totalClasses += subject.totalClasses || 0;
      attendedClasses += subject.attendedClasses || 0;
      totalMinPercentage += subject.minPercentage || 75;
      
      // Calculate subject status
      if (subject.totalClasses > 0) {
        const percentage = (subject.attendedClasses / subject.totalClasses) * 100;
        if (percentage >= subject.minPercentage + 10) {
          safeCount++;
        } else if (percentage >= subject.minPercentage) {
          warningCount++;
        } else {
          dangerCount++;
        }
      }
    });

    const totalPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    const missedClasses = totalClasses - attendedClasses;
    const averageMinPercentage = Math.round(totalMinPercentage / subjectsData.length);
    const percentageAboveMin = totalPercentage - averageMinPercentage;
    
    // Determine overall status
    let overallStatus = "No Data";
    
    if (totalClasses > 0) {
      if (totalPercentage >= averageMinPercentage + 5) {
        overallStatus = "Safe Zone";
      } else if (totalPercentage >= averageMinPercentage) {
        overallStatus = "Warning Zone";
      } else {
        overallStatus = "Danger Zone";
      }
    }

    setOverallStats({
      totalPercentage: parseFloat(totalPercentage.toFixed(1)),
      totalClasses,
      attendedClasses,
      missedClasses,
      overallStatus,
      safeSubjects: safeCount,
      warningSubjects: warningCount,
      dangerSubjects: dangerCount,
      averageMinPercentage,
      percentageAboveMin: parseFloat(percentageAboveMin.toFixed(1)),
    });
  };

  // Find today's most critical subject
  const getTodaysCriticalSubject = () => {
    if (subjects.length === 0) return null;

    let criticalSubject = null;
    let lowestMargin = Infinity;

    subjects.forEach(subject => {
      if (subject.totalClasses > 0) {
        const percentage = (subject.attendedClasses / subject.totalClasses) * 100;
        const margin = percentage - subject.minPercentage;
        
        if (margin < lowestMargin && margin < 10) {
          lowestMargin = margin;
          criticalSubject = subject;
        }
      }
    });

    return criticalSubject;
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const todaysCriticalSubject = getTodaysCriticalSubject();
  const progressOffset = 251.2 - (overallStats.totalPercentage / 100) * 251.2;

  if (loading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 m-4">
        {/* Left Card Skeleton */}
        <article className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-10 animate-pulse">
          <div className="relative w-48 h-48">
            <div className="w-full h-full rounded-full bg-gray-200"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="h-12 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-48 bg-gray-300 rounded"></div>
            <div className="h-4 w-64 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded-2xl"></div>
              <div className="h-20 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </article>

        {/* Right Card Skeleton */}
        <article className="bg-teal-600 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-teal-500 rounded"></div>
            <div className="h-8 w-48 bg-teal-500 rounded"></div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="h-6 w-48 bg-teal-500 rounded"></div>
            <div className="h-6 w-56 bg-teal-500 rounded"></div>
          </div>
          <div className="h-12 w-full bg-teal-500 rounded-xl mt-6"></div>
        </article>
      </section>
    );
  }

  const statusStyles = {
    "Safe Zone": "bg-green-100 text-green-700",
    "Warning Zone": "bg-yellow-100 text-yellow-700",
    "Danger Zone": "bg-red-100 text-red-700",
    "No Data": "bg-gray-100 text-gray-700",
  };

  const statusDotStyles = {
    "Safe Zone": "bg-green-500",
    "Warning Zone": "bg-yellow-500",
    "Danger Zone": "bg-red-500",
    "No Data": "bg-gray-500",
  };

  const getProgressColor = () => {
    switch (overallStats.overallStatus) {
      case "Safe Zone":
        return "stroke-teal-600";
      case "Warning Zone":
        return "stroke-yellow-500";
      case "Danger Zone":
        return "stroke-red-600";
      default:
        return "stroke-gray-400";
    }
  };

  const getMainTitle = () => {
    switch (overallStats.overallStatus) {
      case "Safe Zone":
        return "Steady Progress";
      case "Warning Zone":
        return "Need Attention";
      case "Danger Zone":
        return "Critical Alert";
      default:
        return "No Data Available";
    }
  };

  const getDescription = () => {
    if (subjects.length === 0) {
      return "Add your first subject to start tracking attendance";
    }
    
    if (overallStats.overallStatus === "No Data") {
      return "Add attendance data to see your progress";
    }
    
    if (overallStats.percentageAboveMin >= 0) {
      return `You are currently ${overallStats.percentageAboveMin}% above the average minimum required (${overallStats.averageMinPercentage}%)`;
    } else {
      return `You are currently ${Math.abs(overallStats.percentageAboveMin)}% below the average minimum required (${overallStats.averageMinPercentage}%)`;
    }
  };

  const getButtonAction = () => {
    if (todaysCriticalSubject) {
      return {
        text: "Update Attendance",
        url: `/subjects/${todaysCriticalSubject._id}`
      };
    } else if (subjects.length === 0) {
      return {
        text: "+ Add Subject",
        url: "/subjects/add"
      };
    } else {
      return {
        text: "View All Subjects",
        url: "/subjects"
      };
    }
  };

  const getRightCardTitle = () => {
    if (todaysCriticalSubject) {
      return `Focus on ${todaysCriticalSubject.name}`;
    } else if (subjects.length === 0) {
      return "Add Your First Subject";
    } else {
      return "All Subjects Are Safe";
    }
  };

  const getRightCardSubtitle = () => {
    if (todaysCriticalSubject) {
      return "Today's Priority";
    } else {
      return "Quick Action";
    }
  };

  const handleButtonClick = () => {
    const action = getButtonAction();
    window.location.href = action.url;
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 m-4">
      {/* ================= LEFT BIG CARD ================= */}
      <article className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-10">
        {/* Circular Progress */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              className="stroke-gray-200"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className={getProgressColor()}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">
              {overallStats.totalPercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">
              Overall
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          {/* Status Pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${statusStyles[overallStats.overallStatus]}`}>
            <span className={`w-2 h-2 rounded-full ${statusDotStyles[overallStats.overallStatus]}`}></span>
            Status: {overallStats.overallStatus}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {getMainTitle()}
          </h3>

          <p className="text-gray-500 mb-6 max-w-sm">
            {getDescription()}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Attended
              </p>
              <p className="text-xl font-black text-teal-600">
                {overallStats.attendedClasses} <span className="text-xs font-normal">classes</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Missed
              </p>
              <p className="text-xl font-black text-red-600">
                {overallStats.missedClasses} <span className="text-xs font-normal">classes</span>
              </p>
            </div>
          </div>

          {/* Subject Status Breakdown */}
          {subjects.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
                Subject Status
              </p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">
                    Safe: {overallStats.safeSubjects}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">
                    Warning: {overallStats.warningSubjects}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">
                    Danger: {overallStats.dangerSubjects}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ================= RIGHT GOAL CARD ================= */}
      <article className="bg-teal-600 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest opacity-80 mb-1">
            {getRightCardSubtitle()}
          </p>
          <h3 className="text-2xl font-bold leading-tight">
            {getRightCardTitle()}
          </h3>
        </div>

        <div className="space-y-4 mt-6">
          {todaysCriticalSubject ? (
            <>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-white/70">
                  schedule
                </span>
                {(() => {
                  const percentage = (todaysCriticalSubject.attendedClasses / todaysCriticalSubject.totalClasses) * 100;
                  const margin = percentage - todaysCriticalSubject.minPercentage;
                  if (margin < 0) {
                    return `Critical: ${Math.abs(margin).toFixed(1)}% below minimum`;
                  } else if (margin < 5) {
                    return `Warning: ${margin.toFixed(1)}% above minimum`;
                  } else {
                    return `Safe: ${margin.toFixed(1)}% above minimum`;
                  }
                })()}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-white/70">
                  school
                </span>
                Attendance: {todaysCriticalSubject.attendedClasses}/{todaysCriticalSubject.totalClasses} classes
              </div>
            </>
          ) : subjects.length === 0 ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-white/70">
                add_circle
              </span>
              Start tracking your attendance by adding subjects
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-white/70">
                check_circle
              </span>
              All your subjects are above minimum requirements
            </div>
          )}
        </div>

        <button 
          className="mt-6 w-full bg-white text-teal-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition"
          onClick={handleButtonClick}
        >
          {getButtonAction().text}
        </button>
      </article>
    </section>
  );
}