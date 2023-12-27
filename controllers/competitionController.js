import Competition from "../models/competitionModel.js";

export const getAllCompetitions = async (req, res) => {
  try {
    const query = Competition.find();
    const competitions = await query;
    res.status(200).json({
      status: "success",
      length: competitions.length,
      data: competitions,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompetition = async (req, res) => {
  const id = req.params.id;
  try {
    const query = Competition.findById(id);
    const competition = await query;
    res.status(200).json({
      status: "success",
      data: competition,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteCompetition = async (req, res) => {
  const id = req.params.id;
  try {
    const query = Competition.findByIdAndDelete(id);
    const competition = await query;
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addCompetition = async (req, res) => {
  try {
    const newCompetition = await Competition.create(req.body);
    res.status(201).json({
      status: "success",
      data: newCompetition,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
