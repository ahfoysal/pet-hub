export class UserInfoJwt {
  id: string;
  email: string;
  role: Role;
}

export enum Role {
  PET_OWNER = 'PET_OWNER',
  PET_SITTER = 'PET_SITTER',
  PET_SCHOOL = 'PET_SCHOOL',
  PET_HOTEL = 'PET_HOTEL',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}
