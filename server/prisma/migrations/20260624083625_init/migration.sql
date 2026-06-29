-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "parentCode" TEXT,
    "communeGroup" TEXT,
    "ntmStatus" TEXT NOT NULL DEFAULT 'NONE',
    "ntmApprovedAt" TIMESTAMP(3),

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "unitCode" TEXT,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "columns" JSONB NOT NULL,
    "rowsConfig" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "editorId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppraisalLog" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "appraiserId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comment" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppraisalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupervisionLog" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "complianceLevel" TEXT NOT NULL,
    "comment" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupervisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NtmAppraisal" (
    "id" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "appraiserId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "decisionNumber" TEXT,
    "decisionDate" TIMESTAMP(3),
    "approverName" TEXT,
    "councilVoteRatio" DECIMAL(5,2),
    "citizenSatisfactionRatio" DECIMAL(5,2),
    "councilMeetingDate" TIMESTAMP(3),
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NtmAppraisal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofFile" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProofFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramGeneralInfo" (
    "id" SERIAL NOT NULL,
    "unitCode" TEXT NOT NULL,
    "maDonVi" INTEGER NOT NULL,
    "tenDonVi" TEXT NOT NULL,
    "maCtmtqg" INTEGER NOT NULL,
    "tenCtmtqg" TEXT NOT NULL,
    "maGiaiDoan" INTEGER NOT NULL,
    "tenGiaiDoan" TEXT NOT NULL,
    "namKeHoach" INTEGER NOT NULL,
    "periodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramGeneralInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramObjective" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "maMucTieu" INTEGER NOT NULL,
    "tenMucTieu" TEXT NOT NULL,
    "donViDoLuong" TEXT NOT NULL,
    "kyBaoCao" TEXT NOT NULL,
    "thucHienMucTieu" TEXT NOT NULL,
    "thoiDiemBaoCao" TEXT NOT NULL,
    "uocCaNam" TEXT NOT NULL,

    CONSTRAINT "ProgramObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramDocument" (
    "id" SERIAL NOT NULL,
    "maLoaiVanBan" INTEGER NOT NULL,
    "tenLoaiVanBan" TEXT NOT NULL,
    "tenVanBan" TEXT NOT NULL,
    "coQuanBanhHanh" TEXT NOT NULL,
    "soKyHieu" TEXT NOT NULL,

    CONSTRAINT "ProgramDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramCareerCapital" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "maDuAnTP" INTEGER NOT NULL,
    "tenDuAnTP" TEXT NOT NULL,
    "maTieuDuAn" INTEGER NOT NULL,
    "tenTieuDuAn" TEXT NOT NULL,
    "vonSuNghiep" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "ProgramCareerCapital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialDisbursement" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "kyBaoCao" TEXT NOT NULL,
    "giaiNganVTN" DECIMAL(18,6) NOT NULL,
    "giaiNganVNN" DECIMAL(18,6) NOT NULL,
    "giaiNganCTX" DECIMAL(18,6) NOT NULL,
    "maNguonVon" INTEGER NOT NULL,
    "tenNguonVon" TEXT NOT NULL,

    CONSTRAINT "FinancialDisbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediumTermAllocation" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "vonPhanBo" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "MediumTermAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediumTermDetail" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "donViId" INTEGER NOT NULL,
    "maLoaiDuAn" INTEGER NOT NULL,
    "tenLoaiDuAn" TEXT NOT NULL,
    "tenDuAn" TEXT NOT NULL,
    "diaDiemXayDung" TEXT NOT NULL,
    "nangLucThietKe" TEXT NOT NULL,
    "namBatDau" INTEGER NOT NULL,
    "namKetThuc" INTEGER NOT NULL,
    "soQuyetDinh" TEXT NOT NULL,
    "tmdt" DECIMAL(18,6) NOT NULL,
    "tmdt_nstw" DECIMAL(18,6) NOT NULL,
    "vonGiao" DECIMAL(18,6) NOT NULL,
    "vonGiao_nstw" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "MediumTermDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualAllocation" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "vonPhanBo" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "AnnualAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualDetail" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "maDuAn" INTEGER NOT NULL,
    "luyKeDenNamTruoc" DECIMAL(18,6) DEFAULT 0,
    "luyKeDenNamTruoc_nstw" DECIMAL(18,6) DEFAULT 0,
    "luyKeDenNamTruoc_nsdp" DECIMAL(18,6) DEFAULT 0,
    "luyKeGiaiNganDenNamTruoc" DECIMAL(18,6) DEFAULT 0,
    "luyKeGiaiNganDenNamTruoc_nstw" DECIMAL(18,6) DEFAULT 0,
    "luyKeGiaiNganDenNamTruoc_nsdp" DECIMAL(18,6) DEFAULT 0,
    "vonKeoDai" DECIMAL(18,6) DEFAULT 0,
    "vonKeoDai_nstw" DECIMAL(18,6) DEFAULT 0,
    "vonKeoDai_nsdp" DECIMAL(18,6) DEFAULT 0,
    "giaiNganKeoDai" DECIMAL(18,6) DEFAULT 0,
    "giaiNganKeoDai_nstw" DECIMAL(18,6) DEFAULT 0,
    "giaiNganKeoDai_nsdp" DECIMAL(18,6) DEFAULT 0,
    "vonGiaoNamHienTai" DECIMAL(18,6) DEFAULT 0,
    "vonGiaoNamHienTai_nstw" DECIMAL(18,6) DEFAULT 0,
    "vonGiaoNamHienTai_nsdp" DECIMAL(18,6) DEFAULT 0,
    "giaiNganNamHienTai" DECIMAL(18,6) DEFAULT 0,
    "giaiNganNamHienTai_nstw" DECIMAL(18,6) DEFAULT 0,
    "giaiNganNamHienTai_nsdp" DECIMAL(18,6) DEFAULT 0,
    "ghiChu" TEXT,

    CONSTRAINT "AnnualDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateBudgetEstimate" (
    "id" SERIAL NOT NULL,
    "generalInfoId" INTEGER NOT NULL,
    "vonSuNghiep" DECIMAL(18,6) NOT NULL,
    "chiThuongXuyen" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "StateBudgetEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NtmIndicatorDictionary" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "reportFrequency" TEXT NOT NULL,
    "dataSource" TEXT,
    "provincialResponsibility" TEXT,
    "centralResponsibility" TEXT,

    CONSTRAINT "NtmIndicatorDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NtmIndicatorValue" (
    "id" SERIAL NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "unitCode" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "targetValue" DECIMAL(18,6),
    "actualValue" DECIMAL(18,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NtmIndicatorValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "systemId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsCount" INTEGER NOT NULL DEFAULT 0,
    "operatorId" TEXT,
    "message" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_code_key" ON "Unit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_periodId_formCode_unitCode_key" ON "FormSubmission"("periodId", "formCode", "unitCode");

-- CreateIndex
CREATE UNIQUE INDEX "NtmIndicatorDictionary_code_key" ON "NtmIndicatorDictionary"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NtmIndicatorValue_indicatorId_unitCode_periodId_year_key" ON "NtmIndicatorValue"("indicatorId", "unitCode", "periodId", "year");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitCode_fkey" FOREIGN KEY ("unitCode") REFERENCES "Unit"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formCode_fkey" FOREIGN KEY ("formCode") REFERENCES "FormTemplate"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_unitCode_fkey" FOREIGN KEY ("unitCode") REFERENCES "Unit"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppraisalLog" ADD CONSTRAINT "AppraisalLog_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppraisalLog" ADD CONSTRAINT "AppraisalLog_appraiserId_fkey" FOREIGN KEY ("appraiserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisionLog" ADD CONSTRAINT "SupervisionLog_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisionLog" ADD CONSTRAINT "SupervisionLog_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmAppraisal" ADD CONSTRAINT "NtmAppraisal_unitCode_fkey" FOREIGN KEY ("unitCode") REFERENCES "Unit"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmAppraisal" ADD CONSTRAINT "NtmAppraisal_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmAppraisal" ADD CONSTRAINT "NtmAppraisal_appraiserId_fkey" FOREIGN KEY ("appraiserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofFile" ADD CONSTRAINT "ProofFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramGeneralInfo" ADD CONSTRAINT "ProgramGeneralInfo_unitCode_fkey" FOREIGN KEY ("unitCode") REFERENCES "Unit"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramGeneralInfo" ADD CONSTRAINT "ProgramGeneralInfo_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramObjective" ADD CONSTRAINT "ProgramObjective_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCareerCapital" ADD CONSTRAINT "ProgramCareerCapital_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDisbursement" ADD CONSTRAINT "FinancialDisbursement_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediumTermAllocation" ADD CONSTRAINT "MediumTermAllocation_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediumTermDetail" ADD CONSTRAINT "MediumTermDetail_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualAllocation" ADD CONSTRAINT "AnnualAllocation_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualDetail" ADD CONSTRAINT "AnnualDetail_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateBudgetEstimate" ADD CONSTRAINT "StateBudgetEstimate_generalInfoId_fkey" FOREIGN KEY ("generalInfoId") REFERENCES "ProgramGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmIndicatorValue" ADD CONSTRAINT "NtmIndicatorValue_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "NtmIndicatorDictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmIndicatorValue" ADD CONSTRAINT "NtmIndicatorValue_unitCode_fkey" FOREIGN KEY ("unitCode") REFERENCES "Unit"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NtmIndicatorValue" ADD CONSTRAINT "NtmIndicatorValue_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
