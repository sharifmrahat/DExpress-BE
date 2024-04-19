import express from "express";
import { ServiceController } from "./services.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { ServiceValidation } from "./services.validation";

const router = express.Router();

router
  .route("/")
  .get(auth("public"), ServiceController.findServices)
  .post(
    auth(Role.admin, Role.super_admin),
    validateRequest(ServiceValidation.createServiceValidation),
    ServiceController.createService
  );

router
  .route("/:id")
  .get(auth("public"), ServiceController.findOneService)
  .patch(
    validateRequest(ServiceValidation.updateServiceValidation),
    auth(Role.admin, Role.super_admin),
    ServiceController.updateService
  )
  .delete(auth(Role.super_admin), ServiceController.deleteService);

export const ServiceRouter = router;
