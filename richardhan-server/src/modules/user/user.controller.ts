import { Controller, Get, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/types/auth.types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get single user' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Get profile by user id' })
  @Get('profile/:id')
  getProfileByUserId(@Param('id') id: string) {
    return this.userService.getProfileByUserId(id);
  }

  @ApiOperation({ summary: 'Delete user and their associated records by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
