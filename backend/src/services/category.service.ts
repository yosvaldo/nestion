import AppError from "../errors/app.error.js";
import categoryRepository from "../repositories/category.repository.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category.type.js";

class CategoryService {
  async getAll() {
    return categoryRepository.findMany();
  }

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found.", 404);
    }
    return category;
  }

  async create(data: CreateCategoryInput) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) {
      throw new AppError("Category with this name already exists.", 400);
    }
    return categoryRepository.create(data);
  }

  async update(id: string, data: UpdateCategoryInput) {
    await this.getById(id);

    if (data.name) {
      const existing = await categoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new AppError("Category with this name already exists.", 400);
      }
    }

    return categoryRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return categoryRepository.delete(id);
  }
}

export default new CategoryService();