/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { storageConfig } from 'src/config/storage.config';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-pass.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { SetRoleDto } from './dto/set-role.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import {
  ChangeRoleDto,
  CheckFirebaseTokenDto,
  CheckIfEmailUserExistsDto,
  CheckIfPhoneNumberUserExistsDto,
  PetOwnerSignUpDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get current user' })
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@CurrentUser('id') id: string) {
    const result = await this.authService.getMe(id);
    return result;
  }

  @ApiOperation({ summary: 'For login' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Req() req: Request) {
    const result = await this.authService.login(req.user);
    return result;
  }

  @ApiOperation({ summary: 'For signup with email' })
  @Post('signup')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  async signup(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const result = await this.authService.signup(dto, file);
    return result;
  }

  @ApiOperation({ summary: 'Verify email after signup' })
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.code);
  }

  @ApiOperation({ summary: 'Set user role' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @UseGuards(AuthGuard)
  @Post('set-role')
  setRole(@Body() dto: SetRoleDto, @CurrentUser('id') id: string) {
    return this.authService.setRole(id, dto);
  }

  @ApiOperation({ summary: 'Resend otp' })
  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @ApiOperation({ summary: 'For forgot password' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'For reset password after forgot' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'For google login' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken, next } = await this.authService.handleGoogleCallback(
      req.user
    );

    // Redirect to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/${next}?token=${accessToken}`
    );
  }

  @ApiOperation({ summary: 'Get new token' })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  refreshToken(@CurrentUser('id') id: string) {
    // console.log(req.user);
    return this.authService.refreshToken(id);
  }

  @Post('users/exists/phone')
  @ApiOperation({ summary: 'Check if a user exists by phone number' })
  @ApiBody({ type: CheckIfPhoneNumberUserExistsDto })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the user exists and tokens if user exists',
    schema: {
      example: {
        isUserExists: true,
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
      },
    },
  })
  async checkIfPhoneNumberUserExists(
    @Body() payload: CheckIfPhoneNumberUserExistsDto
  ) {
    return await this.authService.checkIfPhoneNumberUserExists(payload);
  }

  @Post('users/exists/email')
  @ApiOperation({ summary: 'Check if a user exists by email' })
  @ApiBody({ type: CheckIfEmailUserExistsDto })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the user exists and tokens if user exists',
    schema: {
      example: {
        isUserExists: true,
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
      },
    },
  })
  async checkIfEmailUserExists(@Body() payload: CheckIfEmailUserExistsDto) {
    return await this.authService.checkIfEmailUserExists(payload);
  }

  @Post('pet-owner-signup')
  @ApiOperation({ summary: 'Register a new pet owner' })
  @ApiBody({ type: PetOwnerSignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully with access and refresh tokens',
    schema: {
      example: {
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
      },
    },
  })
  async petOwnerSignUp(@Body() payload: PetOwnerSignUpDto) {
    return await this.authService.petOwnerSignUp(payload);
  }

  @Post('send-otp')
  @ApiBody({ type: ResendOtpDto, required: true })
  @ApiOperation({ summary: '[App] send verification code to email' })
  async sendOtp(@Body() dto: ResendOtpDto) {
    return await this.authService.resendOtp(dto);
  }

  @Post('/firebase-token')
  @ApiOperation({ summary: '[App] Check user via Firebase token' })
  async checkUserByFirebaseToken(@Body() payload: CheckFirebaseTokenDto) {
    return this.authService.checkUserByFirebaseToken(payload.firebaseToken);
  }

  // TODO: remove
  @Patch('change-role')
  async changeRole(@Body() payload: ChangeRoleDto) {
    return await this.authService.changeRole(payload);
  }
}
