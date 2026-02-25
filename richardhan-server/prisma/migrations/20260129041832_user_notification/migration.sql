-- CreateTable
CREATE TABLE "UserNotificationsSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enableEmail" BOOLEAN NOT NULL DEFAULT true,
    "enablePush" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserNotificationsSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationsSettings_userId_key" ON "UserNotificationsSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserNotificationsSettings" ADD CONSTRAINT "UserNotificationsSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
