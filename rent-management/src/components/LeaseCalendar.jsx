import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

function LeaseCalendar({ startDate, endDate }) {
  if (!startDate || !endDate)
    return (
      <p className="italic text-gray-400 text-center mt-8">
        No lease dates available
      </p>
    );

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const firstDayOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekday = firstDayOfMonth.getDay();
  const adjustedStartWeekday = (startWeekday + 6) % 7;

  const prevMonthLastDay = new Date(start.getFullYear(), start.getMonth(), 0).getDate();
  const totalCells = 42;
  const monthName = start.toLocaleString("default", { month: "long" });
  const year = start.getFullYear();

  const days = [];

  for (let i = 0; i < totalCells; i++) {
    let dayNumber, dayDate, isCurrentMonth, isInLease, isToday;

    if (i < adjustedStartWeekday) {
      dayNumber = prevMonthLastDay - adjustedStartWeekday + i + 1;
      isCurrentMonth = false;
      dayDate = new Date(year, start.getMonth() - 1, dayNumber);
    } else if (i >= adjustedStartWeekday + daysInMonth) {
      dayNumber = i - (adjustedStartWeekday + daysInMonth) + 1;
      isCurrentMonth = false;
      dayDate = new Date(year, start.getMonth() + 1, dayNumber);
    } else {
      dayNumber = i - adjustedStartWeekday + 1;
      isCurrentMonth = true;
      dayDate = new Date(year, start.getMonth(), dayNumber);
    }

    isInLease = isCurrentMonth && dayDate >= start && dayDate <= end;
    isToday = dayDate.toDateString() === today.toDateString();

    days.push(
      <div
        key={i}
        role="gridcell"
        aria-selected={isInLease}
        tabIndex={isToday ? 0 : -1}
        className={`relative flex items-center justify-center cursor-default select-none rounded-xl transition-all duration-200
          ${isCurrentMonth ? "text-gray-900 hover:scale-105" : "text-gray-400"}
          ${
            isInLease
              ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-200"
              : "hover:bg-gray-100"
          }
          ${isToday ? "ring-2 ring-yellow-400 ring-offset-2 shadow-md" : ""}
        `}
        style={{
          height: 48,
          width: 48,
          fontWeight: 600,
          fontSize: 15,
        }}
        title={
          isInLease
            ? `Lease active on ${dayDate.toLocaleDateString()}`
            : isToday
            ? "Today"
            : undefined
        }
      >
        {dayNumber}
      </div>
    );
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section
      className="max-w-5xl w-full rounded-3xl p-8 shadow-xl border border-gray-200
                 bg-white/80 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl"
      role="grid"
      aria-label={`Lease calendar for ${monthName} ${year}`}
    >
      <h2 className="mb-6 flex items-center text-3xl font-extrabold text-gray-900 select-none">
        <CalendarIcon className="mr-3 text-red-500" size={34} />
        Lease Calendar — {monthName} {year}
      </h2>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-4 text-center font-semibold text-gray-600 border-b border-gray-300 select-none">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            role="columnheader"
            className={`py-2 ${
              new Date().getDay() === ((idx + 1) % 7) ? "text-red-500 font-bold" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>

      <p className="mt-5 text-center text-sm italic text-gray-500 flex items-center justify-center gap-2">
        <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-md" />
        <span>Lease period</span>
      </p>
    </section>
  );
}

export default LeaseCalendar;



