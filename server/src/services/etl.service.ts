import prisma from '../config/db.js';

export const runETLProcess = async (submissionId: string) => {
  console.log(`[ETL Service] Starting ETL for submission ID: ${submissionId}`);

  try {
    // 1. Get the submission with period and unit details
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        period: true,
        unit: true
      }
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    if (submission.status !== 'APPROVED') {
      console.log(`[ETL Service] Submission is not APPROVED (current status: ${submission.status}). Skipping ETL.`);
      return;
    }

    const { unitCode, periodId, formCode, period, unit } = submission;
    const year = period.year;

    // Determine phase (Giai đoạn) based on year (2021-2025 vs 2026-2030)
    const isPhase2 = year >= 2026;
    const maGiaiDoan = isPhase2 ? 2 : 1;
    const tenGiaiDoan = isPhase2 ? '2026-2030' : '2021-2025';

    // Parse maDonVi (Must be Int in schema)
    let maDonVi = 9999;
    const parsedCode = parseInt(unitCode);
    if (!isNaN(parsedCode)) {
      maDonVi = parsedCode;
    } else {
      // Create a deterministic hash if it is a string like VN-TD
      let hash = 0;
      for (let i = 0; i < unitCode.length; i++) {
        hash = unitCode.charCodeAt(i) + ((hash << 5) - hash);
      }
      maDonVi = Math.abs(hash % 100000);
    }

    // 2. Find or create ProgramGeneralInfo
    let generalInfo = await prisma.programGeneralInfo.findFirst({
      where: {
        unitCode,
        namKeHoach: year,
        periodId
      }
    });

    if (!generalInfo) {
      generalInfo = await prisma.programGeneralInfo.create({
        data: {
          unitCode,
          maDonVi,
          tenDonVi: unit.name,
          maCtmtqg: 1, // 1: Nông Thôn Mới
          tenCtmtqg: 'Chương trình mục tiêu quốc gia xây dựng nông thôn mới',
          maGiaiDoan,
          tenGiaiDoan,
          namKeHoach: year,
          periodId
        }
      });
    }

    const dataRows = Array.isArray(submission.data) ? submission.data : [];

    // 3. Process specific form data
    if (formCode === 'Biểu 10') {
      // Map to ProgramObjectives
      // Clean existing objectives for this generalInfoId
      await prisma.programObjective.deleteMany({
        where: { generalInfoId: generalInfo.id }
      });

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i] as any;
        await prisma.programObjective.create({
          data: {
            generalInfoId: generalInfo.id,
            maMucTieu: i + 1,
            tenMucTieu: row.category || `Tiêu chí ${i + 1}`,
            donViDoLuong: row.unit || 'Tiêu chí',
            kyBaoCao: period.term === '6_MONTH' ? '6 tháng' : 'Cả năm',
            thucHienMucTieu: String(row.currentS1 || '0'),
            thoiDiemBaoCao: new Date().toISOString().split('T')[0],
            uocCaNam: String(row.planS2 || '0')
          }
        });
      }
      console.log(`[ETL Service] Successfully imported ${dataRows.length} objectives from Biểu 10.`);

    } else if (formCode === 'Biểu 11') {
      // Map to ProgramCareerCapital & FinancialDisbursement
      await prisma.programCareerCapital.deleteMany({
        where: { generalInfoId: generalInfo.id }
      });
      await prisma.financialDisbursement.deleteMany({
        where: { generalInfoId: generalInfo.id }
      });

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i] as any;
        const nstw_sn = Number(row.hd_nstw_sn || 0);
        const nstw_dtpt = Number(row.hd_nstw_dtpt || 0);
        const nsdp = Number(row.hd_nsdp || 0);

        // Save career capital
        await prisma.programCareerCapital.create({
          data: {
            generalInfoId: generalInfo.id,
            maDuAnTP: i + 1,
            tenDuAnTP: row.category || 'Dự án thành phần',
            maTieuDuAn: 1,
            tenTieuDuAn: 'Chi tiết nguồn lực sự nghiệp',
            vonSuNghiep: nstw_sn
          }
        });

        // Save disbursement
        await prisma.financialDisbursement.create({
          data: {
            generalInfoId: generalInfo.id,
            kyBaoCao: period.term === '6_MONTH' ? '6 tháng' : 'Cả năm',
            giaiNganVTN: nstw_dtpt,
            giaiNganVNN: 0,
            giaiNganCTX: nsdp,
            maNguonVon: 1,
            tenNguonVon: row.category || 'Nguồn vốn'
          }
        });
      }
      console.log(`[ETL Service] Successfully imported ${dataRows.length} rows from Biểu 11.`);

    } else if (formCode === 'Biểu 12') {
      // Map to MediumTermDetail & AnnualDetail (public investment projects)
      await prisma.mediumTermDetail.deleteMany({
        where: { generalInfoId: generalInfo.id }
      });
      await prisma.annualDetail.deleteMany({
        where: { generalInfoId: generalInfo.id }
      });

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i] as any;
        const budget = Number(row.totalBudget || 0);
        const startYr = Number(row.startDate || year);
        const endYr = Number(row.endDate || year);

        // Medium term allocation details
        await prisma.mediumTermDetail.create({
          data: {
            generalInfoId: generalInfo.id,
            donViId: maDonVi,
            maLoaiDuAn: 1,
            tenLoaiDuAn: 'Đầu tư cơ sở hạ tầng nông thôn',
            tenDuAn: row.projectName || 'Dự án NTM',
            diaDiemXayDung: row.location || 'Địa bàn xã',
            nangLucThietKe: 'Theo quy mô được duyệt',
            namBatDau: startYr,
            namKetThuc: endYr,
            soQuyetDinh: `QĐ-DA-${i + 1}`,
            tmdt: budget,
            tmdt_nstw: budget * 0.5,
            vonGiao: budget,
            vonGiao_nstw: budget * 0.5
          }
        });

        // Annual investment details
        await prisma.annualDetail.create({
          data: {
            generalInfoId: generalInfo.id,
            maDuAn: i + 1,
            luyKeDenNamTruoc: 0,
            luyKeDenNamTruoc_nstw: 0,
            luyKeDenNamTruoc_nsdp: 0,
            luyKeGiaiNganDenNamTruoc: 0,
            luyKeGiaiNganDenNamTruoc_nstw: 0,
            luyKeGiaiNganDenNamTruoc_nsdp: 0,
            vonKeoDai: 0,
            vonKeoDai_nstw: 0,
            vonKeoDai_nsdp: 0,
            giaiNganKeoDai: 0,
            giaiNganKeoDai_nstw: 0,
            giaiNganKeoDai_nsdp: 0,
            vonGiaoNamHienTai: budget,
            vonGiaoNamHienTai_nstw: budget * 0.5,
            vonGiaoNamHienTai_nsdp: budget * 0.5,
            giaiNganNamHienTai: budget * 0.7, // Assume 70% disbursement in current year
            giaiNganNamHienTai_nstw: budget * 0.35,
            giaiNganNamHienTai_nsdp: budget * 0.35,
            ghiChu: 'Trích xuất tự động từ Danh mục dự án đầu tư công của xã'
          }
        });
      }
      console.log(`[ETL Service] Successfully imported ${dataRows.length} projects from Biểu 12.`);
    }

    console.log(`[ETL Service] ETL process completed successfully for submission ID: ${submissionId}`);
  } catch (error: any) {
    console.error(`[ETL Service] Error during ETL execution: `, error);
    throw error;
  }
};
