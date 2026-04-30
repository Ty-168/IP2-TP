import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {
	private categories: Array<{ id: number; name: string }> = [];
	private nextId = 1;

	findAll() {
		return this.categories;
	}

	findOne(id: number) {
		const category = this.categories.find((item) => item.id === id);
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	create(data: { name: string }) {
		const category = { id: this.nextId++, name: data.name };
		this.categories.push(category);
		return category;
	}
}
