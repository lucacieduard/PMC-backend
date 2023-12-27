import Competition from "../models/competitionModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllCompetitions = catchAsync(async (req, res) => {
  const query = Competition.find();
  const competitions = await query;
  res.status(200).json({
    status: "success",
    length: competitions.length,
    data: competitions,
  });
});

export const getCompetition = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const query = Competition.findById(id);
  const competition = await query;
  if (competition === null)
    return next({ message: "Nu a fost gasita aceasta competitie!", status: 404 });
  res.status(200).json({
    status: "success",
    data: competition,
  });
});

export const deleteCompetition = catchAsync(async (req, res) => {
  const id = req.params.id;
  await Competition.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

export const addCompetition = catchAsync(async (req, res, next) => {
  const newCompetition = await Competition.create(req.body);
  res.status(201).json({
    status: "success",
    data: newCompetition,
  });
});
