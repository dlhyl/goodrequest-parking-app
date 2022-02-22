/*
  GoodRequest Slack Parking Managment System

  Use cases:
  - show calendar
*/

import dotenv from "dotenv";
import bolt from "@slack/bolt";
import db from "./db/db.js";
import { getDates, config } from "./utils.js";
import { createHomeView } from "./ui-blocks/appHome.js";
import { createReservationModal } from "./ui-blocks/reservationModal.js";
dotenv.config();

const [startDate, endDate] = getDates(config.DAYS_OVERVIEW);

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

// Event fired after opening the home tab
app.event("app_home_opened", async ({ event, context }) => {
  try {
    await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: createHomeView(new Date(startDate), new Date(endDate)),
    });
  } catch (err) {
    app.error(err);
  }
});

// Action fired after pressing the reservation button from the home tab
app.action("action_reservation", async ({ ack, body, client, logger }) => {
  await ack();
  const view = createReservationModal(new Date(startDate), new Date(endDate));
  console.log(JSON.stringify(view));
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: view,
    });
  } catch (error) {
    logger.error(error);
  }
});

// Action fired after choosing a parking spot from the reservation modal
app.action("action_reservation_spot", async ({ ack, logger }) => {
  console.log("SPOT CHANGE");
  await ack();
});

// Action fired after choosing a date from the reservation modal
app.action("action_reservation_date", async ({ ack, logger }) => {
  console.log("DATE CHANGE");
  await ack();
});

// Action fired after choosing a time slot from the reservation modal
app.action("action_reservation_time", async ({ ack, logger }) => {
  console.log("TIME CHANGE");
  await ack();
});

// Action fired after submiting the reservation
app.view("view_reservation", async ({ ack, payload, body, event, context }) => {
  console.log("modal submission");

  const spot = payload.state.values.input_spot.action_reservation_spot.selected_option.value;
  const date = payload.state.values.input_date.action_reservation_date.selected_option.value;
  const time = payload.state.values.input_time.action_reservation_time.selected_option.value;

  db.data.reservations.push({ date: date, spot: spot, time: time, userid: body.user.id });

  await ack();

  await app.client.views.publish({
    token: context.botToken,
    user_id: body.user.id,
    view: createHomeView(new Date(startDate), new Date(endDate)),
  });
  // await db.write();
});

app.error((error) => {
  console.log(error);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`App running on port ${process.env.PORT || 3000}`);
})();
