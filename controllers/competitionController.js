import slugify from "slugify";
import Competition from "../models/competitionModel.js";
import catchAsync from "../utils/catchAsync.js";

// GET ALL COMPETITIONS
export const getAllCompetitions = catchAsync(async (req, res) => {
  const query = Competition.find();
  const competitions = await query;
  res.status(200).json({
    status: "success",
    length: competitions.length,
    data: { competitions },
  });
});

// GET ONE COMPETITION
export const getCompetition = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const query = Competition.findById(id);
  const competition = await query;
  if (competition === null)
    return next({
      message: "Nu a fost gasita aceasta competitie!",
      status: 404,
    });
  res.status(200).json({
    status: "success",
    data: { competition },
  });
});

// DELETE ONE COMPETITION
export const deleteCompetition = catchAsync(async (req, res) => {
  const id = req.params.id;
  await Competition.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

// ADD ONE COMPETITION
export const addCompetition = catchAsync(async (req, res, next) => {
  const newCompetition = await Competition.create(req.body);
  res.status(201).json({
    status: "success",
    data: { newCompetition },
  });
});

export const updateProba = catchAsync(async (req, res, next) => {
  const { id, categoryId, probaId } = req.params;
  const competition = await Competition.findById(id);
  console.log(competition.nume);
  if (competition === null)
    return next({
      message: "Nu a fost gasita aceasta competitie!",
      status: 404,
    });
  const category = competition.categorii.id(categoryId);
  console.log(category.nume);
  if (category === null)
    return next({
      message: "Nu a fost gasita aceasta categorie!",
      status: 404,
    });
  const proba = category.probe.id(probaId);
  console.log(proba.nume);
  // await competition.save();

  res.status(200).json({
    status: "success",
    data: { proba },
  });
});

// UPDATE ONE COMPETITION
export const updateCompetition = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if(req.body.nume) {
    const slug = slugify(req.body.nume, { lower: true });
    req.body.slug = slug;
  }

  const newCompetition = await Competition.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );


  res.status(200).json({
    status: "success",
    data: { newCompetition },
  });
});
