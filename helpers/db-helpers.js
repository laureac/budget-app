module.exports = {
  createId(data) {
    const latestRecord = data[data.length - 1];
    const newId = latestRecord.id + 1;
    if (newId === NaN || newId < 0 || newId === undefined) {
      console.error("Invalid ID");
    }
    return newId;
  },

  findById(data, id) {
    const envelope = data.find((env) => env.id === parseInt(id));

    if (!envelope) {
      console.log("Record not found");
    }
    return envelope;
  },

  deleteById(data, id) {
    const index = data.findIndex((env) => env.id === parseInt(id));

    if (index === -1) {
      console.log("Invalid index");
    }
    data.splice(index, 1);
    return data;
  },
};
