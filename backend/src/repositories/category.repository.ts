import type { Category } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.client.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category.type.js";

class CategoryRepository {
  async findMany(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
      },
    });
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new CategoryRepository();