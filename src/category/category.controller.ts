import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	findAll() {
		return this.categoryService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.findOne(id);
	}

	@Post()
	create(@Body() body: { name: string }) {
		return this.categoryService.create({ name: body.name });
	}
}
