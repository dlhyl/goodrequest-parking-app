const config = {
  SPOTS: 8,
  DAYS_OVERVIEW: 5,
  TIME_SLOTS: ["AM", "PM", "Full day"],
};

const getFullDateString = (date) => {
  const dateOpts = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-SK", dateOpts);
};

const getISODateString = (date) => {
  return date.toISOString().split("T")[0];
};

const getDates = (duration_days) => {
  const today = new Date(new Date().getTime());
  const endDate = new Date(today.getTime() + (duration_days - 1) * 24 * 60 * 60 * 1000);
  console.log(duration_days, today, endDate);
  return [today, endDate];
};

export { getFullDateString, getISODateString, getDates, config };
