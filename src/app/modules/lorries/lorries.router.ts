import express from "express";

import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { LorryController } from "./lorries.controller";
import validateRequest from "../../middlewares/validate-request";
import { LorryValidation } from "./lorries.validation";

const router = express.Router();

router
  .route("/create-lorry")
  .post(
    validateRequest(LorryValidation.createLorryZodSchema),
    auth(Role.admin, Role.super_admin),
    LorryController.insertLorry
  );

router.route("/").get(LorryController.findLorries);

router.route("/:categoryId/category").get(LorryController.findLorryByCategory);
router
  .route("/:id")
  .get(LorryController.findOneLorry)
  .patch(
    validateRequest(LorryValidation.updateLorryZodSchema),
    auth(Role.admin, Role.super_admin),
    LorryController.updateLorry
  )
  .delete(auth(Role.admin, Role.super_admin), LorryController.deleteLorry);

export const LorryRouter = router;
