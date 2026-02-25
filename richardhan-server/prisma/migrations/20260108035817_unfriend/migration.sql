-- AlterEnum
ALTER TYPE "FriendRequestStatus" ADD VALUE 'ACCEPTED';

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "unfriendedAt" TIMESTAMP(3);
