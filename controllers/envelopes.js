const { createId, findById, deleteById } = require("../helpers/db-helpers");

const dbEnvelopes = require("../config/db");

exports.getEnvelopes = async (req, res) => {
  try {
    const envelopes = await dbEnvelopes;
    res.status(200).send(envelopes);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addEnvelope = async (req, res) => {
  try {
    const { title, budget } = req.body;
    const envelopes = await dbEnvelopes;
    const newId = createId(envelopes);
    const newEnvelope = {
      id: newId,
      title,
      budget,
    };
    envelopes.push(newEnvelope);
    res.status(201).send(newEnvelope);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getEnvelopeById = async (req, res) => {
  try {
    const { id } = req.params;
    const envelopes = await dbEnvelopes;
    const envelope = findById(envelopes, id);

    if (!envelope) {
      return res.status(404).send({
        message: `Envelope ${id} not found.`,
      });
    }

    res.status(200).send(envelope);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateEnvelope = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, budget } = req.body;

    const envelopes = await dbEnvelopes;
    const envelope = findById(envelopes, id);

    if (!envelope) {
      res.status(404).send(`Envelope ${id} not found.`);
      return;
    }

    envelope.title = title;
    envelope.budget = budget;
    res.status(201).send(envelopes);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteEnvelope = async (req, res) => {
  try {
    const { id } = req.params;

    const envelopes = await dbEnvelopes;
    const envelope = findById(envelopes, id);

    if (!envelope) {
      res.status(404).send(`Envelope ${id} not found.`);
      return;
    }

    const updatedEnvelopes = deleteById(envelopes, id);
    res.status(204).send(updatedEnvelopes);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.transfer = async (req, res) => {
  try {
    const { fromId, toId } = req.params;
    const amount = req.headers.amount;

    const envelopes = await dbEnvelopes;

    if (!amount || isNaN(amount) || amount <= 0) {
      res.status(400).send("Invalid or missing transfer amount.");
      return;
    }
    if (!fromId || !toId) {
      res.status(400).send("Invalid or missing envelope name");
      return;
    }

    const fromEnvelope = findById(envelopes, fromId);
    const toEnvelope = findById(envelopes, toId);

    if (!fromEnvelope || !toEnvelope) {
      res.status(404).send("One or both of the envelopes does not exist.");
      return;
    }
    if (fromEnvelope.budget < amount) {
      res
        .status(400)
        .send(
          `Cannot transfer more than the budget. Current budget of envelope "${fromEnvelope.title}": ${fromEnvelope.budget}.`
        );
      return;
    }

    fromEnvelope.budget -= Number(amount);
    toEnvelope.budget += Number(amount);

    res.status(201).send(envelopes);
  } catch (err) {
    res.status(500).send(err);
  }
};
