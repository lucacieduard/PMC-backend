import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  console.log(req.cookies);
  res.status(200).json({
    status: "success",
    data: users,
  });
});
