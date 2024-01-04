import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

// SIGNUP
export const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
