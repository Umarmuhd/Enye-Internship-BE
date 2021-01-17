const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/rates", function (req, res) {
  const base = req.query.base;
  const currency = req.query.currency;

  try {
    if (base && currency) {
      const fetchRates = async () => {
        try {
          return await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${base}`
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
      };

      const dispalyRates = async () => {
        const response = await fetchRates();

        const baseCur = response.data.base;
        const currentDate = response.data.date;
        const rates = response.data.rates;

        const currencyQueried = await currency.split(",");

        const rateUnits = Object.assign(
          {},
          ...currencyQueried.map((value) => ({
            [value]: rates[value],
          }))
        );

        res.json({
          results: {
            base: baseCur,
            date: currentDate,
            rates: rateUnits,
          },
        });
      };

      dispalyRates();
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid request! check parameters" });
  }
});

app.get("*", function (req, res, next) {
  return res.status(404).json({ error: "Cannot be found!" });
});

// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
