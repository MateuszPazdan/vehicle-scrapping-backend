-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('DISMANTLED', 'RECEIVED_FOR_DISMANTLING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "roles" "Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "pesel" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year_of_production" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "registration_certificate_number" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'RECEIVED_FOR_DISMANTLING',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismantledAt" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DismantlingCertificate" (
    "id" SERIAL NOT NULL,
    "certificateNumber" INTEGER NOT NULL,
    "fileLink" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DismantlingCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteEntry" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "wasteTypeId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storageLocationId" INTEGER NOT NULL,

    CONSTRAINT "WasteEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteTransaction" (
    "id" SERIAL NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wasteTypeId" INTEGER NOT NULL,
    "storageLocationId" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WasteTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WasteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageLocation" (
    "id" SERIAL NOT NULL,
    "locationNr" TEXT NOT NULL,
    "currentMass" DOUBLE PRECISION NOT NULL,
    "wasteTypeId" INTEGER NOT NULL,

    CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OwnerToVehicle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OwnerToVehicle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_pesel_key" ON "Owner"("pesel");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_id_number_key" ON "Owner"("id_number");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_number_key" ON "Vehicle"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_certificate_number_key" ON "Vehicle"("registration_certificate_number");

-- CreateIndex
CREATE UNIQUE INDEX "DismantlingCertificate_certificateNumber_key" ON "DismantlingCertificate"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DismantlingCertificate_vehicleId_key" ON "DismantlingCertificate"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_name_key" ON "WasteType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StorageLocation_locationNr_key" ON "StorageLocation"("locationNr");

-- CreateIndex
CREATE INDEX "_OwnerToVehicle_B_index" ON "_OwnerToVehicle"("B");

-- AddForeignKey
ALTER TABLE "DismantlingCertificate" ADD CONSTRAINT "DismantlingCertificate_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteTransaction" ADD CONSTRAINT "WasteTransaction_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteTransaction" ADD CONSTRAINT "WasteTransaction_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageLocation" ADD CONSTRAINT "StorageLocation_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OwnerToVehicle" ADD CONSTRAINT "_OwnerToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OwnerToVehicle" ADD CONSTRAINT "_OwnerToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
