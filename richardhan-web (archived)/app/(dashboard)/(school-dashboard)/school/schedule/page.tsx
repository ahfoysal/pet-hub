"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isAfter,
} from "date-fns";

import { useGetSchoolSchedulesQuery } from "@/redux/features/api/dashboard/school/schedules/SchoolScheduleApi";
import type {
  DaySchedule,
  ScheduleItem,
} from "@/types/dashboard/school/SchoolScheduleTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function ClassSchedule() {
  const status = useSession().status;
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data, isLoading } = useGetSchoolSchedulesQuery(undefined, {
    skip: status === "loading",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schedulesData: DaySchedule[] = data?.data ?? [];

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days: (Date | null)[] = [];

    for (let i = 0; i < start.getDay(); i++) {
      days.push(null);
    }

    let current = start;
    while (current <= end) {
      days.push(new Date(current));
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }

    while (days.length < 42) days.push(null);

    return days;
  }, [currentMonth]);

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();

    schedulesData.forEach((day) => {
      const key = format(new Date(day.date), "yyyy-MM-dd");
      map.set(key, day.schedules);
    });

    return map;
  }, [schedulesData]);

  const upcomingSchedules = useMemo(() => {
    const todayDate = new Date();
    return schedulesData
      .filter(
        (day) =>
          isAfter(new Date(day.date), todayDate) || isToday(new Date(day.date)),
      )
      .flatMap((day) =>
        day.schedules.map((s) => ({
          ...s,
          date: new Date(day.date),
          weekday: day.weekday,
        })),
      )
      .slice(0, 6);
  }, [schedulesData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Class Schedule</h1>
        <p className="text-gray-500">
          Manage your training sessions and schedules
        </p>
      </div>

      {/* Calendar */}
      <section className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>

          <div>
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-sm font-medium text-gray-600 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-3">
          {daysInMonth.map((day, index) => {
            if (!day) return <div key={index} className="min-h-2" />;

            const dateKey = format(day, "yyyy-MM-dd");
            const daySchedules = schedulesByDate.get(dateKey) || [];

            const isCurrentDay = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasSchedules = daySchedules.length > 0;

            return (
              <div
                key={dateKey}
                onClick={() => setSelectedDate(day)}
                className={`
                  min-h-44 p-2 rounded-xl border cursor-pointer transition
                  ${hasSchedules ? "bg-blue-50/40 border-blue-300" : "border-gray-200"}
                  ${isCurrentDay ? "ring-2 ring-primary/40 " : ""}
                  ${isSelected ? "ring-2 ring-primary ring-inset" : ""}
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{day.getDate()}</span>
                  {isCurrentDay && (
                    <span className="text-xs text-blue-600 font-semibold">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-1 p-1">
                  {daySchedules.slice(0, 3).map((s, i) => (
                    <div
                      key={i}
                      className="text-xs rounded px-2 py-1 bg-primary text-white truncate"
                    >
                      <div>{s.courseName}</div>
                      <div className="font-medium">{s.time}</div>
                    </div>
                  ))}

                  {daySchedules.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{daySchedules.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 font-bold text-primary" />
          <h3 className="text-lg font-semibold">Upcoming Classes</h3>
        </div>

        {upcomingSchedules.length ? (
          <div className="space-y-3">
            {upcomingSchedules.map((s, i) => (
              <div
                key={i}
                className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-medium">
                  {s.time.split(":")[0]}
                </div>

                <div className="flex-1">
                  <div className="font-medium">{s.courseName}</div>
                  <div className="text-sm text-gray-600">
                    {format(s.date, "EEE, MMM d")} • {s.time}
                  </div>
                  <div className="text-xs text-gray-500">
                    Seats: {s.availableSeats}/{s.totalSeats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
            No upcoming classes
          </div>
        )}
      </div>
    </div>
  );
}
