import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  Building,
  CheckCircle,
  ExternalLink,
  FileImage,
  ArrowLeft,
  Info,
  Edit2,
  Trash2,
  Upload
} from 'lucide-react';
import { RegulatoryDocument, UserSession } from '../types';

interface DocumentsTabProps {
  activeDocCode: string | null;
  onDocCodeSelect: (code: string | null) => void;
  userSession: UserSession;
  onNavigateToCriterion?: (critCode: string) => void;
}

const STATIC_DOCUMENTS: RegulatoryDocument[] = [
  {
    id: 'doc-1',
    code: '15/HD-GTVT',
    title: 'Hướng dẫn thực hiện tiêu chí Giao thông trong bộ tiêu chí quốc gia về xã nông thôn mới giai đoạn 2026 - 2030',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Giao thông Vận tải',
    signer: 'Thứ trưởng Nguyễn Duy Lâm',
    issueDate: '2024-05-10',
    content: `Căn cứ Quyết định số 318/QĐ-TTg ngày 08 tháng 3 năm 2022 của Thủ tướng Chính phủ ban hành Bộ tiêu chí quốc gia về xã nông thôn mới và Bộ tiêu chí quốc gia về xã nông thôn mới nâng cao giai đoạn 2021 - 2025;
Bộ Giao thông Vận tải ban hành Hướng dẫn thực hiện chỉ tiêu thuộc tiêu chí Giao thông như sau:

1. Đường xã và đường từ trung tâm xã đến đường huyện được nhựa hóa hoặc bê tông hóa, đảm bảo ô tô đi lại thuận tiện quanh năm. Tỷ lệ cứng hóa tối thiểu đạt chuẩn 75%.
2. Đường trục thôn, bản và đường liên thôn, bản ít nhất được cứng hóa bằng bê tông hoặc cấp phối đá dăm. Tỷ lệ cứng hóa tối thiểu đạt chuẩn 75% cho vùng đồng bằng và 60% cho vùng khó khăn.
3. Đường ngõ, xóm sạch và không lầy lội vào mùa mưa. Tỷ lệ cứng hóa tối thiểu đạt chuẩn 50% cho vùng đồng bằng và 30% cho vùng khó khăn.
4. Đường trục chính nội đồng được cứng hóa, xe cơ giới đi lại thuận tiện để phục vụ sản xuất và vận chuyển nông sản. Tỷ lệ cứng hóa đạt tối thiểu 40%.`,
    relatedCriteria: ['TC02']
  },
  {
    id: 'doc-2',
    code: '124/HD-BNN',
    title: 'Hướng dẫn quy hoạch xây dựng vùng huyện, xã nông thôn mới thích ứng biến đổi khí hậu',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Nông nghiệp và Phát triển Nông thôn',
    signer: 'Thứ trưởng Trần Thanh Nam',
    issueDate: '2024-03-15',
    content: `Căn cứ Nghị định quy hoạch xây dựng nông thôn mới của Chính phủ Việt Nam;
Bộ Nông nghiệp và Phát triển Nông thôn hướng dẫn quy trình lập quy hoạch:

1. Quy hoạch chung xây dựng xã nông thôn mới phải đồng bộ hóa với định hướng phát triển kinh tế vùng huyện, hạ tầng kỹ thuật và thích ứng cao với biến đổi khí hậu toàn cầu.
2. Các điểm dân cư mới và khu trung tâm hành chính cấp xã phải bố trí nằm ngoài vùng có nguy cơ lũ quét, sạt lở đất hoặc ngập lụt định kỳ.
3. Bản đồ quy hoạch sử dụng đất sản xuất nông nghiệp cần chỉ rõ phân khu chuyên canh sản xuất hàng hóa lớn có liên kết chuỗi giá trị và thích ứng hạn mặn.`,
    relatedCriteria: ['TC01']
  },
  {
    id: 'doc-3',
    code: '88/HD-SNN',
    title: 'Hướng dẫn kiên cố hóa kênh mương và an toàn hồ đập phòng chống thiên tai nông thôn',
    type: 'Hướng dẫn',
    issuingAgency: 'Sở Nông nghiệp và Phát triển Nông thôn',
    signer: 'Giám đốc Sở Nguyễn Văn Đông',
    issueDate: '2024-04-05',
    content: `Căn cứ Luật Thủy lợi và hướng dẫn của Ủy ban Nhân dân tỉnh về tiêu chí số 3 nông thôn mới;
Sở Nông nghiệp và Phát triển Nông thôn hướng dẫn chi tiết:

1. Hệ thống thủy lợi của xã phải đáp ứng tối thiểu 80% diện tích đất sản xuất nông nghiệp được tưới tiêu chủ động.
2. Kênh mương nội đồng do xã quản lý phải được kiên cố hóa bằng bê tông đúc sẵn hoặc gia cố đá hộc đạt tỷ lệ trên 65% tổng chiều dài.
3. Đập, hồ chứa nước nhỏ trên địa bàn phải có phương án ứng phó thiên tai, lũ lụt khẩn cấp, có nhân sự túc trực 24/7 trong mùa mưa bão.`,
    relatedCriteria: ['TC03']
  },
  {
    id: 'doc-4',
    code: '22/HD-BCT',
    title: 'Hướng dẫn chuẩn thiết kế kỹ thuật lưới điện hạ áp nông thôn an toàn',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Công Thương',
    signer: 'Thứ trưởng Nguyễn Sinh Nhật Tân',
    issueDate: '2024-02-18',
    content: `Bộ Công Thương ban hành hướng dẫn thực hiện tiêu chí Điện nông thôn:

1. Hệ thống điện nông thôn phải đảm bảo các thông số kỹ thuật theo Tiêu chuẩn Quốc gia TCVN về hành lang an toàn lưới điện cao, trung và hạ thế.
2. Tỷ lệ hộ gia đình sử dụng điện thường xuyên, an toàn từ nguồn điện lưới quốc gia đạt tối thiểu 98% trở lên đối với các xã vùng đồng bằng.
3. Trạm biến áp cấp điện phải có công suất dự phòng tối thiểu 15% đảm bảo nhu cầu sản xuất nông nghiệp và sinh hoạt tăng cao trong dịp lễ tết.`,
    relatedCriteria: ['TC04']
  },
  {
    id: 'doc-5',
    code: '105/HD-BGDDT',
    title: 'Hướng dẫn tiêu chuẩn cơ sở vật chất phòng học chức năng trường mầm non, tiểu học, trung học cơ sở đạt chuẩn quốc gia',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Giáo dục và Đào tạo',
    signer: 'Thứ trưởng Nguyễn Hữu Độ',
    issueDate: '2024-01-20',
    content: `Bộ Giáo dục và Đào tạo hướng dẫn cơ sở vật chất phục vụ tiêu chí trường học:

1. Tỷ lệ trường học các cấp có cơ sở vật chất và thiết bị dạy học đạt chuẩn tối thiểu là 70%.
2. Trường mầm non phải có khu vui chơi ngoài trời trang bị thảm cỏ và đồ chơi an toàn, phòng ngủ tách biệt với phòng sinh hoạt chung.
3. Trường tiểu học và THCS phải có tối thiểu 03 phòng học chức năng (Tin học, Ngoại ngữ, Thí nghiệm vật lý - hóa học) đạt trang bị tiêu chuẩn.`,
    relatedCriteria: ['TC05']
  },
  {
    id: 'doc-6',
    code: '44/HD-VHTTDL',
    title: 'Hướng dẫn vận hành nhà văn hóa, trung tâm rèn luyện thể thao, và duy trì di sản dân ca truyền thống cấp xã',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Văn hóa, Thể thao và Du lịch',
    signer: 'Thứ trưởng Trịnh Thị Thủy',
    issueDate: '2024-04-12',
    content: `Bộ Văn hóa, Thể thao và Du lịch hướng dẫn thực hiện tiêu chí cơ sở vật chất văn hóa:

1. Nhà văn hóa xã phải có quy mô tối thiểu 250 chỗ ngồi, khu thể thao xã phải có diện tích tối thiểu 2000m² bao gồm sân bóng đá mini hoặc sân bóng chuyền.
2. Các thôn, bản phải có nhà văn hóa hoặc sân thể thao đơn giản phục vụ sinh hoạt chung, trang bị tối thiểu tủ sách 300 cuốn và bộ tăng âm loa phát thanh.
3. Xã nông thôn mới phải có câu lạc bộ văn nghệ dân gian hoặc dân ca truyền thống hoạt động thường xuyên nhằm giữ gìn bản sắc địa phương.`,
    relatedCriteria: ['TC06']
  },
  {
    id: 'doc-7',
    code: '32/HD-BCT',
    title: 'Hướng dẫn tiêu chuẩn cấu trúc và kiểm soát vệ sinh an toàn thực phẩm tại chợ nông thôn mới',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Công Thương',
    signer: 'Thứ trưởng Phan Thị Thắng',
    issueDate: '2024-06-03',
    content: `Bộ Công Thương hướng dẫn tiêu chuẩn cơ sở hạ tầng thương mại nông thôn:

1. Chợ nông thôn phải có sơ đồ bố trí gian hàng khoa học, phân chia rõ khu vực thực phẩm tươi sống, hàng khô và khu ăn uống.
2. Phải có hệ thống thu gom và xử lý rác thải tập trung, nhà vệ sinh công cộng tự hoại đạt yêu cầu môi trường và nguồn nước sạch xét nghiệm định kỳ.
3. Ban quản lý chợ phải có nội quy hoạt động công khai, trang bị phương tiện phòng cháy chữa cháy cơ bản.`,
    relatedCriteria: ['TC07']
  },
  {
    id: 'doc-8',
    code: '19/HD-BTTTT',
    title: 'Hướng dẫn phổ cập trạm truyền thanh thông minh không dây và dịch vụ công trực tuyến một cửa',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Thông tin và Truyền thông',
    signer: 'Thứ trưởng Nguyễn Huy Dũng',
    issueDate: '2024-02-28',
    content: `Bộ Thông tin và Truyền thông hướng dẫn tiêu chí thông tin truyền thông nông thôn:

1. Xã phải có điểm cung cấp dịch vụ bưu chính viễn thông đạt chuẩn, phổ cập kết nối internet cáp quang đến các nhà văn hóa thôn.
2. Hệ thống đài truyền thanh xã phải sử dụng công nghệ số IP không dây thông minh, truyền tải tin tức phòng chống thiên tai và chính sách kịp thời.
3. Bộ phận một cửa cấp xã phải có máy tính kết nối mạng phục vụ nhân dân truy cập nộp hồ sơ dịch vụ công trực tuyến.`,
    relatedCriteria: ['TC08']
  },
  {
    id: 'doc-9',
    code: '110/HD-BXD',
    title: 'Hướng dẫn quy chuẩn kết cấu nhà ở dân cư nông thôn phòng tránh bão lũ',
    type: 'Hướng dẫn',
    issuingAgency: 'Bộ Xây dựng',
    signer: 'Thứ trưởng Nguyễn Tường Văn',
    issueDate: '2024-04-15',
    content: `Bộ Xây dựng hướng dẫn quy chuẩn về tiêu chí nhà ở dân cư nông thôn:

1. Xã nông thôn mới hoàn toàn không còn nhà dột nát, nhà tạm bợ dột mục không an toàn trước thiên tai bão lũ.
2. Tỷ lệ nhà ở kiên cố hoặc bán kiên cố đạt tối thiểu 90% trở lên. Kết cấu nhà ở phải đảm bảo 3 cứng (cột cứng, mái cứng, tường cứng).
3. Diện tích nhà ở bình quân đạt tối thiểu 14m²/người, niên hạn sử dụng công trình chính phải đạt từ 20 năm trở lên.`,
    relatedCriteria: ['TC09']
  },
  {
    id: 'doc-10',
    code: '33/HD-TCTK',
    title: 'Hướng dẫn quy trình điều tra, tính toán thu nhập bình quân đầu người tại các xã xây dựng nông thôn mới',
    type: 'Hướng dẫn',
    issuingAgency: 'Tổng cục Thống kê',
    signer: 'Tổng cục trưởng Nguyễn Thị Hương',
    issueDate: '2024-05-18',
    content: `Tổng cục Thống kê hướng dẫn phương pháp thu thập chỉ số thu nhập bình quân:

1. Chỉ số thu nhập bình quân đầu người cấp xã được xác định thông qua khảo sát mẫu đại diện hộ gia đình theo quý hoặc năm.
2. Công thức tính toán tổng thu nhập bao gồm: thu nhập từ trồng trọt chăn nuôi nông nghiệp (đã trừ chi phí đầu vào), tiền lương tiền công lao động tự do, và các nguồn chuyển giao khác.
3. Ủy ban nhân dân xã phối hợp với chi cục thống kê huyện tổ chức điều tra công khai, minh bạch dữ liệu thực tế tại địa phương.`,
    relatedCriteria: ['TC10']
  }
];

