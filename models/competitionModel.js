import mongoose from "mongoose";
import slugify from "slugify";

const probaSchema = new mongoose.Schema({
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
});

const categorySchema = new mongoose.Schema({
  nume: {
    type: String,
    require: true,
  },
  probe: [probaSchema],
});

const competitionSchema = new mongoose.Schema(
  {
    nume: {
      type: String,
      require: [true, "Competiția trebuie să aibă un nume!"],
      minLength: 5,
      unique: [true, "Competiția trebuie să aibă un nume unic!"],
      trim: true,
    },
    banner: {
      type: String,
      default: "default.jpg",
    },
    program: {
      type: String,
      default: null,
    },
    slug: String,
    locatie: {
      type: String,
      require: true,
    },
    lat: {
      type: Number,
      default: 47.18444,
    },
    lng: {
      type: Number,
      default: 27.56111,
    },
    startCompetitie: {
      type: Date,
      require: true,
    },
    sfarsitCompetitie: {
      type: Date,
      require: true,
    },
    startInscrieri: {
      type: Date,
      require: true,
    },
    sfarsitInscrieri: {
      type: Date,
      require: true,
    },
    categorii: {
      type: [categorySchema],
      require: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

competitionSchema.pre("save", function (next) {
  this.slug = slugify(this.nume, { lower: true });
  next();
});

competitionSchema.virtual("inscrieriFlag").get(function () {
  return this.sfarsitInscrieri > Date.now() && this.startInscrieri < Date.now();
});
competitionSchema.virtual("activaFlag").get(function () {
  return this.sfarsitCompetitie > Date.now();
});

const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
