const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//make the schema which is the structure
const covidSchema = new Schema(
  {
    years: {
      type: Array,
      required: true,
    },
    totalCases: {
      type: Array,
      required: true,
    },
    newCases: {
      type: Array,
      required: true,
    },
    newCasesSmoothed: {
      type: Array,
      required: true,
    },
    newDeaths: {
      type: Array,
      required: true,
    },
    totalDeaths: {
      type: Array,
      required: true,
    },
    vaccineYears: {
      type: Array,
      required: true,
    },
    newVaccines: {
      type: Array,
      required: true,
    },
    newVaccinesSmoothed: {
      type: Array,
      required: true,
    },
    totalVaccines: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create a model based on the structure

module.exports =
  mongoose.models.CovidData || mongoose.model("CovidData", covidSchema);
