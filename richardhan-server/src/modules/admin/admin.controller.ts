import { Controller, Patch, Param, UseGuards, Body, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/auth.types';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BanUserDto, SuspendUserDto, CreateAdminDto, UpdateAdminDto, UpdateAdminParamDto } from './dto/admin-dto';

@UseGuards(AuthGuard)
@Roles(Role.ADMIN)
@ApiTags('Admin - Manage users')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('ban-user')
  @ApiOperation({
    summary: 'Ban a user [ADMIN | WEB]',
    description:
      'This endpoint allows an admin to ban a user. Provide `userId` and `reason` in the request body. Admins, suspended users, or already blocked users cannot be banned.',
  })
  @ApiBody({ type: BanUserDto, description: 'Ban user payload' })
  async banUser(@Body() payload: BanUserDto) {
    return await this.adminService.banUser(payload);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new Admin user [ADMIN]',
    description: 'Allows an existing admin to create a new admin account. Generates a random password and emails it.',
  })
  @ApiBody({ type: CreateAdminDto, description: 'Payload to create a new admin' })
  async createAdmin(@Body() payload: CreateAdminDto) {
    return await this.adminService.createAdmin(payload);
  }

  @Patch('update/:adminId')
  @ApiOperation({
    summary: 'Update an Admin user [ADMIN]',
    description: 'Allows an existing admin to update the details of an admin account.',
  })
  @ApiParam({ name: 'adminId', description: 'The ID of the admin to update', type: String })
  @ApiBody({ type: UpdateAdminDto, description: 'Payload to update an admin' })
  async updateAdmin(@Param() params: UpdateAdminParamDto, @Body() payload: UpdateAdminDto) {
    return await this.adminService.updateAdmin(params.adminId, payload);
  }

  @Patch('reactivate-user/:userId')
  @ApiOperation({
    summary: 'Reactivate a user [ADMIN | WEB]',
    description:
      'Allows an admin to reactivate a user. Users who are already active cannot be reactivated. Any previous suspension or ban data will be cleared.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique ID of the user to reactivate',
    required: true,
    type: String,
  })
  async reactivateUser(@Param('userId') userId: string) {
    return await this.adminService.reactivateUser(userId);
  }

  @Patch('suspend-user')
  @ApiOperation({
    summary: 'Suspend a user [ADMIN | WEB]',
    description:
      'Allows an admin to suspend a user. Provide `userId`, `reason`, and `suspendDuration` in the request body. ' +
      'Admins cannot be suspended. Users who are already suspended or banned cannot be suspended again.',
  })
  @ApiBody({ type: SuspendUserDto, description: 'Suspend user payload' })
  async suspendUser(@Body() payload: SuspendUserDto) {
    return await this.adminService.suspendUser(payload);
  }

  @Get('suspend-users')
  @ApiOperation({
    summary: 'Get suspended users [ADMIN | WEB]',
    description:
      'Allows an admin to retrieve a paginated list of users who are currently suspended. ' +
      'Returns user details including `id`, `fullName`, `email`, `suspendReason`, and `suspendUntil`.',
  })
  async getSuspendUsers() {
    return await this.adminService.getSuspendUsers();
  }

  @Get('banned-users')
  @ApiOperation({
    summary: 'Get banned users [ADMIN | WEB]',
    description:
      'Allows an admin to retrieve a paginated list of users who are currently banned. ' +
      'Returns user details including `id`, `fullName`, `email`, and `banReason`.',
  })
  async getBannedUsers() {
    return await this.adminService.getBannedUsers();
  }
}
