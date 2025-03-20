import React from "react";

interface FormattedDateProps {
  date: string | undefined;
  formatType: "default" | "weekday"; 
}

const getGeorgianMonth = (month: string) => {
  const months: Record<string, string> = {
    Jan: "იანვ",
    Feb: "თებ",
    Mar: "მარ",
    Apr: "აპრ",
    May: "მაი",
    Jun: "ივნ",
    Jul: "ივლ",
    Aug: "აგვ",
    Sep: "სექ",
    Oct: "ოქტ",
    Nov: "ნოე",
    Dec: "დეკ",
  };

  return months[month] || month;
};

const getGeorgianWeekday = (weekday: string) => {
  const weekdays: Record<string, string> = {
    Mon: "ორშ",
    Tue: "სამ",
    Wed: "ოთხ",
    Thu: "ხუთ",
    Fri: "პარ",
    Sat: "შაბ",
    Sun: "კვი",
  };

  return weekdays[weekday] || weekday;
};

const formatDate = (date: string, formatType: "default" | "weekday") => {
  if (!date) return "No Date";

  const parsedDate = new Date(date);

  if (formatType === "default") {
    // "22 იანვ, 2022"
    const day = parsedDate.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(parsedDate);
    const year = parsedDate.getFullYear();

    return `${day} ${getGeorgianMonth(month)}, ${year}`;
  } else {
    // "ორშ - 02/2/2025"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(parsedDate);

    const [weekday, rest] = formattedDate.split(", "); // "Fri, 02/02/2025" → ["Fri", "02/02/2025"]
    return `${getGeorgianWeekday(weekday)} - ${rest}`;
  }
};

const FormattedDate: React.FC<FormattedDateProps> = ({ date, formatType }) => {
  return <span className="text-grey font-normal leading-[1] text-[1.2rem]">{formatDate(date!, formatType)}</span>;
};

export default FormattedDate;