export default function DocumentsTab({
  activeDocCode,
  onDocCodeSelect,
  userSession,
  onNavigateToCriterion
}: DocumentsTabProps) {
  // Load documents list from local storage or fallback to STATIC_DOCUMENTS
  const [documentsList, setDocumentsList] = useState<RegulatoryDocument[]>(() => {
    const saved = localStorage.getItem('NTM_RegulatoryDocuments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RegulatoryDocument[];
        // Clean up / Auto-repair: Map "Tiêu chí X" to "TC0X" or "TCX"
        let updated = false;
        const cleaned = parsed.map(doc => {
          const newRelated = (doc.relatedCriteria || []).map(item => {
            if (item.startsWith('Tiêu chí ')) {
              updated = true;
              const num = parseInt(item.replace('Tiêu chí ', ''), 10);
              return `TC${num < 10 ? '0' + num : num}`;
            }
            return item;
          });
          if (updated) {
            return { ...doc, relatedCriteria: newRelated };
          }
          return doc;
        });
        if (updated) {
          localStorage.setItem('NTM_RegulatoryDocuments', JSON.stringify(cleaned));
          return cleaned;
        }
        return parsed;
      } catch (e) {
        // ignore
      }
    }
    return STATIC_DOCUMENTS;
  });

  // Load available criteria from localStorage
  const criteriaList = useMemo(() => {
    const saved = localStorage.getItem('NTM_Criteria');
    if (saved) {
      try {
        return JSON.parse(saved) as any[];
      } catch (e) {
        // ignore
      }
    }
    return [];
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('NTM_RegulatoryDocuments', JSON.stringify(documentsList));
  }, [documentsList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('Tất cả');
  const [activeViewTab, setActiveViewTab] = useState<'text' | 'scan'>('scan');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Modals / forms states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Input states
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Hướng dẫn');
  const [formAgency, setFormAgency] = useState('Bộ Nông nghiệp và Phát triển Nông thôn');
  const [formSigner, setFormSigner] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCriteria, setFormCriteria] = useState<string[]>([]);
  const [formFileImage, setFormFileImage] = useState('');
  const [formPdfFile, setFormPdfFile] = useState('');
  const [formPdfFileName, setFormPdfFileName] = useState('');

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setAlertMsg('Hệ thống chỉ chấp nhận tệp định dạng PDF!');
        setTimeout(() => setAlertMsg(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64Str = event.target.result as string;
          if (base64Str.length > 5 * 1024 * 1024) {
            setAlertMsg('Tệp PDF quá lớn! Vui lòng chọn tệp dưới 3.5MB.');
            setTimeout(() => setAlertMsg(null), 4000);
            return;
          }
          setFormPdfFile(base64Str);
          setFormPdfFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync activeDocCode from outside
  useEffect(() => {
    if (activeDocCode) {
      // Find matching document by code
      const doc = documentsList.find(
        d => d.code.toLowerCase() === activeDocCode.toLowerCase()
      );
      if (doc) {
        setSelectedDocId(doc.id);
      }
    }
  }, [activeDocCode, documentsList]);

  // Compute final document list including a generic generator for codes not in database
  const documents = useMemo(() => {
    const list = [...documentsList];
    if (activeDocCode) {
      const exists = list.some(
        d => d.code.toLowerCase() === activeDocCode.toLowerCase()
      );
      if (!exists) {
        // Generate generic legal document dynamically
        const genDoc: RegulatoryDocument = {
          id: `doc-gen-${activeDocCode.replace('/', '-')}`,
          code: activeDocCode,
          title: `Hướng dẫn chuyên ngành thực hiện Bộ chỉ số nông thôn mới số ${activeDocCode}`,
          type: 'Hướng dẫn',
          issuingAgency: activeDocCode.includes('BNN') ? 'Bộ Nông nghiệp và Phát triển Nông thôn'
            : activeDocCode.includes('GTVT') ? 'Bộ Giao thông Vận tải'
              : activeDocCode.includes('BCT') ? 'Bộ Công Thương'
                : activeDocCode.includes('BTTTT') ? 'Bộ Thông tin và Truyền thông'
                  : activeDocCode.includes('BXD') ? 'Bộ Xây dựng'
                    : 'Ban Chỉ đạo Trung ương Nông thôn mới',
          signer: 'Thường trực Ban chỉ đạo',
          issueDate: '2024-06-15',
          content: `Căn cứ Quyết định phê duyệt Bộ tiêu chí quốc gia xây dựng nông thôn mới.
Văn phòng Thường trực ban hành Hướng dẫn chuyên đề số ${activeDocCode}:

1. Tổ chức rà soát thực địa số liệu hạ tầng kỹ thuật và các chỉ số đo lường liên quan đến nội dung văn bản.
2. Các cơ quan chuyên trách cấp Huyện và cấp Xã cập nhật báo cáo định kỳ theo đúng quy định.
3. Đảm bảo tính minh bạch, chính xác và đồng bộ trong quá trình nghiệm thu thẩm định hồ sơ.`,
          relatedCriteria: []
        };
        list.push(genDoc);
      }
    }
    return list;
  }, [activeDocCode, documentsList]);

  const activeDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Agencies list for filters
  const agencies = useMemo(() => {
    const list = new Set(documentsList.map(d => d.issuingAgency));
    return ['Tất cả', ...Array.from(list)];
  }, [documentsList]);


  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch =
        doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchAgency = selectedAgency === 'Tất cả' || doc.issuingAgency === selectedAgency;

      return matchSearch && matchAgency;
    });
  }, [documents, searchQuery, selectedAgency]);

  const handleOpenAddForm = () => {
    setFormMode('add');
    setFormCode('');
    setFormTitle('');
    setFormType('Hướng dẫn');
    setFormAgency('Bộ Nông nghiệp và Phát triển Nông thôn');
    setFormSigner('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormContent('');
    setFormCriteria([]);
    setFormFileImage('');
    setFormPdfFile('');
    setFormPdfFileName('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = () => {
    setFormMode('edit');
    setFormCode(activeDoc.code);
    setFormTitle(activeDoc.title);
    setFormType(activeDoc.type);
    setFormAgency(activeDoc.issuingAgency);
    setFormSigner(activeDoc.signer);
    setFormDate(activeDoc.issueDate);
    setFormContent(activeDoc.content);
    setFormCriteria(activeDoc.relatedCriteria || []);
    setFormFileImage(activeDoc.fileImage || '');
    setFormPdfFile(activeDoc.pdfFile || '');
    setFormPdfFileName(activeDoc.pdfFileName || '');
    setIsFormOpen(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formTitle || !formSigner || !formDate || (!formPdfFile && formMode === 'add')) {
      setAlertMsg('Vui lòng điền đầy đủ các trường bắt buộc và chọn tệp PDF đính kèm!');
      setTimeout(() => setAlertMsg(null), 3000);
      return;
    }

    if (formMode === 'add') {
      const newDoc: RegulatoryDocument = {
        id: `doc-${Date.now()}`,
        code: formCode,
        title: formTitle,
        type: formType,
        issuingAgency: formAgency,
        signer: formSigner,
        issueDate: formDate,
        content: formContent,
        relatedCriteria: formCriteria,
        pdfFile: formPdfFile || undefined,
        pdfFileName: formPdfFileName || undefined
      };
      const updated = [newDoc, ...documentsList];
      setDocumentsList(updated);
      setSelectedDocId(newDoc.id);
      onDocCodeSelect(newDoc.code);
      setAlertMsg('Đã thêm mới văn bản pháp chế thành công!');
    } else {
      const updated = documentsList.map(d => {
        if (d.id === selectedDocId) {
          return {
            ...d,
            code: formCode,
            title: formTitle,
            type: formType,
            issuingAgency: formAgency,
            signer: formSigner,
            issueDate: formDate,
            content: formContent,
            relatedCriteria: formCriteria,
            pdfFile: formPdfFile || undefined,
            pdfFileName: formPdfFileName || undefined
          };
        }
        return d;
      });
      setDocumentsList(updated);
      onDocCodeSelect(formCode);
      setAlertMsg('Đã cập nhật thông tin văn bản pháp chế thành công!');
    }

    setIsFormOpen(false);
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleDeleteDocument = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản ${activeDoc.code} khỏi hệ thống?`)) {
      const updated = documentsList.filter(d => d.id !== activeDoc.id);
      setDocumentsList(updated);
      if (updated.length > 0) {
        setSelectedDocId(updated[0].id);
        onDocCodeSelect(updated[0].code);
      } else {
        setSelectedDocId('');
        onDocCodeSelect('');
      }
      setAlertMsg('Đã xóa văn bản pháp chế thành công!');
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  const toggleCriterionRelation = (critName: string) => {
    setFormCriteria(prev =>
      prev.includes(critName)
        ? prev.filter(c => c !== critName)
        : [...prev, critName]
    );
  };

  // Handle previewing the generated Canvas to download
  const handleExportPNG = () => {
    if (activeDoc.pdfFile) {
      try {
        const link = document.createElement('a');
        link.download = `VanBan_PhapChe_${activeDoc.code.replace('/', '_')}.pdf`;
        link.href = activeDoc.pdfFile;
        link.click();

        setAlertMsg(`Đã tải xuống tệp văn bản PDF ${activeDoc.code} thành công!`);
        setTimeout(() => setAlertMsg(null), 3500);
      } catch (e) {
        setAlertMsg('Lỗi tải tệp văn bản PDF!');
        setTimeout(() => setAlertMsg(null), 3000);
      }
      return;
    }

    if (activeDoc.fileImage) {
      try {
        const link = document.createElement('a');
        link.download = `VanBan_PhapChe_${activeDoc.code.replace('/', '_')}.png`;
        link.href = activeDoc.fileImage;
        link.click();

        setAlertMsg(`Đã tải xuống hình ảnh bản quét ${activeDoc.code} thành công!`);
        setTimeout(() => setAlertMsg(null), 3500);
      } catch (e) {
        setAlertMsg('Lỗi tải ảnh bản quét!');
        setTimeout(() => setAlertMsg(null), 3000);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setAlertMsg('Hệ thống chưa tạo xong kết cấu bản quét văn bản!');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `VanBan_PhapChe_${activeDoc.code.replace('/', '_')}.png`;
      link.href = dataUrl;
      link.click();

      setAlertMsg(`Đã truy xuất và tải xuống hình ảnh văn bản ${activeDoc.code} thành công!`);
      setTimeout(() => setAlertMsg(null), 3500);
    } catch (e) {
      console.error(e);
      setAlertMsg('Lỗi truy xuất xuất bản ảnh văn bản!');
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  // Draw on Canvas when document changes or view tab toggles to scan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeViewTab !== 'scan' || activeDoc.fileImage || activeDoc.pdfFile) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (High Resolution A4 style)
    canvas.width = 800;
    canvas.height = 1120;

    // 1. Draw Page background
    ctx.fillStyle = '#faf7f2'; // Aged legal paper color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw borders
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e2d8c3';
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // 2. Draw Headers
    ctx.fillStyle = '#1e293b';

    // Left: Agency
    ctx.font = 'bold 12px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeDoc.issuingAgency.toUpperCase(), 190, 50);

    ctx.font = 'bold 11px "Times New Roman", Times, serif';
    ctx.fillText('BAN CHỈ ĐẠO NTM', 190, 68);

    ctx.font = 'normal 11px "Times New Roman", Times, serif';
    ctx.fillText(`Số: ${activeDoc.code}`, 190, 88);

    // Draw short line under left header
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(140, 98);
    ctx.lineTo(240, 98);
    ctx.stroke();

    // Right: National Motto
    ctx.font = 'bold 12px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 560, 50);

    ctx.font = 'bold 11px "Times New Roman", Times, serif';
    ctx.fillText('Độc lập - Tự do - Hạnh phúc', 560, 68);

    // Line under motto
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(480, 78);
    ctx.lineTo(640, 78);
    ctx.stroke();

    // Date line
    ctx.font = 'italic 11px "Times New Roman", Times, serif';
    ctx.textAlign = 'right';
    const dateStr = activeDoc.issueDate.split('-');
    const formattedDate = `Hà Nội, ngày ${dateStr[2] || '10'} tháng ${dateStr[1] || '05'} năm ${dateStr[0] || '2024'}`;
    ctx.fillText(formattedDate, 720, 115);

    // 3. Document Title
    ctx.font = 'bold 16px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeDoc.type.toUpperCase(), 400, 160);

    ctx.font = 'italic 11.5px "Times New Roman", Times, serif';
    // Split title into lines if too long
    const titleWords = activeDoc.title.split(' ');
    let line = '';
    const titleLines = [];
    for (let n = 0; n < titleWords.length; n++) {
      let testLine = line + titleWords[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 500 && n > 0) {
        titleLines.push(line);
        line = titleWords[n] + ' ';
      } else {
        line = testLine;
      }
    }
    titleLines.push(line);

    let titleY = 185;
    titleLines.forEach(l => {
      ctx.fillText(l.trim(), 400, titleY);
      titleY += 20;
    });

    // Separator line
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(320, titleY + 5);
    ctx.lineTo(480, titleY + 5);
    ctx.stroke();

    // 4. Document Content
    ctx.font = 'normal 13px "Times New Roman", Times, serif';
    ctx.textAlign = 'left';

    const contentYStart = titleY + 35;
    const contentParagraphs = activeDoc.content.split('\n');
    let currentY = contentYStart;

    contentParagraphs.forEach(para => {
      if (!para.trim()) return;

      const words = para.trim().split(' ');
      let line = '';
      const maxWidth = 620;
      const xMargin = 90;
      const lineHeight = 22;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), xMargin, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), xMargin, currentY);
      currentY += lineHeight + 8; // Extra paragraph margin
    });

    // 5. Signer section (Bottom Right)
    const signerX = 580;
    const signerY = Math.max(currentY + 40, 850);

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Times New Roman", Times, serif';
    ctx.fillText('TL. BỘ TRƯỞNG / CHỦ TỊCH', signerX, signerY);
    ctx.font = 'bold 11px "Times New Roman", Times, serif';
    ctx.fillText(activeDoc.signer.split(' ').slice(0, -3).join(' ') || 'KT. CHÁNH VĂN PHÒNG', signerX, signerY + 18);

    // Draw mock handwritten signature in blue
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(signerX - 60, signerY + 50);
    ctx.bezierCurveTo(signerX - 30, signerY + 30, signerX - 10, signerY + 70, signerX + 20, signerY + 40);
    ctx.bezierCurveTo(signerX + 30, signerY + 35, signerX + 10, signerY + 90, signerX + 50, signerY + 60);
    ctx.stroke();

    // 6. Draw RED CIRCULAR SEAL STAMP
    const stampX = signerX - 30;
    const stampY = signerY + 60;

    ctx.strokeStyle = 'rgba(225, 29, 72, 0.85)'; // semi-transparent red
    ctx.lineWidth = 3.5;

    // Outer circle
    ctx.beginPath();
    ctx.arc(stampX, stampY, 52, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner circle
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 46, 0, 2 * Math.PI);
    ctx.stroke();

    // Red text inside stamp circular
    ctx.fillStyle = 'rgba(225, 29, 72, 0.85)';
    ctx.font = 'bold 7.5px Arial';

    // Top arc text: BỘ GIAO THÔNG VẬN TẢI
    ctx.save();
    ctx.translate(stampX, stampY);
    ctx.rotate(-Math.PI / 1.5);
    const agencyName = activeDoc.issuingAgency.toUpperCase();
    for (let i = 0; i < agencyName.length; i++) {
      ctx.fillText(agencyName[i], 0, -38);
      ctx.rotate(Math.PI / 14);
    }
    ctx.restore();

    // Bottom arc text: BAN CHỈ ĐẠO NTM
    ctx.save();
    ctx.translate(stampX, stampY);
    ctx.rotate(Math.PI / 2.5);
    const sealOffice = 'BAN CHỈ ĐẠO TRUNG ƯƠNG';
    for (let i = 0; i < sealOffice.length; i++) {
      ctx.fillText(sealOffice[i], 0, 38);
      ctx.rotate(-Math.PI / 16);
    }
    ctx.restore();

    // Center star
    ctx.font = '12px Arial';
    ctx.fillText('★', stampX, stampY + 4);

    // Signer name (Bottom Right)
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Times New Roman", Times, serif';
    ctx.fillText(activeDoc.signer, signerX, signerY + 100);

  }, [activeDoc, activeViewTab]);

  return (
    <div className="space-y-6 relative pb-12 font-sans select-none animate-fade-in text-slate-800 text-left">

      {/* Toast Alert message */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 border border-slate-800 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-300 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold leading-normal">{alertMsg}</span>
        </div>
      )}

      {/* Header with Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="text-left space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span>Hệ thống</span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-[#014285] font-black">Hệ thống văn bản pháp chế</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
            Thư viện Văn bản Hướng dẫn & Quy định
          </h1>
          <p className="text-xs text-slate-400 font-bold">Tra cứu các hướng dẫn kỹ thuật nông thôn mới cấp Bộ và cấp Tỉnh.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-bold">Chế độ người dùng:</span>
          <span className="text-xs font-black text-[#014285] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl uppercase">
            {userSession.role === 'SUPERVISOR' ? 'Giám sát (Cấp Bộ)'
              : userSession.role === 'APPRAISER' ? 'Thẩm định (Cấp Tỉnh)'
                : 'Biên tập (Cấp Xã)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Side: Document list & Filter */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-[#014285] tracking-wider">Bộ lọc tài liệu</h3>
              {userSession.role === 'SUPERVISOR' && (
                <button
                  onClick={handleOpenAddForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all border-none"
                >
                  + Thêm mới
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên công văn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#014285]"
              />
            </div>

            {/* Issuing Agency Selector */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Cơ quan ban hành</label>
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl cursor-pointer focus:border-[#014285] outline-none"
              >
                {agencies.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4.5 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider pl-1">
              <span>Danh mục văn bản ({filteredDocs.length})</span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredDocs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  Không tìm thấy tài liệu phù hợp...
                </div>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = doc.id === selectedDocId;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        onDocCodeSelect(doc.code);
                      }}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex justify-between items-start text-left ${isSelected
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                      <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                            {doc.code}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">{doc.issueDate}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 leading-snug truncate-3-lines" title={doc.title}>
                          {doc.title}
                        </h4>
                        <span className="text-[10px] text-slate-450 block truncate font-medium">
                          {doc.issuingAgency}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Document Details & Interactive Preview */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col space-y-6">

          {/* Header detail info */}
          <div className="border-b border-slate-100 pb-4 space-y-4">
            {/* Top row: Title/Meta and Edit/Delete Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-left space-y-1.5 flex-1 min-w-0">
                <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block">
                  {activeDoc.type} Pháp Chế
                </span>
                <h2 className="text-base font-black text-slate-800 leading-tight">
                  {activeDoc.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-450">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {activeDoc.issuingAgency}
                  </span>
                  <span className="text-slate-200 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Ký ban hành: {activeDoc.issueDate}
                  </span>
                </div>
              </div>

              {/* Action buttons (Sửa / Xóa) */}
              {userSession.role === 'SUPERVISOR' && (
                <div className="flex gap-2 shrink-0 select-none">
                  <button
                    onClick={handleOpenEditForm}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black uppercase tracking-wider py-2 px-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Sửa
                  </button>
                  <button
                    onClick={handleDeleteDocument}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-wider py-2 px-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa
                  </button>
                </div>
              )}
            </div>

            {/* Bottom row: Switch tabs */}
            <div className="flex justify-start">
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
                <button
                  onClick={() => setActiveViewTab('scan')}
                  className={`px-4 py-2 text-xs font-black rounded-lg cursor-pointer transition-all border-none ${activeViewTab === 'scan' ? 'bg-[#014285] text-white shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'
                    }`}
                >
                  Bản quét công văn
                </button>
                <button
                  onClick={() => setActiveViewTab('text')}
                  className={`px-4 py-2 text-xs font-black rounded-lg cursor-pointer transition-all border-none ${activeViewTab === 'text' ? 'bg-[#014285] text-white shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'
                    }`}
                >
                  Văn bản thuần túy
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: TEXT (Plain Text Paragraphs) */}
          {activeViewTab === 'text' && (
            <div className="flex-1 space-y-6">
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Cơ quan ban hành</span>
                    <span className="text-slate-800 block font-black">{activeDoc.issuingAgency}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Số hiệu văn bản</span>
                    <span className="text-[#014285] block font-black">{activeDoc.code}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Người ký duyệt</span>
                    <span className="text-slate-800 block font-black">{activeDoc.signer}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider text-left">Các chỉ tiêu liên kết</span>
                    <div className="flex flex-wrap gap-1.5 mt-1 justify-start">
                      {activeDoc.relatedCriteria && activeDoc.relatedCriteria.length > 0 ? (
                        activeDoc.relatedCriteria.map((critCode) => (
                          <button
                            key={critCode}
                            type="button"
                            onClick={() => onNavigateToCriterion?.(critCode)}
                            className="text-[10px] font-black text-[#014285] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wide cursor-pointer transition-colors shadow-sm"
                            title="Click để chuyển sang xem tiêu chí"
                          >
                            {critCode}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-450 italic">Chỉ số rà soát tổng hợp</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {activeDoc.pdfFile ? (
                <div className="w-full flex flex-col items-stretch bg-slate-50 border border-slate-200 p-4.5 rounded-2xl shadow-inner">
                  <div className="flex items-center gap-2 mb-3 text-xs text-[#014285] font-extrabold bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl self-start">
                    <FileText className="w-4 h-4" />
                    <span>Tệp PDF gốc: {activeDoc.pdfFileName || 'document.pdf'}</span>
                  </div>
                  <iframe
                    src={activeDoc.pdfFile}
                    title={activeDoc.title}
                    className="w-full h-[600px] rounded-xl border border-slate-250 bg-white"
                  />
                </div>
              ) : activeDoc.fileImage ? (
                <div className="w-full flex justify-center bg-slate-50 border border-slate-200 p-4.5 rounded-2xl max-h-[600px] overflow-y-auto shadow-inner">
                  <img
                    src={activeDoc.fileImage}
                    alt="Bản quét tệp tải lên"
                    className="max-w-full rounded-xl shadow-md border border-slate-250 object-contain"
                  />
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-700 leading-relaxed text-left whitespace-pre-wrap font-sans bg-white border border-slate-100 p-5 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto">
                  {activeDoc.content}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SCAN (High Fidelity Vietnamese Official Document Style Canvas Render) */}
          {activeViewTab === 'scan' && (
            <div className="flex-1 flex flex-col items-center space-y-4">

              {/* Scan Preview Header Toolbar */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 pl-1.5 text-left">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {activeDoc.pdfFile
                      ? 'Hiển thị tệp văn bản PDF gốc được tải lên hệ thống'
                      : activeDoc.fileImage
                        ? 'Hiển thị ảnh bản quét văn bản được tải lên từ hệ thống'
                        : 'Dấu đỏ và chữ ký số đại diện được vẽ trực quan từ dữ liệu kiểm chuẩn'}
                  </span>
                </div>

                <button
                  onClick={handleExportPNG}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer border-none shrink-0 whitespace-nowrap"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{activeDoc.pdfFile ? 'Tải tệp PDF' : 'Tải ảnh văn bản (PNG)'}</span>
                </button>
              </div>

              {/* Scanned Document Canvas Paper Mock */}
              <div className="w-full overflow-x-auto p-4 bg-slate-100 rounded-3xl border border-slate-200 flex justify-center shadow-inner">
                <div className="bg-white p-1 shadow-md w-full max-w-[800px] rounded-2xl overflow-hidden shrink-0 flex justify-center">
                  {activeDoc.pdfFile ? (
                    <iframe
                      src={activeDoc.pdfFile}
                      title={activeDoc.title}
                      className="w-full h-[840px] block border-none rounded-xl bg-white"
                    />
                  ) : activeDoc.fileImage ? (
                    <img
                      src={activeDoc.fileImage}
                      alt="Bản quét công văn"
                      className="max-w-full w-[600px] block rounded-xl border border-slate-200"
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className="max-w-full w-[600px] h-[840px] block rounded-xl"
                      style={{ background: '#faf7f2', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Add / Edit Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-150 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
                <h3 className="text-sm font-extrabold text-[#0f2942]">
                  {formMode === 'add' ? 'Thêm văn bản pháp chế mới' : 'Chỉnh sửa văn bản pháp chế'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg cursor-pointer bg-transparent border-none text-sm font-black"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDocument} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs font-bold text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 uppercase">Số hiệu văn bản *</label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="VD: 15/HD-GTVT"
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 uppercase">Loại văn bản</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer"
                    >
                      <option value="Hướng dẫn">Hướng dẫn</option>
                      <option value="Quyết định">Quyết định</option>
                      <option value="Nghị định">Nghị định</option>
                      <option value="Thông tư">Thông tư</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-slate-400 uppercase">Cơ quan ban hành *</label>
                  <select
                    value={formAgency}
                    onChange={(e) => setFormAgency(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer"
                  >
                    <option value="Bộ Giao thông Vận tải">Bộ Giao thông Vận tải</option>
                    <option value="Bộ Nông nghiệp và Phát triển Nông thôn">Bộ Nông nghiệp và Phát triển Nông thôn</option>
                    <option value="Bộ Công Thương">Bộ Công Thương</option>
                    <option value="Bộ Giáo dục và Đào tạo">Bộ Giáo dục và Đào tạo</option>
                    <option value="Bộ Văn hóa, Thể thao và Du lịch">Bộ Văn hóa, Thể thao và Du lịch</option>
                    <option value="Bộ Thông tin và Truyền thông">Bộ Thông tin và Truyền thông</option>
                    <option value="Bộ Xây dựng">Bộ Xây dựng</option>
                    <option value="Tổng cục Thống kê">Tổng cục Thống kê</option>
                    <option value="Sở Nông nghiệp và Phát triển Nông thôn">Sở Nông nghiệp và Phát triển Nông thôn</option>
                    <option value="Ban Chỉ đạo Trung ương Nông thôn mới">Ban Chỉ đạo Trung ương Nông thôn mới</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 uppercase">Người ký ban hành *</label>
                    <input
                      type="text"
                      required
                      value={formSigner}
                      onChange={(e) => setFormSigner(e.target.value)}
                      placeholder="VD: Thứ trưởng Nguyễn Duy Lâm"
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 uppercase">Ngày ký ban hành *</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-slate-400 uppercase">Tên văn bản (Tiêu đề) *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Nhập tên tiêu đề văn bản hướng dẫn kỹ thuật..."
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Tệp đính kèm văn bản (PDF) *</label>
                  <div className="flex flex-col gap-2 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                        id="doc-pdf-upload"
                      />
                      <label
                        htmlFor="doc-pdf-upload"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#014285] hover:bg-[#002854] text-white rounded-xl cursor-pointer text-xs font-bold transition-all shadow-sm animate-pulse-subtle"
                      >
                        <Upload className="w-4 h-4 shrink-0" />
                        Tải lên tệp PDF...
                      </label>

                      {formPdfFile ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                            {formPdfFileName || 'Đã tải lên tệp PDF'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormPdfFile('');
                              setFormPdfFileName('');
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-extrabold bg-transparent border-none cursor-pointer p-0"
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">Chưa chọn tệp PDF nào</span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      Lưu ý: Tải lên tệp PDF là bắt buộc và dung lượng tệp không được vượt quá 3.5MB để lưu trữ.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-slate-400 uppercase">Liên kết với Tiêu chí</label>
                  <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-24 overflow-y-auto">
                    {criteriaList.map((crit) => {
                      const isLinked = formCriteria.includes(crit.code);
                      return (
                        <button
                          key={crit.id}
                          type="button"
                          onClick={() => toggleCriterionRelation(crit.code)}
                          className={`py-1.5 px-2 rounded-lg text-[9px] font-black cursor-pointer border transition-all ${isLinked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          title={crit.title}
                        >
                          {crit.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 text-xs transition-all font-black uppercase"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#014285] hover:bg-[#002854] text-white rounded-xl cursor-pointer text-xs transition-all font-black uppercase shadow-md border-none"
                  >
                    Lưu văn bản
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
