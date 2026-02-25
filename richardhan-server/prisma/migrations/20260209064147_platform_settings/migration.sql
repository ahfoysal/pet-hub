-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'PLATFORM_SETTINGS',
    "platformFee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "commissionRate" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSettingsHistory" (
    "id" TEXT NOT NULL,
    "platformFee" DECIMAL(65,30) NOT NULL,
    "commissionRate" DECIMAL(65,30) NOT NULL,
    "version" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "platformSettingsId" TEXT NOT NULL,

    CONSTRAINT "PlatformSettingsHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlatformSettingsHistory" ADD CONSTRAINT "PlatformSettingsHistory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformSettingsHistory" ADD CONSTRAINT "PlatformSettingsHistory_platformSettingsId_fkey" FOREIGN KEY ("platformSettingsId") REFERENCES "PlatformSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
