const Counter = require("../models/Counter");

const generateId = async (counterName, prefix, startingNumber) => {
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  const number = startingNumber + counter.sequence - 1;

  return `${prefix}${number}`;
};

module.exports = generateId;
