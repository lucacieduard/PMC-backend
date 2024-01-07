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

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(newUser);
  res.status(200).json({
    status: "success",
    data: { newUser },
  });
});
