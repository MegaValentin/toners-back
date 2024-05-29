const validatorOrder = (req, res, next) => {
  const { toner, tonerName, cantidad, area, areaName } = req.body;

  const errors = [];

  if (!toner) errors.push("Toner is required");
  if (!tonerName) errors.push("Toner name is required");
  if (!cantidad || cantidad < 1) errors.push("Valid quantity is required");
  if (!area) errors.push("Area is required");
  if (!areaName) errors.push("Area name is required");

  // Validación de errores
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default validatorOrder();
