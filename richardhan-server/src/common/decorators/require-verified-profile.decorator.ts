import { SetMetadata } from '@nestjs/common';

export const REQUIRE_VERIFIED_PROFILE = 'require_verified_profile';

export const RequireVerifiedProfile = () =>
  SetMetadata(REQUIRE_VERIFIED_PROFILE, true);
