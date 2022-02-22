import { getFullDateString, getISODateString, config } from "../utils.js";

const createReservationModal = (startDate, endDate) => {
  const dates = [];
  for (var day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    dates.push(new Date(day));
  }

  const spotBlockOpts = [...Array(config.SPOTS).keys()].map((idx) => {
    return {
      text: {
        type: "plain_text",
        text: `${(idx + 1).toString()}`,
        emoji: true,
      },
      value: (idx + 1).toString(),
    };
  });

  const dateBlockOpts = dates.map((date, idx) => {
    return {
      text: {
        type: "plain_text",
        text: `${getFullDateString(date)}`,
      },
      value: getISODateString(date),
    };
  });

  const timeBlockOpts = config.TIME_SLOTS.map((time, idx) => {
    return {
      text: {
        type: "plain_text",
        text: `${time}`,
      },
      value: time,
    };
  });

  return {
    type: "modal",
    callback_id: "view_reservation",
    title: {
      type: "plain_text",
      text: "Parking Spot Reservation",
    },
    blocks: [
      {
        type: "input",
        element: {
          type: "static_select",
          action_id: "action_reservation_spot",
          placeholder: {
            type: "plain_text",
            text: "Select a spot",
            emoji: true,
          },
          options: spotBlockOpts,
        },
        label: {
          type: "plain_text",
          text: "Parking spot",
          emoji: true,
        },
        dispatch_action: true,
        block_id: "input_spot",
      },
      {
        type: "input",
        element: {
          type: "static_select",
          action_id: "action_reservation_date",
          placeholder: {
            type: "plain_text",
            text: "Select a date",
            emoji: true,
          },
          options: dateBlockOpts,
        },
        label: {
          type: "plain_text",
          text: "Date",
        },
        dispatch_action: true,
        block_id: "input_date",
      },
      {
        type: "input",
        element: {
          type: "static_select",
          action_id: "action_reservation_time",
          placeholder: {
            type: "plain_text",
            text: "Select time",
            emoji: true,
          },
          options: timeBlockOpts,
        },
        label: {
          type: "plain_text",
          text: "Time",
        },
        dispatch_action: true,
        block_id: "input_time",
      },
    ],
    submit: {
      type: "plain_text",
      text: "Reserve",
    },
  };
};

export { createReservationModal };
