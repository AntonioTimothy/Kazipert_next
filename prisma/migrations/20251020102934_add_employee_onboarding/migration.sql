-- CreateTable
CREATE TABLE "onboarding_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "steps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_details" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "maritalStatus" TEXT,
    "county" TEXT,
    "physicalAddress" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "idNumber" TEXT,
    "passportNumber" TEXT,
    "passportIssueDate" TIMESTAMP(3),
    "passportExpiryDate" TIMESTAMP(3),
    "kraPin" TEXT,
    "workExperience" TEXT,
    "skills" TEXT[],
    "languages" JSONB,
    "idDocumentUrl" TEXT,
    "passportDocumentUrl" TEXT,
    "kraDocumentUrl" TEXT,
    "goodConductUrl" TEXT,
    "educationCertUrl" TEXT,
    "workCertUrl" TEXT,
    "medicalDocumentUrl" TEXT,
    "faceVerified" BOOLEAN NOT NULL DEFAULT false,
    "documentsVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studioName" TEXT,
    "studioLocation" TEXT,
    "sessionDate" TIMESTAMP(3),
    "photos" JSONB,
    "faceMatchScore" DOUBLE PRECISION,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hospitalName" TEXT,
    "testDate" TIMESTAMP(3),
    "results" JSONB,
    "fitToWork" BOOLEAN DEFAULT false,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_progress_userId_key" ON "onboarding_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_details_userId_key" ON "kyc_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "studio_sessions_userId_key" ON "studio_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_userId_key" ON "medical_records"("userId");

-- AddForeignKey
ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_details" ADD CONSTRAINT "kyc_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_sessions" ADD CONSTRAINT "studio_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
