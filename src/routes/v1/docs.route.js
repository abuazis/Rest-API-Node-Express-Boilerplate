const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("../../docs/swaggerDef");

/// Define express router
const router = express.Router();

/// Define spesification for swagger docs
const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ["src/docs/*.yml", "src/routes/v1/*.js"],
});

/// Use index route for swagger ui
router.use("/", swaggerUi.serve);

/// Call swagger ui spesification setup
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports = router;