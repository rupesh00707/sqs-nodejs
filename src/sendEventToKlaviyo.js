const axios = require("axios");
const findEmailInPayload = require("./findEmailInPayload");

const klaviyoURl = "https://a.klaviyo.com/api/events/";
const header = {
  "Content-Type": "application/json",
  Authorization: "Klaviyo-API-Key pk_9c294f70cb35858cbfcae330c85484eb05",
  revision: new Date().toISOString().slice(0, 10),
};

const sendEventToKlaviyo = async (event, payload, cb) => {
  const email = findEmailInPayload(payload);
  console.log(`email is: ${email}`);
  console.log(`event is: ${event}`);

  if (!email) return cb(false, "No email found in payload");

  const klaviyoBody = {
    data: {
      type: "event",
      attributes: {
        profile: {
          email: email,
          phone: "",
        },
        metric: {
          name: event,
        },
        properties: {
          payloadData: payload,
        },
      },
    },
  };

  axios
    .post(klaviyoURl, klaviyoBody, { headers: header })
    .then((res) => {
      if (res.status === 202) {
        console.log("Event sent to Klaviyo");
        cb(true);
      }
    })
    .catch((err) => {
      console.log(err);
      cb(false, err);
    });
};

module.exports = sendEventToKlaviyo;
