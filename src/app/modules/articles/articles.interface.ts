import { ArticleStatus } from "@prisma/client";

export interface IArticleFilterOption {
  search?: string;
  status?: ArticleStatus;
  userId?: string;
}
