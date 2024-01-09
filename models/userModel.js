import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    select: false,
  },
  parolaSchimbataLa: Date,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  __v: { type: Number, select: false },
  creatLa: { type: Date, default: Date.now },
  tokenResetParola: String,
  tokenResetParolaExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("parola")) return next();
  this.parola = await bcrypt.hash(this.parola, 12);
  next();
});

userSchema.pre("save", function (next) {
  if(!this.isModified("parola") || this.isNew) return next();

  this.parolaSchimbataLa = Date.now() - 1000;
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.parolaSchimbata = function (JWTTimestamp) {
  if (this.parolaSchimbataLa) {
    const changedTimestamp = parseInt(
      this.parolaSchimbataLa.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.tokenResetParola = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(resetToken, this.tokenResetParola);
  this.tokenResetParolaExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
