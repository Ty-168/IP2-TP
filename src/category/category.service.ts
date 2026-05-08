import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
	) {}

	findAll() {
		return this.categoryRepo.find({ order: { id: 'ASC' } });
	}

	async findOne(id: number) {
		const category = await this.categoryRepo.findOne({ where: { id } });
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	async create(data: { name: string }) {
		const category = this.categoryRepo.create({ name: data.name });
		return this.categoryRepo.save(category);
	}
}
