import mongoose from "mongoose";
import validator from "validator";

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
  parolaConfirm: {
    type: String,
    required: [true, "Confirmarea parolei este obligatorie!"],
  },
});

export default User = mongoose.model("User", userSchema);
