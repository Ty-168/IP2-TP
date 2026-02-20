import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getUser(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Post('create')
    createUser(@Body() body: User) {
        return this.userService.create(body);
    }

    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() body: {username: string, email: string, password: string},) {
        return this.userService.update(id, body);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}