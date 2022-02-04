const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  // customError defaults
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // cast error / provided id with wrong syntax in params
  if (err.name === "CastError") {
    customError.msg = `No item found with given id: ${err.value}`;
    customError.statusCode = 404;
  }

  // Validation error
  if (err.name === "ValidationError") {
    customError.msg = `Please provide ${Object.values(err.errors)
      .map((item) => item.path)
      .join(", ")}`;
    customError.statusCode = 400;
  }

  // user already exists error
  if (err.code && err.code === 11000) {
    customError.msg = `This ${Object.keys(err.keyValue)} already exists`;
    customError.statusCode = 400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
