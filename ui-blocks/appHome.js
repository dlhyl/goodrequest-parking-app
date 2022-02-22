import db from "../db/db.js";
import { getFullDateString, getISODateString, config } from "../utils.js";

const createHomeView = (startDate, endDate) => {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: ":parking: :car: Parking Overview :car: :parking:",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "The GoodRequest Parking Lot consists of 8 parking spots which can be reserved by the company's employees.\n\nThe layout of the parking lot is \n:one: :two: :three: :four:\n:five: :six: :seven: :eight:\n\nThe free slots are marked green :large_green_square:, the fully booked ones are red :large_red_square: & the partially reserved slots (e.g. just till the noon) are marked with orange color :large_orange_square:.\n\n This overview shows the availability of the parking lot for the next 5 days.",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Reserve a spot",
            emoji: true,
          },
          action_id: "action_reservation",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          text: `*${getFullDateString(startDate)}*  -  *${getFullDateString(endDate)}*`,
          type: "mrkdwn",
        },
      ],
    },
    {
      type: "divider",
    },
  ];

  for (var day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    const db_res = db.data.reservations.filter((obj) => obj.date === getISODateString(day));
    var res = db_res.sort((a, b) => (a.spot === b.spot ? a.time - b.time : Number(a.spot) - Number(b.spot)));
    var res_today = {};

    const stats = Array(config.SPOTS);
    var partially = 0,
      partially_full = 0,
      fully = 0;

    res.forEach((item) => {
      if (Number(item.spot) in res_today) {
        res_today[Number(item.spot)].push(item);
        stats[Number(item.spot) - 1] = "PP";
        partially--;
        partially_full++;
      } else {
        res_today[Number(item.spot)] = [item];
        stats[Number(item.spot) - 1] = item.time == "Full day" ? "F" : "P";
        partially += item.time != "Full day";
        fully += item.time == "Full day";
      }
    });

    var text = `> *${partially > 0 ? partially + " partially free slots, " : ""}${
      config.SPOTS - (fully + partially_full + partially)
    } fully free slots*\n>\n> `;

    for (var index = 0; index < stats.length; index++) {
      if (index == stats.length / 2) text += "\n> ";
      if (typeof stats[index] === "undefined") {
        text += ":large_green_square: ";
      } else if (stats[index] === "P") {
        text += ":large_orange_square: ";
      } else {
        text += ":large_red_square: ";
      }
    }

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `>*${getISODateString(day)}*\n${text}`,
      },
    });

    Object.entries(res_today).forEach(([spot, items]) => {
      items.forEach((reservation) => {
        console.log(reservation);
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Parking Spot *#${reservation.spot}*, *${reservation.time}* booked by <@${reservation.userid}>`,
          },
        });
      });
    });
  }

  return JSON.stringify({
    type: "home",
    callback_id: "home_view",
    title: {
      type: "plain_text",
      text: "Parking Manager",
    },
    blocks: blocks,
  });
};

export { createHomeView };
