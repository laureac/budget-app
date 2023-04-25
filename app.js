const express = require("express");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

const envelopesRouter = require("./routes/envelopes");
app.use("/api/v1/envelopes", envelopesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
