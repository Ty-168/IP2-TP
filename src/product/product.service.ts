import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	findAll() {
		return this.productRepo.find({ order: { id: 'ASC' } });
	}

	findByCategory(categoryId: number) {
		return this.productRepo.find({ where: { categoryId }, order: { id: 'ASC' } });
	}

	async findOne(id: number) {
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async create(data: { name: string; price: number; categoryId: number }) {
		const product = this.productRepo.create(data);
		return this.productRepo.save(product);
	}
}
