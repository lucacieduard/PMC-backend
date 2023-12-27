import mongoose from "mongoose";

const competitionSchema = mongoose.Schema({
  nume: {
    type: String,
    require: [true, "Competiția trebuie să aibă un nume!"],
    minLength: 5,
    unique: [true, "Competiția trebuie să aibă un nume unic!"],
    trim: true,
  },
  locatie: {
    type: String,
    require: [true, "Competiția trebuie să aibă o locație!"],
  },
  startCompetitie: {
    type: Date,
    require: true,
  },
  sfarsitCompetitie: {
    type: Date,
    require: true,
    validate: {
      validator: function (value) {
        return value > this.startCompetitie;
      },
      message:
        "Data de final a competiției trebuie să fie după cea de începere!",
    },
  },
  startInscrieri: {
    type: Date,
    require: true,
  },
  sfarsitInscrieri: {
    type: Date,
    require: true,
    validate: {
      validator: function (value) {
        return value > this.startInscrieri;
      },
      message:
        "Data de final a competiției trebuie să fie după cea de începere!",
    },
  },
  categorii: {
    type: [
      {
        nume: {
          type: String,
        },
        probe: {
          type: [
            {
              nume: {
                type: String,
                require: true,
              },
              serii: {
                type: Boolean,
                require: true,
              },
              finala: {
                type: Boolean,
                require: true,
              },
              atletiPerSerie: {
                type: Number,
              },
              atletiFinala: {
                type: Number,
              },
            },
          ],
        },
      },
    ],
    require: true,
  },
  competitieVizibila: {
    type: Boolean,
    require: true,
  },
});

const Competition = mongoose.model("Competition", competitionSchema);

export default Competition;
