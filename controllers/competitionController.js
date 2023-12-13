export const getAllCompetitions = (req, res) => {
  res.json({ message: "OK" });
};

export const getCompetition = (req, res) => {
  const id = req.params;
  res.json({ id });
};
