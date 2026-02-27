import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronJobService } from './common/job/cron-job.service';
import { CloudinaryModule } from './common/utils/cloudinary/cloudinary.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { BookmarkModule } from './modules/community/bookmark/bookmark.module';
import { CommentsModule } from './modules/community/comments/comments.module';
import { CommunityModule } from './modules/community/community.module';
import { FriendshipModule } from './modules/community/friendship/friendship.module';
import { ReelModule } from './modules/community/reel/reel.module';
import { StoryModule } from './modules/community/story/story.module';
import { KycModule } from './modules/kyc/kyc.module';
import { MailModule } from './modules/mail/mail.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PetHotelModule } from './modules/pet-hotel/pet-hotel.module';
import { PetOwnerModule } from './modules/pet-owner/pet-owner.module';
import { PetSchoolModule } from './modules/pet-school/pet-school.module';
import { PetSitterModule } from './modules/pet-sitter/pet-sitter.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { ReportModule } from './modules/admin/report/report.module';
import { UserBlockModule } from './modules/user/user-block/user-block.module';
import { UserInteractionModule } from './common/utils/user-interaction/user-interaction.module';
import { UserMuteModule } from './modules/user/user-mute/user-mute.module';
import { HideContentModule } from './modules/community/hide-content/hide-content.module';
import { PetProfileModule } from './modules/pet-owner/pet-profile/pet-profile.module';
import { MomentsModule } from './modules/community/moments/moments.module';
import { ServiceModule } from './modules/pet-sitter/service/service.module';
import { ServiceReviewModule } from './modules/pet-sitter/service/service-review/service-review.module';
import { SavedPetSitterModule } from './modules/pet-sitter/saved-pet-sitter/saved-pet-sitter.module';
import { UserNotificationSettingsModule } from './modules/user/user-notification-settings/user-notification-settings.module';
import { PetSitterPackageModule } from './modules/pet-sitter/pet-sitter-package/pet-sitter-package.module';
import { ProductReviewModule } from './modules/vendor/product/product-review/product-review.module';
import { PetSitterBookingModule } from './modules/pet-sitter/pet-sitter-booking/pet-sitter-booking.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { PetSitterPackageReviewModule } from './modules/pet-sitter/pet-sitter-package/pet-sitter-package-review/pet-sitter-package-review.module';
import { PetSitterReviewModule } from './modules/pet-sitter/pet-sitter-review/pet-sitter-review.module';
import { PlatformSettingsModule } from './modules/admin/platform-settings/platform-settings.module';
import { PetSitterDashboardModule } from './modules/pet-sitter/pet-sitter-dashboard/pet-sitter-dashboard.module';
import { PetOwnerSummaryModule } from './modules/pet-owner/pet-owner-summary/pet-owner-summary.module';
import { AdminDashboardOverviewModule } from './modules/admin/admin-dashboard-overview/admin-dashboard-overview.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
      global: true,
    }),
    AuthModule,
    PrismaModule,
    CloudinaryModule,
    VendorModule,
    MailModule,
    PetSitterModule,
    PetHotelModule,
    PetSchoolModule,
    PetOwnerModule,
    AdminModule,
    CommunityModule,
    KycModule,
    PaymentModule,
    ChatModule,
    BookmarkModule,
    FriendshipModule,
    CommentsModule,
    StoryModule,
    ReelModule,
    UserModule,
    ReportModule,
    UserBlockModule,
    UserInteractionModule,
    UserMuteModule,
    HideContentModule,
    PetProfileModule,
    MomentsModule,
    ServiceModule,
    ServiceReviewModule,
    SavedPetSitterModule,
    UserNotificationSettingsModule,
    PetSitterPackageModule,
    ProductReviewModule,
    PetSitterBookingModule,
    FirebaseModule,
    PetSitterPackageReviewModule,
    PetSitterReviewModule,
    PlatformSettingsModule,
    PetSitterDashboardModule,
    PetOwnerSummaryModule,
    AdminDashboardOverviewModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronJobService],
})
export class AppModule {}
