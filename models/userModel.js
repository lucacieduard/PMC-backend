import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  nume: {
    type: String,
    required: [true, "Numele este obligatoriu!"],
  },
  prenume: {
    type: String,
    required: [true, "Prenumele este obligatoriu!"],
  },
  email: {
    type: String,
    required: [true, "Email-ul este obligatoriu!"],
    unique: [true, "Email-ul trebuie să fie unic!"],
    lowercase: true,
    validate: [validator.isEmail, "Email-ul nu este valid!"],
  },
  telefon: {
    type: String,
    required: [true, "Numărul de telefon este obligatoriu!"],
  },
  clubSportiv: {
    type: String,
    required: [true, "Clubul sportiv este obligatoriu!"],
  },
  parola: {
    type: String,
    required: [true, "Parola este obligatorie!"],
    minlength: [8, "Parola trebuie să fie de minim 8 caractere!"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("parola")) return next();
  this.parola = await bcrypt.hash(this.parola, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
