import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, ProfileType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ApiResponse } from 'src/common/response/api-response';
import { Role, UserInfoJwt } from 'src/common/types/auth.types';
import { User } from 'src/common/types/user.type';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { FirebaseService } from '../firebase/firebase.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import refreshJwtConfig from './config/refresh-jwt.config';
import {
  ChangeRoleDto,
  CheckIfEmailUserExistsDto,
  CheckIfPhoneNumberUserExistsDto,
  PetOwnerSignUpDto,
} from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-pass.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { SetRoleDto } from './dto/set-role.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
  ) {}

  generateTokenFromName(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomPart = crypto.randomUUID().slice(0, 6);
    return `${slug}-${randomPart}`;
  }

  async getMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        fullName: true,
        image: true,
        phone: true,
        isEmailVerified: true,
        hasProfile: true,
        vendorProfile: true,
        hotelProfile: true,
        petSitterProfiles: true,
        petSchoolProfiles: true,
        petOwnerProfiles: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Determine the active profile based on role
    let profile: any = null;
    if (user.role === Role.VENDOR) profile = user.vendorProfile;
    else if (user.role === Role.PET_HOTEL) profile = user.hotelProfile;
    else if (user.role === Role.PET_SITTER) profile = user.petSitterProfiles?.[0]; // Assuming array based on schema plural
    else if (user.role === Role.PET_SCHOOL) profile = user.petSchoolProfiles?.[0];
    else if (user.role === Role.PET_OWNER) profile = user.petOwnerProfiles?.[0];

    const {
      vendorProfile: _,
      hotelProfile: __,
      petSitterProfiles: ___,
      petSchoolProfiles: ____,
      petOwnerProfiles: _____,
      ...safeUser
    } = user as any;

    return ApiResponse.success('User found', {
      ...safeUser,
      profile,
    });
  }

  async signup(dto: RegisterDto, file?: Express.Multer.File) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: dto.email }, { phone: dto.phone }],
        },
      });

      if (existingUser?.status === 'BLOCKED') {
        throw new BadRequestException('email with this account is blocked');
      }

      if (existingUser) {
        if (existingUser.isEmailVerified) {
          throw new BadRequestException('Email or phone already in use');
        }

        await this.resendVerification(existingUser);

        return {
          message: 'Verification already sent. Please check your email.',
        };
      }

      if (file) {
        const upload = await this.cloudinaryService.uploadFile(file);
        dto.file = upload.secure_url;
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const userName = this.generateTokenFromName(dto.fullName);

      const user = await this.prisma.user.create({
        data: {
          userName,
          email: dto.email,
          password: hashedPassword,
          fullName: dto.fullName,
          phone: dto.phone,
          image: dto.file || null,
          isEmailVerified: true,
          status: 'ACTIVE',
        },
      });

      const token = this.generateOtp();

      await this.prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      await this.mailService.sendOtpEmail(user.email, token, user.fullName);

      return ApiResponse.success(
        'Verification code sent successfully, check email'
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    if (!user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(user: User) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        hasProfile: true,
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }

    if (dbUser.role === Role.PET_OWNER) {
      throw new BadRequestException(
        'Pet owner cannot login, use pet owner app'
      );
    }

    if (dbUser.status === 'SUSPENDED') {
      throw new ForbiddenException('Account is suspended');
    }

    if (dbUser.status === 'BLOCKED') {
      throw new ForbiddenException('Account is banned');
    }

    if (dbUser.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    const payload: UserInfoJwt = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as Role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return ApiResponse.success('Login successful', {
      accessToken,
      refreshToken,
      isProfileCompleted: dbUser.hasProfile,
    });
  }

  async verifyEmail(token: string) {
    const record = await this.prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      throw new BadRequestException('Invalid token');
    }

    if (record.usedAt) {
      throw new BadRequestException('Token already used');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: {
          isEmailVerified: true,
          status: 'ACTIVE',
        },
      }),
    ]);

    const payload: UserInfoJwt = {
      id: record.user.id,
      email: record.user.email,
      role: record.user.role as Role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return ApiResponse.success('Email verified successfully!', {
      accessToken,
      refreshToken,
    });
  }

  async setRole(userId: string, dto: SetRoleDto) {
    // Fetch user once
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, fullName: true, phone: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.role) throw new BadRequestException('Role already set');

    // Atomic update + profile creation
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Update user role
      const u = await tx.user.update({
        where: { id: userId },
        data: { role: dto.role },
      });

      const profileData = {
        userId: u.id,
        name: user.fullName || '',
        email: user.email,
        phone: user.phone || '',
      };

      if (dto.role === Role.PET_SITTER) {
        await tx.petSitterProfile.create({
          data: { userId: u.id, analytics: '', bio: '', designations: '' },
        });
      } else if (dto.role === Role.PET_HOTEL) {
        await tx.hotelProfile.create({
          data: {
            ...profileData,
            dayStartingTime: '09:00 AM',
            dayEndingTime: '06:00 PM',
            nightStartingTime: '07:00 PM',
            nightEndingTime: '08:00 AM',
          },
        });
      } else if (dto.role === Role.PET_SCHOOL) {
        await tx.petSchoolProfile.create({
          data: { ...profileData },
        });
      } else if (dto.role === Role.VENDOR) {
        await tx.vendorProfile.create({
          data: { ...profileData },
        });
      } else if (dto.role === Role.PET_OWNER) {
        await tx.petOwnerProfile.create({
          data: { userId: u.id },
        });
      }

      return u;
    });

    // JWT payload
    const payload: UserInfoJwt = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: dto.role,
    };

    return ApiResponse.success('Role set successfully', {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, this.refreshTokenConfig),
    });
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.resendVerification(user);
    return ApiResponse.success('Verification code sent successfully');
  }

  async resendVerification(user: any) {
    await this.prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    });

    const token = this.generateOtp();

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await this.mailService.sendOtpEmail(
      user.email as string,
      token,
      user.fullName as string
    );
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isEmailVerified) {
      return {
        message: 'If the email exists, a reset link has been sent.',
      };
    }

    // Remove old tokens
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const token = this.generateOtp();

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // const resetLink = `${this.config.frontendUrl}/reset-password?token=${token}`;

    await this.mailService.sendOtpEmail(user.email, token, user.fullName);

    return ApiResponse.success('Otp sent successfully');
  }

  async verifyResetToken(token: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    return { valid: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.code },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),

      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);
    return ApiResponse.success('Password reset successfully!');
  }

  async handleGoogleCallback(payload: {
    email: string;
    fullName: string;
    image?: string;
    googleId: string;
    role?: ProfileType;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      const userName = this.generateTokenFromName(payload.fullName);
      user = await this.prisma.user.create({
        data: {
          userName,
          email: payload.email,
          fullName: payload.fullName,
          image: payload.image,
          isGoogleLogin: true,
          isEmailVerified: true,
          status: 'ACTIVE',
          password: null,
          phone: null,
          provider: AuthProvider.GOOGLE,
        },
      });
    }

    // const hasProfile = payload.role
    //   ? await this.profileService.hasProfile(user.id, payload.role)
    //   : true;

    const next = user && user.role ? 'dashboard' : `onboarding`;

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role ?? null,
    });

    return { accessToken, next };
  }

  async refreshToken(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return ApiResponse.success('Successful', { id: user.id, token });
  }

  generateOtp() {
    const codeInt = crypto.randomInt(0, 1000000);
    const otp = codeInt.toString().padStart(6, '0');
    return otp;
  }

  async checkIfPhoneNumberUserExists(payload: CheckIfPhoneNumberUserExistsDto) {
    // Check if user exists
    const user = await this.prisma.user.findFirst({
      where: { phone: payload.phone },
    });

    if (!user) {
      return ApiResponse.success('User not found', {
        isUserExists: false,
      });
    }

    if (user.status === 'BLOCKED') {
      throw new BadRequestException('email with this account is blocked');
    }

    if (user.status === 'SUSPENDED') {
      throw new BadRequestException(
        `User is suspended until ${user.suspendUntil?.toISOString() ?? 'unknown'}`
      );
    }

    // Prepare JWT payload
    const jwtPayload: UserInfoJwt = {
      id: user.id,
      email: user.email,
      role: user.role as Role,
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(
      jwtPayload,
      this.refreshTokenConfig
    );

    return ApiResponse.success('User found', {
      isUserExists: true,
      role: user.role,
      accessToken,
      refreshToken,
    });
  }

  async checkIfEmailUserExists(payload: CheckIfEmailUserExistsDto) {
    // Find user by email
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    // User not found
    if (!user) {
      return ApiResponse.success('User not found', {
        isUserExists: false,
      });
    }

    // Handle blocked account
    if (user.status === 'BLOCKED') {
      throw new BadRequestException('Account is blocked');
    }

    // Handle suspended account
    if (user.status === 'SUSPENDED') {
      throw new BadRequestException(
        `User is suspended until ${user.suspendUntil?.toISOString() ?? 'unknown'}`
      );
    }

    // Prepare JWT payload
    const jwtPayload: UserInfoJwt = {
      id: user.id,
      email: user.email,
      role: user.role as Role,
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(
      jwtPayload,
      this.refreshTokenConfig
    );

    return ApiResponse.success('User found', {
      isUserExists: true,
      role: user.role,
      accessToken,
      refreshToken,
    });
  }

  async checkUserByFirebaseToken(firebaseToken: string) {
    if (!firebaseToken) {
      throw new BadRequestException('Firebase token is required');
    }

    let decoded: DecodedIdToken;
    try {
      // Verify Firebase ID token
      decoded = await this.firebaseService.verifyIdToken(firebaseToken);
    } catch (err) {
      console.log(
        '🚀 ~ auth.service.ts:567 ~ AuthService ~ checkUserByFirebaseToken ~ err:',
        err
      );

      throw new BadRequestException('Invalid Firebase token');
    }

    // Firebase token can have either email or phone_number
    const { email, phone_number: phoneNumber } = decoded;

    if (!email && !phoneNumber) {
      throw new BadRequestException(
        'Firebase token does not contain email or phone number'
      );
    }

    // Find user in your database by email or phone
    const user = await this.prisma.user.findFirst({
      where: email ? { email } : { phone: phoneNumber },
    });

    if (!user) {
      return ApiResponse.success('User not found', { isUserExists: false });
    }

    // Handle blocked or suspended accounts
    if (user.status === 'BLOCKED') {
      throw new BadRequestException('Account is blocked');
    }

    if (user.status === 'SUSPENDED') {
      throw new BadRequestException(
        `User is suspended until ${user.suspendUntil?.toISOString() ?? 'unknown'}`
      );
    }

    // Prepare JWT payload
    const jwtPayload: UserInfoJwt = {
      id: user.id,
      email: user.email,
      role: user.role as Role,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(
      jwtPayload,
      this.refreshTokenConfig
    );

    return ApiResponse.success('User found', {
      isUserExists: true,
      role: user.role,
      accessToken,
      refreshToken,
      decoded,
    });
  }

  // async petOwnerSignUp(payload: PetOwnerSignUpDto) {
  //   if (!payload.firebaseToken) {
  //     throw new BadRequestException('Firebase token is required');
  //   }

  //   // 1️⃣ Verify Firebase token
  //   let decoded: DecodedIdToken;
  //   try {
  //     decoded = await this.firebaseService.verifyIdToken(payload.firebaseToken);
  //   } catch (err) {
  //     console.log(
  //       '🚀 ~ auth.service.ts:636 ~ AuthService ~ petOwnerSignUp ~ err:',
  //       err
  //     );

  //     throw new BadRequestException('Invalid Firebase token');
  //   }

  //   // 2️⃣ Determine email or phone from token
  //   const emailFromFirebase = decoded.email;

  //   console.log(
  //     '🚀 ~ auth.service.ts:646 ~ AuthService ~ petOwnerSignUp ~ decoded:',
  //     decoded
  //   );

  //   const phoneFromFirebase = decoded.phone_number;

  //   if (!emailFromFirebase && !phoneFromFirebase) {
  //     throw new BadRequestException(
  //       'Firebase token does not contain email or phone number'
  //     );
  //   }

  //   const orConditions: Prisma.UserWhereInput[] = [];

  //   if (emailFromFirebase) orConditions.push({ email: emailFromFirebase });
  //   if (phoneFromFirebase) orConditions.push({ phone: phoneFromFirebase });

  //   // 3️⃣ Check if a user already exists with email or phone from Firebase
  //   const existingUser = await this.prisma.user.findFirst({
  //     where: {
  //       OR: orConditions,
  //     },
  //   });

  //   if (existingUser) {
  //     if (existingUser.status === 'BLOCKED') {
  //       throw new BadRequestException('Account is blocked');
  //     }
  //     throw new BadRequestException('User already exists');
  //   }

  //   // 4️⃣ Check if username already exists
  //   const existingUserName = await this.prisma.user.findUnique({
  //     where: { userName: payload.userName },
  //   });

  //   if (existingUserName) {
  //     throw new BadRequestException('Username already exists');
  //   }

  //   // 5️⃣ Create user, profile, address atomically
  //   const createdUser = await this.prisma.$transaction(async (prisma) => {
  //     const user = await prisma.user.create({
  //       data: {
  //         userName: payload.userName,
  //         email: emailFromFirebase ?? payload.email,
  //         phone: phoneFromFirebase ?? payload.phone,
  //         fullName: payload.fullName,
  //         role: Role.PET_OWNER,
  //         password: '', // Firebase handles auth
  //         isEmailVerified: !!emailFromFirebase,
  //         status: 'ACTIVE',
  //       },
  //     });

  //     const profile = await prisma.petOwnerProfile.create({
  //       data: { userId: user.id },
  //     });

  //     await prisma.petOwnerAddress.create({
  //       data: {
  //         petOwnerId: profile.id,
  //         city: payload.city,
  //         country: payload.country,
  //         postalCode: payload.postalCode,
  //         streetAddress: payload.streetAddress,
  //       },
  //     });

  //     return user;
  //   });

  //   // 6️⃣ Generate JWT tokens for your app
  //   const jwtPayload: UserInfoJwt = {
  //     id: createdUser.id,
  //     email: createdUser.email,
  //     role: createdUser.role as Role,
  //   };

  //   const accessToken = this.jwtService.sign(jwtPayload);
  //   const refreshToken = this.jwtService.sign(
  //     jwtPayload,
  //     this.refreshTokenConfig
  //   );

  //   return ApiResponse.success('User created successfully', {
  //     role: createdUser.role,
  //     accessToken,
  //     refreshToken,
  //   });
  // }

  // TODO: Remove this code

  async petOwnerSignUp(payload: PetOwnerSignUpDto) {
    // Check if email or phone already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { phone: payload.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.status === 'BLOCKED') {
        throw new BadRequestException('Account is blocked');
      }

      throw new BadRequestException(
        'User with this email or phone already exists'
      );
    }

    // Check if username already exists
    const existingUserName = await this.prisma.user.findUnique({
      where: { userName: payload.userName },
    });

    if (existingUserName) {
      throw new BadRequestException('Username already exists');
    }

    // Atomic creation: user + profile + address
    const createdUser = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          userName: payload.userName,
          email: payload.email,
          fullName: payload.fullName,
          phone: payload.phone,
          role: Role.PET_OWNER,
          password: '', // OTP / Firebase based auth
          isEmailVerified: payload.isEmailLogin,
          status: 'ACTIVE',
        },
      });

      const profile = await prisma.petOwnerProfile.create({
        data: { userId: user.id },
      });

      await prisma.petOwnerAddress.create({
        data: {
          petOwnerId: profile.id,
          city: payload.city,
          country: payload.country,
          postalCode: payload.postalCode,
          streetAddress: payload.streetAddress,
        },
      });

      return user;
    });

    // JWT payload
    const jwtPayload: UserInfoJwt = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role as Role,
    };

    // Tokens
    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(
      jwtPayload,
      this.refreshTokenConfig
    );

    return ApiResponse.success('User created successfully', {
      accessToken,
      refreshToken,
    });
  }

  async changeRole(payload: ChangeRoleDto) {
    if (!payload.email && !payload.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const where = payload.email
      ? { email: payload.email }
      : { phone: payload.phone };

    const user = await this.prisma.user.update({
      where,
      data: { role: payload.role },
    });

    return ApiResponse.success('Role changed successfully', user);
  }
}
