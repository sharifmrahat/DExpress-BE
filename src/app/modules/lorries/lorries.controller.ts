import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { LorryService } from "./lorries.service";

const insertLorry = catchAsync(async (req, res) => {
  const lorry = req.body;

  const result = await LorryService.insertLorry(lorry);

  return responseData({ message: "Lorry inserted  successfully", result }, res);
});

const updateLorry = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await LorryService.updateLorry(id, data);

  return responseData({ message: "Lorry updated  successfully", result }, res);
});

const deleteLorry = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await LorryService.deleteLorry(id);

  return responseData({ message: "Lorry deleted  successfully", result }, res);
});

const findOneLorry = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await LorryService.findOneLorry(id);
  return responseData({ message: "Lorry fetched successfully", result }, res);
});

const findLorries = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "minPrice",
    "maxPrice",
    "status",
  ]);
  const result = await LorryService.findLorries(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Lorries retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findLorryByCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "minPrice",
    "maxPrice",
    "status",
  ]);
  filterOptions.categoryId = categoryId;
  const result = await LorryService.findLorries(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Lorries with associated category data fetched successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const LorryController = {
  insertLorry,
  updateLorry,
  deleteLorry,
  findOneLorry,
  findLorries,
  findLorryByCategory,
};
