export interface CriterionRow {
  id: number;
  tt?: string;
  category: string;
  unit: string;
  group1: {
    prevYear: number;
    currentS1: number;
    planS2: number;
  };
  group2: {
    prevYear: number;
    currentS1: number;
    planS2: number;
  };
  group3: {
    prevYear: number;
    currentS1: number;
    planS2: number;
  };
  note: string;
}

export interface ResourceInvestRow {
  id: number;
  isHeader?: boolean;
  sectionCode?: 'I' | 'II' | 'III';
  category: string;
  quantity: number;
  hd_nstw_dtpt: number;
  hd_nstw_sn: number;
  hd_nsdp: number;
  hd_longGhep: number;
  hd_tinDung: number;
  hd_doanhNghiep: number;
  hd_danGop: number;
  kh_nstw_dtpt: number;
  kh_nstw_sn: number;
  kh_nsdp: number;
  kh_longGhep: number;
  kh_tinDung: number;
  kh_doanhNghiep: number;
  kh_danGop: number;
  parentId?: number;
  note: string;
}

export type SubmissionStatus = 'DRAFT' | 'UPDATING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'SUPERVISED';

export interface ReportMeta {
  title: string;
  subTitle: string;
  code: string;
  status: SubmissionStatus;
  deadline: string;
  updatedAt: string;
  editor: string;
  role: string;
  proofFiles: ProofFile[];
}

export interface ProofFile {
  name: string;
  size: number;
  uploadedAt: string;
  type: string;
}

export interface NotificationItem {
  id: string;
  content: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}

export interface SidebarMenuItem {
  id: 'overview' | 'reports' | 'criteria' | 'statistics' | 'evaluation' | 'supervision' | 'category_criteria' | 'admin_units' | 'accounts' | 'form_designer' | 'indicator_statistics';
  label: string;
  icon: string;
}

export interface Criterion {
  id: string;
  code: string;
  title: string;
  description: string;
  indicator: string;
  weight: string;
  category?: string;
  group1Threshold?: string;
  group2Threshold?: string;
  group3Threshold?: string;
  thresholdType?: 'boolean' | 'percentage' | string;
  proofs?: string[];
}

export interface AppraisalLog {
  appraiserName: string;
  comment: string;
  updatedAt: string;
  decision: 'APPROVED' | 'REJECTED';
}

export interface SupervisionLog {
  supervisorName: string;
  comment: string;
  updatedAt: string;
  complianceLevel: string; // e.g. "Xuất sắc", "Đạt yêu cầu", "Cần cải thiện"
}

export interface FormReport {
  id: string; // e.g. "periodId-form04"
  code: string; // e.g. "Biểu 04"
  title: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'SUPERVISED' | 'REJECTED';
  updatedAt: string;
  editor: string;
  proofFiles: ProofFile[];
  data: any[];
  appraisal?: AppraisalLog;
  supervision?: SupervisionLog;
}

export interface ReportPeriod {
  id: string;
  name: string;
  year: string;
  term: string; // e.g., "6 tháng đầu năm", "Toàn diện cả năm"
  deadline: string;
  forms: FormReport[];
  type?: 'PROVINCE' | 'COMMUNE';
  targets?: string[];
}

export interface UserSession {
  username: string;
  fullName: string;
  role: 'EDITOR' | 'APPRAISER' | 'SUPERVISOR';
  permissions?: string[];
}

export interface CommuneSubmission {
  id: string;
  name: string;
  code: string;
  province: string;
  submitted: number;
  total: number;
  status: 'APPROVED' | 'SUBMITTED' | 'REVISION' | 'PENDING';
  updatedAt: string;
  group?: 'I' | 'II' | 'III';
}

export interface ProvinceSubmission {
  id: string;
  name: string;
  code: string;
  submitted: number;
  total: number;
  status: 'APPROVED' | 'SUBMITTED' | 'REVISION' | 'PENDING';
  updatedAt: string;
  region: string;
}

export interface ProvinceItem {
  code: string;
  name: string;
}

export interface AccountItem {
  id: string;
  username: string;
  fullName: string;
  role: 'EDITOR' | 'APPRAISER' | 'SUPERVISOR';
  department: string;
  permissions: string[];
}

export interface FormColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  width?: number;
}

export interface FormRowConfig {
  id: number;
  tt?: string;
  category: string;
  unit: string;
  defaultNote?: string;
}

export interface FormTemplate {
  id: string;
  code: string;
  title: string;
  columns: FormColumn[];
  rows: FormRowConfig[];
  description?: string;
}

export interface IndicatorConfig {
  id: string;
  name: string;
  formula: string;
  unit: string;
  description: string;
  category: string;
}


