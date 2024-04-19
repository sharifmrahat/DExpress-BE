import express from "express";
import { PackageController } from "./packages.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { PackageValidation } from "./packages.validation";

const router = express.Router();

router
  .route("/")
  .get(auth("public"), PackageController.findPackages)
  .post(
    auth(Role.admin, Role.super_admin),
    validateRequest(PackageValidation.createPackageValidation),
    PackageController.createPackage
  );

router
  .route("/:id")
  .get(auth("public"), PackageController.findOnePackage)
  .patch(
    validateRequest(PackageValidation.updatePackageValidation),
    auth(Role.admin, Role.super_admin),
    PackageController.updatePackage
  )
  .delete(auth(Role.super_admin), PackageController.deletePackage);

export const PackageRouter = router;
