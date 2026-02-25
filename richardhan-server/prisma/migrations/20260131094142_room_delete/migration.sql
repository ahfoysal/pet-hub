-- DropForeignKey
ALTER TABLE "RoomAvailability" DROP CONSTRAINT "RoomAvailability_roomId_fkey";

-- AddForeignKey
ALTER TABLE "RoomAvailability" ADD CONSTRAINT "RoomAvailability_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
