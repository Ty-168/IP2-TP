import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	findAll() {
		return this.productService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productService.findOne(id);
	}

	@Post()
	create(@Body() body: { name: string; price: number; categoryId: number }) {
		return this.productService.create({
			name: body.name,
			price: body.price,
			categoryId: body.categoryId,
		});
	}
}
