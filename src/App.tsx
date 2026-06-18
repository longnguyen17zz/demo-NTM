import React, { useState, useEffect } from 'react';
import {
  FileText,
  HelpCircle,
  X,
  PlusCircle,
  FolderPlus,
  Compass,
  FileCheck2,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import ReportPeriodsTab from './components/ReportPeriodsTab';
import FormDetailView from './components/FormDetailView';
import CriteriaTab from './components/CriteriaTab';
import CategoryCriteriaTab from './components/CategoryCriteriaTab';
import StatisticsTab from './components/StatisticsTab';
import AppraisalTab from './components/AppraisalTab';
import SupervisionTab from './components/SupervisionTab';
import LoginScreen from './components/LoginScreen';
import AdministrativeTab from './components/AdministrativeTab';
import AccountsTab from './components/AccountsTab';
import FormDesignerTab from './components/FormDesignerTab';
import IndicatorStatisticsTab from './components/IndicatorStatisticsTab';
import DocumentsTab from './components/DocumentsTab';

import { CriterionRow, ReportMeta, NotificationItem, ReportPeriod, FormReport, Criterion, UserSession, CommuneSubmission, ProvinceSubmission, ProvinceItem } from './types';
import {
  INITIAL_CRITERIA_ROWS,
  INITIAL_CRITERIA_ROWS_06,
  INITIAL_CRITERIA_ROWS_08,
  INITIAL_CRITERIA_ROWS_13,
  INITIAL_RESOURCE_ROWS,
  INITIAL_REPORT_META,
  INITIAL_NOTIFICATIONS,
  INITIAL_DICTIONARY_CRITERIA,
  INITIAL_PERIODS,
  createDefaultFormsForPeriod,
  DEFAULT_COMMUNES,
  DEFAULT_PROVINCE_SUBMISSIONS,
  INITIAL_PROVINCES
} from './mockData';

export default function App() {
  // 1. Session state
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // 2. Navigation states
  const [currentTab, setCurrentTab] = useState<'overview' | 'reports' | 'criteria' | 'statistics' | 'appraisal' | 'supervision' | 'category_criteria' | 'admin_units' | 'accounts' | 'form_designer' | 'indicator_statistics' | 'documents'>('overview');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [activeDocCode, setActiveDocCode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Categories list state (loaded from local storage, dynamically synced)
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('NTM_Categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      'Quy hoạch',
      'Hạ tầng Kinh tế - Xã hội',
      'Phát triển Kinh tế nông thôn',
      'Đào tạo nguồn nhân lực NT'
    ];
  });

  useEffect(() => {
    localStorage.setItem('NTM_Categories', JSON.stringify(categories));
  }, [categories]);

  // 3. Central Business Data states (persisted via localStorage)
  const [periods, setPeriods] = useState<ReportPeriod[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [communes, setCommunes] = useState<CommuneSubmission[]>([]);
  const [provinceSubmissions, setProvinceSubmissions] = useState<ProvinceSubmission[]>([]);
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [activeCommuneId, setActiveCommuneId] = useState<string>('com-1');

  useEffect(() => {
    if (communes.length > 0) {
      localStorage.setItem('NTM_Communes', JSON.stringify(communes));
    }
  }, [communes]);

  useEffect(() => {
    if (provinceSubmissions.length > 0) {
      localStorage.setItem('NTM_ProvinceSubmissions', JSON.stringify(provinceSubmissions));
    }
  }, [provinceSubmissions]);

  useEffect(() => {
    if (provinces.length > 0) {
      localStorage.setItem('NTM_Provinces', JSON.stringify(provinces));
    }
  }, [provinces]);

  useEffect(() => {
    localStorage.setItem('NTM_ActiveCommuneId', activeCommuneId);
  }, [activeCommuneId]);

  // Initialize data from localStorage on component mount
  useEffect(() => {
    // Session load
    const savedSession = localStorage.getItem('NTM_UserSession');
    if (savedSession) {
      try {
        setUserSession(JSON.parse(savedSession));
      } catch (e) {
        setUserSession(null);
      }
    }

    // Communes load
    const savedCommunes = localStorage.getItem('NTM_Communes');
    if (savedCommunes) {
      try {
        const parsed = JSON.parse(savedCommunes) as CommuneSubmission[];
        const needsUpgrade = parsed.some(c => !c.group);
        if (needsUpgrade) {
          const upgraded = parsed.map(c => {
            const def = DEFAULT_COMMUNES.find(dc => dc.id === c.id || dc.code === c.code || dc.name === c.name);
            return {
              ...c,
              group: c.group || def?.group || 'I'
            };
          });
          setCommunes(upgraded);
          localStorage.setItem('NTM_Communes', JSON.stringify(upgraded));
        } else {
          setCommunes(parsed);
        }
      } catch (e) {
        setCommunes(DEFAULT_COMMUNES);
      }
    } else {
      setCommunes(DEFAULT_COMMUNES);
      localStorage.setItem('NTM_Communes', JSON.stringify(DEFAULT_COMMUNES));
    }

    // Provinces load
    const savedProvinceSubs = localStorage.getItem('NTM_ProvinceSubmissions');
    if (savedProvinceSubs) {
      try {
        setProvinceSubmissions(JSON.parse(savedProvinceSubs));
      } catch (e) {
        setProvinceSubmissions(DEFAULT_PROVINCE_SUBMISSIONS);
      }
    } else {
      setProvinceSubmissions(DEFAULT_PROVINCE_SUBMISSIONS);
      localStorage.setItem('NTM_ProvinceSubmissions', JSON.stringify(DEFAULT_PROVINCE_SUBMISSIONS));
    }

    // Provinces load
    const savedProvinces = localStorage.getItem('NTM_Provinces');
    if (savedProvinces) {
      try {
        setProvinces(JSON.parse(savedProvinces));
      } catch (e) {
        setProvinces(INITIAL_PROVINCES);
      }
    } else {
      setProvinces(INITIAL_PROVINCES);
      localStorage.setItem('NTM_Provinces', JSON.stringify(INITIAL_PROVINCES));
    }

    // Active Commune load
    const savedActiveCommune = localStorage.getItem('NTM_ActiveCommuneId');
    if (savedActiveCommune) {
      setActiveCommuneId(savedActiveCommune);
    } else {
      setActiveCommuneId('com-1');
      localStorage.setItem('NTM_ActiveCommuneId', 'com-1');
    }

    // Criteria load
    const savedCriteria = localStorage.getItem('NTM_Criteria');
    if (savedCriteria) {
      try {
        setCriteria(JSON.parse(savedCriteria));
      } catch (e) {
        setCriteria(INITIAL_DICTIONARY_CRITERIA);
      }
    } else {
      setCriteria(INITIAL_DICTIONARY_CRITERIA);
      localStorage.setItem('NTM_Criteria', JSON.stringify(INITIAL_DICTIONARY_CRITERIA));
    }

    // Periods load (+ dynamic forms setup)
    const savedPeriods = localStorage.getItem('NTM_Periods');
    let parsedSuccessfully = false;
    if (savedPeriods) {
      try {
        let parsed = JSON.parse(savedPeriods) as ReportPeriod[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          parsed = parsed.map(period => {
            if (!period) return period;
            const defaultForms = createDefaultFormsForPeriod(period.id || '2024-q4');
            const existingForms = Array.isArray(period.forms) ? period.forms : [];

            const forms = defaultForms.map(defForm => {
              const existingForm = existingForms.find(f => f && f.code === defForm.code);
              const form = existingForm ? existingForm : (updated = true, defForm);
              if (!form) return form;

              const isB06 = form.code === 'Biểu 06';
              const isB09OrB12 = form.code === 'Biểu 09' || form.code === 'Biểu 12';
              const isB13 = form.code === 'Biểu 13';

              // Safe check for data array
              const dataArray = Array.isArray(form.data) ? form.data : [];

              if (isB06) {
                const hasOldData = dataArray.some(row => row && row.category === 'Quy hoạch');
                const hasIncorrectLength = dataArray.length !== 27;
                const isEmptyData = dataArray.length === 0;
                if (hasOldData || hasIncorrectLength || isEmptyData) {
                  updated = true;
                  return {
                    ...form,
                    data: JSON.parse(JSON.stringify(INITIAL_CRITERIA_ROWS_06))
                  };
                }
              }

              if (isB13) {
                const hasIncorrectData = !dataArray.some(row => row && row.category === 'Giao thông');
                const isEmptyData = dataArray.length === 0;
                if (hasIncorrectData || isEmptyData) {
                  updated = true;
                  return {
                    ...form,
                    title: "Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn ngân sách TW 6 tháng / năm ",
                    data: JSON.parse(JSON.stringify(INITIAL_CRITERIA_ROWS_08))
                  };
                }
              }

              if (isB09OrB12) {
                // Ensure if there's any row containing old criteria headers/categories like "Quy hoạch" we reset it completely
                const hasOldData = dataArray.some(row => row && (row.category === 'Quy hoạch' || row.category === 'Hạ tầng kinh tế - xã hội'));
                const hasIncorrectLength = dataArray.length < 15;
                const isEmptyData = dataArray.length === 0;

                if (hasOldData || hasIncorrectLength || isEmptyData) {
                  updated = true;
                  return {
                    ...form,
                    data: JSON.parse(JSON.stringify(INITIAL_RESOURCE_ROWS))
                  };
                }
              }
              return form;
            });
            return { ...period, forms };
          });

          if (updated) {
            localStorage.setItem('NTM_Periods', JSON.stringify(parsed));
          }
          setPeriods(parsed);
          parsedSuccessfully = true;
        }
      } catch (e) {
        console.error("Local storage repair failed: ", e);
      }
    }

    if (!parsedSuccessfully) {
      const initialized = getInitializedPeriods();
      setPeriods(initialized);
      localStorage.setItem('NTM_Periods', JSON.stringify(initialized));
    }

    // Notifications load
    const savedNotifications = localStorage.getItem('NTM_Notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('NTM_Notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }, []);

  const getInitializedPeriods = (): ReportPeriod[] => {
    return INITIAL_PERIODS.map((period) => ({
      ...period,
      forms: createDefaultFormsForPeriod(period.id),
    }));
  };

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    localStorage.setItem('NTM_UserSession', JSON.stringify(session));
    setCurrentTab('overview');
  };

  const handleLogout = () => {
    setUserSession(null);
    localStorage.removeItem('NTM_UserSession');
    setSelectedPeriodId(null);
    setSelectedFormId(null);
    setCurrentTab('overview');
  };

  const handleUpdateSession = (session: UserSession) => {
    setUserSession(session);
    localStorage.setItem('NTM_UserSession', JSON.stringify(session));

    // Reset view states to prevent layout and component crashes
    setSelectedPeriodId(null);
    setSelectedFormId(null);
    if (session.role === 'EDITOR') {
      setCurrentTab('overview');
    } else if (session.role === 'APPRAISER') {
      if (currentTab !== 'reports' && currentTab !== 'appraisal') {
        setCurrentTab('overview');
      }
    } else if (session.role === 'SUPERVISOR') {
      // Supervisor has access to all tabs
    }

    addSystemNotification(`Đã chuyển đổi sang vai trò: ${session.role === 'EDITOR' ? 'Cấp Xã (Nhập liệu)' : session.role === 'APPRAISER' ? 'Cấp Tỉnh (Thẩm định)' : 'Cấp Bộ (Giám sát)'
      }`, 'info');
  };

  // --- CRUD Criteria Handlers ---
  const handleAddCriterion = (newC: Criterion) => {
    const updated = [...criteria, newC];
    setCriteria(updated);
    localStorage.setItem('NTM_Criteria', JSON.stringify(updated));

    // Side effect: update active forms structure to match the lists
    // Create new CriterionRow based on empty values
    const newRow: CriterionRow = {
      id: Number(newC.code.replace('TC-', '')) || (criteria.length + 1),
      category: newC.title,
      unit: 'Xã',
      group1: { prevYear: 0, currentS1: 0, planS2: 0 },
      group2: { prevYear: 0, currentS1: 0, planS2: 0 },
      group3: { prevYear: 0, currentS1: 0, planS2: 0 },
      note: newC.description,
    };

    const updatedPeriods = periods.map((p) => ({
      ...p,
      forms: p.forms.map((f) => ({
        ...f,
        data: [...f.data, newRow],
      })),
    }));

    setPeriods(updatedPeriods);
    localStorage.setItem('NTM_Periods', JSON.stringify(updatedPeriods));

    // Post notification
    addSystemNotification(`Đã ban hành tiêu chí kiểm chuẩn mới: ${newC.code} - ${newC.title}`, 'success');
  };

  const handleEditCriterion = (updatedC: Criterion) => {
    const updated = criteria.map((c) => (c.id === updatedC.id ? updatedC : c));
    setCriteria(updated);
    localStorage.setItem('NTM_Criteria', JSON.stringify(updated));

    // Update active forms matching categories
    const updatedPeriods = periods.map((p) => ({
      ...p,
      forms: p.forms.map((f) => ({
        ...f,
        data: f.data.map((row, idx) => {
          if (idx === criteria.findIndex((c) => c.id === updatedC.id)) {
            return {
              ...row,
              category: updatedC.title,
              note: updatedC.description,
            };
          }
          return row;
        }),
      })),
    }));

    setPeriods(updatedPeriods);
    localStorage.setItem('NTM_Periods', JSON.stringify(updatedPeriods));
    addSystemNotification(`Đã điều chỉnh nội dung tiêu chí: ${updatedC.code}`, 'info');
  };

  const handleDeleteCriterion = (id: string) => {
    const targetIdx = criteria.findIndex((c) => c.id === id);
    if (targetIdx === -1) return;

    const targetCode = criteria[targetIdx].code;
    const updated = criteria.filter((c) => c.id !== id);
    setCriteria(updated);
    localStorage.setItem('NTM_Criteria', JSON.stringify(updated));

    // Remove row from active forms data as well to maintain perfect state sync
    const updatedPeriods = periods.map((p) => ({
      ...p,
      forms: p.forms.map((f) => {
        const nextData = [...f.data];
        nextData.splice(targetIdx, 1);
        return {
          ...f,
          data: nextData.map((row, index) => ({ ...row, id: index + 1 })), // re-index
        };
      }),
    }));

    setPeriods(updatedPeriods);
    localStorage.setItem('NTM_Periods', JSON.stringify(updatedPeriods));
    addSystemNotification(`Đã loại bỏ tiêu chí ${targetCode} khỏi sổ tay hệ thống`, 'warning');
  };

  const handleViewGuideDoc = (docCode: string) => {
    setActiveDocCode(docCode);
    setCurrentTab('documents');
    setSelectedPeriodId(null);
    setSelectedFormId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- CRUD Period Handlers ---
  const handleAddPeriod = (newPeriod: ReportPeriod) => {
    const updated = [...periods, newPeriod];
    setPeriods(updated);
    localStorage.setItem('NTM_Periods', JSON.stringify(updated));
    addSystemNotification(`Khởi tạo thành công đợt đánh giá: ${newPeriod.name}`, 'success');
  };

  const handleEditPeriod = (updatedPeriod: ReportPeriod) => {
    const updated = periods.map((p) => (p.id === updatedPeriod.id ? updatedPeriod : p));
    setPeriods(updated);
    localStorage.setItem('NTM_Periods', JSON.stringify(updated));
    addSystemNotification(`Cập nhật thành công thông tin đợt rà soát: ${updatedPeriod.name}`, 'info');
  };

  const handleDeletePeriod = (id: string) => {
    const updated = periods.filter((p) => p.id !== id);
    setPeriods(updated);
    localStorage.setItem('NTM_Periods', JSON.stringify(updated));
    addSystemNotification(`Đã xóa sạch đợt báo cáo ID ${id} cùng các phụ biểu`, 'warning');
  };

  // --- Form specific modification handler ---
  const handleUpdateForm = (updatedForm: FormReport) => {
    if (!selectedPeriodId) return;

    const updatedPeriods = periods.map((p) => {
      if (p.id === selectedPeriodId) {
        return {
          ...p,
          forms: p.forms.map((f) => (f.code === updatedForm.code ? updatedForm : f)),
        };
      }
      return p;
    });

    setPeriods(updatedPeriods);
    localStorage.setItem('NTM_Periods', JSON.stringify(updatedPeriods));

    // Automatically trigger corresponding notifications for status changes
    if (updatedForm.status === 'SUBMITTED') {
      addSystemNotification(`Bộ phận thụ lý đã gửi báo cáo số liệu ${updatedForm.code} (${updatedForm.title}). Hãy tiến hành thẩm duyệt.`, 'info');
    } else if (updatedForm.status === 'APPROVED') {
      addSystemNotification(`Hội đồng tỉnh đã phê duyệt Thẩm định biểu mẫu ${updatedForm.code}! Hồ sơ sẵn sàng Giám sát.`, 'success');
    } else if (updatedForm.status === 'SUPERVISED') {
      addSystemNotification(`Đã xác nhận Giám sát & Đóng khóa số liệu hoàn chỉnh cho phụ biểu ${updatedForm.code}.`, 'success');
    }
  };

  // Helper notice poster
  const addSystemNotification = (content: string, type: 'info' | 'warning' | 'success' | 'alert') => {
    const newItem: NotificationItem = {
      id: `n-${Date.now()}`,
      content,
      time: 'Vừa xong',
      type,
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('NTM_Notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, read: true } : item));
      localStorage.setItem('NTM_Notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      localStorage.setItem('NTM_Notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // Find active data to feed statistics tab
  const getStatisticsData = (): CriterionRow[] => {
    // If we have a selected period, feed its forms, else use general defaults
    const activePeriod = periods.find((p) => p.id === '2024-6tdu') || periods[0];
    if (activePeriod && activePeriod.forms && activePeriod.forms.length > 0) {
      // Find the first form or form05 if matches
      const targetForm = activePeriod.forms.find((f) => f.code === 'Biểu 05') || activePeriod.forms[0];
      return targetForm.data;
    }
    return INITIAL_CRITERIA_ROWS;
  };

  // Loading/Blocked views
  if (!userSession) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  // Find the selected form if looking at form details
  const currentSelectedPeriod = periods.find((p) => p.id === selectedPeriodId);
  const currentSelectedForm = currentSelectedPeriod?.forms.find((f) => f.code === selectedFormId);

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex relative overflow-x-hidden">
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation context */}
      <Sidebar
        currentTab={currentTab}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        userSession={userSession}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          // Reset child selected forms to return to list view when clicking side items
          setSelectedPeriodId(null);
          setSelectedFormId(null);
          setIsSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewReportClick={() => {
          setCurrentTab('reports');
          setSelectedPeriodId(null);
          setSelectedFormId(null);
          setIsSidebarOpen(false);
          // Trigger add period modal
          const btn = document.querySelector('[class*="bg-primary"]') as HTMLButtonElement;
          if (btn) btn.click();
        }}
      />

      {/* Primary content side screen wrapper */}
      <div className="flex-1 pl-0 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header
          userSession={userSession}
          onUpdateSession={handleUpdateSession}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenHelpModal={() => setShowHelpModal(true)}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic content rendering */}
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto flex-1">
          {/* If looking at a specific Form detail, suppress main tab structure and render Detail View */}
          {selectedPeriodId && selectedFormId && currentSelectedForm ? (
            <FormDetailView
              form={currentSelectedForm}
              userSession={userSession}
              communes={communes}
              activeCommuneId={activeCommuneId}
              onSetActiveCommuneId={setActiveCommuneId}
              onBack={() => {
                setSelectedFormId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToPeriods={() => {
                setSelectedFormId(null);
                setSelectedPeriodId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onUpdateForm={handleUpdateForm}
              onViewGuideDoc={handleViewGuideDoc}
            />
          ) : (
            <>
              {currentTab === 'overview' && (
                <OverviewTab onGoToReport={() => setCurrentTab('reports')} />
              )}

              {currentTab === 'reports' && (
                <ReportPeriodsTab
                  periods={periods}
                  userSession={userSession}
                  selectedPeriodId={selectedPeriodId}
                  onSelectPeriod={setSelectedPeriodId}
                  onSelectForm={(pId, fId) => {
                    setSelectedPeriodId(pId);
                    setSelectedFormId(fId);
                  }}
                  onAddPeriod={handleAddPeriod}
                  onEditPeriod={handleEditPeriod}
                  onDeletePeriod={handleDeletePeriod}
                  communes={communes}
                  setCommunes={setCommunes}
                  activeCommuneId={activeCommuneId}
                  setActiveCommuneId={setActiveCommuneId}
                  provinceSubmissions={provinceSubmissions}
                  setProvinceSubmissions={setProvinceSubmissions}
                  onAddNotification={addSystemNotification}
                  provinces={provinces}
                />
              )}

              {currentTab === 'criteria' && (
                <CriteriaTab
                  criteria={criteria}
                  categories={categories}
                  userSession={userSession}
                  onAddCriterion={handleAddCriterion}
                  onEditCriterion={handleEditCriterion}
                  onDeleteCriterion={handleDeleteCriterion}
                />
              )}

              {currentTab === 'category_criteria' && (
                <CategoryCriteriaTab
                  categories={categories}
                  setCategories={setCategories}
                  criteria={criteria}
                  userSession={userSession}
                />
              )}

              {currentTab === 'statistics' && (
                <StatisticsTab reportData={getStatisticsData()} />
              )}

              {currentTab === 'appraisal' && (
                <AppraisalTab
                  periods={periods}
                  onUpdatePeriod={handleEditPeriod}
                  userSession={userSession}
                  onViewGuideDoc={handleViewGuideDoc}
                />
              )}

              {currentTab === 'supervision' && (
                <SupervisionTab />
              )}

              {currentTab === 'admin_units' && (
                <AdministrativeTab
                  userSession={userSession}
                  communes={communes}
                  setCommunes={setCommunes}
                  provinces={provinces}
                  setProvinces={setProvinces}
                  provinceSubmissions={provinceSubmissions}
                  setProvinceSubmissions={setProvinceSubmissions}
                />
              )}

              {currentTab === 'accounts' && (
                <AccountsTab
                  userSession={userSession}
                  onUpdateSession={handleUpdateSession}
                />
              )}

              {currentTab === 'form_designer' && (
                <FormDesignerTab
                  userSession={userSession}
                />
              )}

              {currentTab === 'indicator_statistics' && (
                <IndicatorStatisticsTab
                  userSession={userSession}
                  communes={communes}
                />
              )}

              {currentTab === 'documents' && (
                <DocumentsTab
                  activeDocCode={activeDocCode}
                  onDocCodeSelect={setActiveDocCode}
                  userSession={userSession}
                />
              )}
            </>
          )}
        </main>

        {/* Footer exactly matching the reference screenshot */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4.5 px-8 text-xs text-[#64748b] font-medium flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            © 2024 Bộ Nông nghiệp và Môi trường. Hệ thống Giám sát & Đánh giá NTM.
          </div>
          <div className="flex items-center gap-4 text-[#475569]">
            <a href="#terms" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
            <span className="text-slate-200">|</span>
            <a href="#privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
            <span className="text-slate-200">|</span>
            <span>Hỗ trợ kỹ thuật: <strong className="text-[#014285]">1900 1234</strong></span>
          </div>
        </footer>
      </div>

      {/* Guide Manual Help Overlay Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-7 shadow-2xl border border-slate-100 animate-fade-in font-sans">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-primary">
                  <HelpCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Quy tắc Nghiệp vụ &amp; Yêu cầu Kỹ thuật</h4>
                  <p className="text-xs text-secondary font-medium">Hệ thống đồng bộ rà soát 10 tiêu chí Nông thôn mới</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-secondary/50 hover:text-slate-800 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-1.5">
                <span className="font-bold text-indigo-900 uppercase text-xs block">1. Quy trình quản lý tổng hòa (Ký số &rarr; Thẩm định &rarr; Giám sát)</span>
                <p>
                  Chuyên viên cấp cơ sở hoàn thiện số liệu rà soát biểu mẫu, tải hồ sơ minh chứng đính kèm và ký đóng dấu xác minh trước khi gửi nộp. Hội đồng thẩm định liên ngành cấp tỉnh tiếp nhận phê chuẩn, chuyển trạng thái cho ban liên lạc Mặt trận Tổ Quốc đôn đốc giám sát cuối cùng.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-indigo-900 uppercase text-xs block">2. Cơ chế phân phối Nhóm Xã đặc thù</span>
                <p>
                  Tỉnh áp dụng 3 phân vùng tiêu chuẩn (Nhóm 1 đồng bằng nâng cao, Nhóm 2 cận du biên, Nhóm 3 hải đảo vùng khó khăn) để điều tiết phân chia ngưỡng đạt chuẩn thông tin linh động, công bằng theo pháp chế.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-indigo-900 uppercase text-xs block">3. Tính an toàn chữ ký số CA toàn vẹn</span>
                <p>
                  Biên bản gửi nộp bắt buộc có xác chuẩn kỹ thuật chữ ký số của trưởng đại diện liên đoàn hoặc sở phụ trách để kích hoạt lưu chuyển khóa công khai bảo đảm phòng ngừa nguy cơ rò rỉ dữ liệu.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all"
              >
                Đã hiểu quy tắc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
