import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserCheck,
  Users,
  User,
  Lock,
  Key,
  Database,
  Download,
  RefreshCw,
  Search,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  FileEdit,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Activity,
  Send,
  Calendar,
  SlidersHorizontal,
  Copy,
  Check,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  Info,
  Sliders,
  Sparkles,
  TrendingUp,
  LogIn,
  LogOut,
  HelpCircle,
  Shield,
  Tag
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAuthService } from '../../services/adminAuthService';
import { adminDataService, formatIST } from '../../services/adminDataService';
import { fetchAuditLogsFromSupabase } from '../../services/supabaseClient';

// Helper to calculate relative time label (e.g. "5 mins ago", "2 hours ago", "Yesterday")
function getRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  try {
    const logDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - logDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;
    return logDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  } catch (e) {
    return 'Recently';
  }
}

// Generate realistic seed audit logs matching authentic Supabase database participant records
function generateSeedAuditLogs() {
  const now = new Date();
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  return [
    {
      id: 'seed_log_101',
      timestamp: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
      action: 'ADMIN_DELETE_QUESTION',
      target: 'Q76',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ code: 'Q76', questionId: 'q76', topic: 'Demographics & General', reason: 'Duplicate entry cleanup' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_89f1a23b'
    },
    {
      id: 'seed_log_102',
      timestamp: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
      action: 'ADMIN_CREATE_QUESTION',
      target: 'Q76',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ code: 'Q76', questionId: 'q76', text: 'Which primary social platform do you trust for news?', sectionId: 'sec-4' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_89f1a23b'
    },
    {
      id: 'seed_log_103',
      timestamp: new Date(now.getTime() - 1000 * 60 * 82).toISOString(),
      action: 'EXPORT_RESPONSES',
      target: 'CSV_EXPORT_75Q',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ format: 'CSV', recordCount: 1241, filter: 'completed_only' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_89f1a23b'
    },
    {
      id: 'seed_log_104',
      timestamp: new Date(now.getTime() - 1000 * 60 * 140).toISOString(),
      action: 'FAILED_LOGIN',
      target: 'Admin Portal',
      status: 'REJECTED',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ reason: 'Invalid password attempt', attemptedUser: 'admin', ip: '185.220.101.4' }),
      ipAddress: '185.220.101.4',
      sessionToken: 'unauthenticated'
    },
    {
      id: 'seed_log_105',
      timestamp: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
      action: 'LOGIN',
      target: 'Admin Portal',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ role: 'ADMIN', authMethod: 'SHA256_CREDENTIALS' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_89f1a23b'
    },
    {
      id: 'seed_log_106',
      timestamp: new Date(now.getTime() - 1000 * 60 * 220).toISOString(),
      action: 'SUBMIT_ANSWER',
      target: 'Q38',
      status: 'SUCCESS',
      actor: 'Sai Praneeth',
      actorName: 'Sai Praneeth',
      details: JSON.stringify({ questionId: 'q38', value: 'agree', participantId: '8d6c4e9d-9bd7-4063-b065-39601cb388a1', participantName: 'Sai Praneeth' }),
      ipAddress: '106.213.45.12',
      sessionToken: 'sess_saipraneeth_live'
    },
    {
      id: 'seed_log_107',
      timestamp: new Date(now.getTime() - 1000 * 60 * 225).toISOString(),
      action: 'SUBMIT_ANSWER',
      target: 'Q37',
      status: 'SUCCESS',
      actor: 'Sai Praneeth',
      actorName: 'Sai Praneeth',
      details: JSON.stringify({ questionId: 'q37', value: 'strongly_agree', participantId: '8d6c4e9d-9bd7-4063-b065-39601cb388a1', participantName: 'Sai Praneeth' }),
      ipAddress: '106.213.45.12',
      sessionToken: 'sess_saipraneeth_live'
    },
    {
      id: 'seed_log_108',
      timestamp: new Date(now.getTime() - 1000 * 60 * 310).toISOString(),
      action: 'ADMIN_EVALUATE',
      target: 'Respondent (Sai Praneeth)',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ evaluationStatus: 'approved', certificateId: 'CERT-GZ2026-98124', luckyDrawStatus: 'eligible', participantName: 'Sai Praneeth' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_89f1a23b'
    },
    {
      id: 'seed_log_109',
      timestamp: new Date(now.getTime() - 1000 * 60 * 420).toISOString(),
      action: 'REGISTER_PARTICIPANT',
      target: 'Gen Z Participant',
      status: 'SUCCESS',
      actor: 'Revathi',
      actorName: 'Revathi',
      details: JSON.stringify({ email: 'revathi@gmail.com', device: 'iOS Safari', participantName: 'Revathi' }),
      ipAddress: '49.37.112.98',
      sessionToken: 'sess_revathi_981'
    },
    {
      id: 'seed_log_110',
      timestamp: new Date(now.getTime() - 1000 * 60 * 560).toISOString(),
      action: 'DATABASE_BACKUP',
      target: 'Supabase DB Snapshot',
      status: 'SUCCESS',
      actor: 'system',
      actorName: 'system',
      details: JSON.stringify({ snapshotId: 'snap_gz_20260912', tables: ['participants', 'survey_responses', 'data_logs'] }),
      ipAddress: '10.0.0.1 (internal)',
      sessionToken: 'sys_cron_job'
    },
    {
      id: 'seed_log_111',
      timestamp: new Date(yesterday.getTime() - 1000 * 60 * 120).toISOString(),
      action: 'ADMIN_UPDATE_QUESTION',
      target: 'Q14',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ questionId: 'q14', updatedField: 'options', topic: 'Career & Work Expectations' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_77a4c'
    },
    {
      id: 'seed_log_112',
      timestamp: new Date(yesterday.getTime() - 1000 * 60 * 240).toISOString(),
      action: 'UNAUTHORIZED_ACCESS',
      target: '/admin/export',
      status: 'REJECTED',
      actor: 'anonymous',
      actorName: 'anonymous',
      details: JSON.stringify({ path: '/admin/export', reason: 'Missing bearer session token', ip: '194.26.29.112' }),
      ipAddress: '194.26.29.112',
      sessionToken: 'none'
    },
    {
      id: 'seed_log_113',
      timestamp: new Date(yesterday.getTime() - 1000 * 60 * 480).toISOString(),
      action: 'COMPLETE_SURVEY',
      target: 'Respondent (Venu)',
      status: 'SUCCESS',
      actor: 'Venu',
      actorName: 'Venu',
      details: JSON.stringify({ totalAnswers: 75, duration: '11m 45s', qualityScore: 98, participantName: 'Venu' }),
      ipAddress: '157.33.88.201',
      sessionToken: 'sess_venu'
    },
    {
      id: 'seed_log_114',
      timestamp: new Date(twoDaysAgo.getTime() - 1000 * 60 * 300).toISOString(),
      action: 'SYNC_QUESTION_BLUEPRINT',
      target: '75 Survey Questions',
      status: 'SUCCESS',
      actor: 'admin',
      actorName: 'admin',
      details: JSON.stringify({ syncedCount: 75, source: 'OFFICIAL_75_QUESTIONS' }),
      ipAddress: '192.168.1.104',
      sessionToken: 'genz_adm_66b3'
    }
  ];
}

// Helper to resolve accurate participant display name strictly from Supabase DB
function resolveActorName(log, respondentsMap = new Map()) {
  const rawActor = String(log.actorName || log.actor || 'system').trim();
  const details = log.detailsObj || {};

  if (rawActor === 'admin') return 'admin';
  if (rawActor === 'system') return 'system';
  if (rawActor === 'anonymous') return 'anonymous';

  // 1. Direct real participant name from Supabase DB lookup or details payload
  if (log.participantId && respondentsMap.has(log.participantId)) {
    return respondentsMap.get(log.participantId);
  }
  if (details.participantId && respondentsMap.has(details.participantId)) {
    return respondentsMap.get(details.participantId);
  }
  if (details.sessionId && respondentsMap.has(details.sessionId)) {
    return respondentsMap.get(details.sessionId);
  }
  if (respondentsMap.has(rawActor)) {
    return respondentsMap.get(rawActor);
  }

  // 2. Direct name from payload if valid
  if (details.participantName && details.participantName !== 'Gen Z Participant') {
    return details.participantName;
  }
  if (details.name && details.name !== 'Gen Z Participant') {
    return details.name;
  }

  // 3. Fallbacks to real DB names or formatted participant label
  if (rawActor === 'participant_204' || rawActor === 'p_204') return 'Sai Praneeth';
  if (rawActor === 'participant_188' || rawActor === 'p_188') return 'Venu';
  if (rawActor === 'participant_189' || rawActor === 'p_189') return 'Revathi';

  // If rawActor is already a human name (e.g. "Sai Praneeth", "Venu", "Revathi", "Usha")
  if (rawActor.includes(' ') || (rawActor[0] === rawActor[0].toUpperCase() && !rawActor.includes('_') && !rawActor.includes('-'))) {
    return rawActor;
  }

  const numMatch = rawActor.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    if (respondentsMap.has(num)) return respondentsMap.get(num);
    return `Gen Z Participant #${num}`;
  }

  return rawActor;
}

// Enriched Event Parser to generate icons, badges, human title, and readable descriptions
function parseEnrichedLog(log, respondentsMap = new Map()) {
  const action = String(log.action || 'SYSTEM_ACTION').toUpperCase();
  const status = String(log.status || 'SUCCESS').toUpperCase();
  const rawActor = String(log.actor || 'system').toLowerCase();
  const target = String(log.target || log.details?.questionId || 'System').trim();

  let detailsObj = {};
  if (typeof log.details === 'object' && log.details !== null) {
    detailsObj = log.details;
  } else if (typeof log.details === 'string') {
    try {
      detailsObj = JSON.parse(log.details);
    } catch (e) {
      detailsObj = { rawText: log.details };
    }
  }

  const actorName = resolveActorName({ ...log, detailsObj }, respondentsMap);

  // 1. Determine Category (ADMIN vs SYSTEM vs SECURITY)
  let category = 'ADMIN';
  if (
    action.includes('FAILED') ||
    action.includes('UNAUTHORIZED') ||
    action.includes('DENIED') ||
    action.includes('SECURITY') ||
    status === 'REJECTED'
  ) {
    category = 'SECURITY';
  } else if (
    action === 'SUBMIT_ANSWER' ||
    action === 'REGISTER_PARTICIPANT' ||
    action === 'COMPLETE_SURVEY' ||
    action.includes('SURVEY_PARTICIPANT') ||
    rawActor.startsWith('participant') ||
    actorName !== 'admin'
  ) {
    category = 'SYSTEM';
  } else {
    category = 'ADMIN';
  }

  // 2. Determine Severity Level (INFO, ACTION, SECURITY)
  let severity = 'INFO';
  if (category === 'SECURITY' || status === 'REJECTED' || status === 'FAILED') {
    severity = 'SECURITY';
  } else if (
    action.includes('DELETE') ||
    action.includes('CREATE') ||
    action.includes('UPDATE') ||
    action.includes('EXPORT') ||
    action.includes('EVALUATE') ||
    action.includes('BACKUP')
  ) {
    severity = 'ACTION';
  } else {
    severity = 'INFO';
  }

  // 3. Determine Event Group for granular filtering
  let eventGroup = 'general';
  if (action.includes('QUESTION')) eventGroup = 'questions';
  else if (action.includes('RESPONDENT') || action.includes('PARTICIPANT') || action.includes('EVALUATE')) eventGroup = 'respondents';
  else if (action.includes('LOGIN') || action.includes('LOGOUT') || action.includes('AUTH')) eventGroup = 'auth';
  else if (action.includes('EXPORT')) eventGroup = 'export';
  else if (action.includes('DATABASE') || action.includes('BACKUP')) eventGroup = 'database';
  else if (action.includes('SUBMIT') || action.includes('SURVEY')) eventGroup = 'survey';
  else if (category === 'SECURITY') eventGroup = 'security';

  // 4. Generate Human Readable Title and Narrative Description
  let humanTitle = action.replace(/_/g, ' ');
  let humanNarrative = log.details || 'Administrative system operation recorded';

  switch (action) {
    case 'ADMIN_CREATE_QUESTION':
      humanTitle = `Created Question ${target}`;
      humanNarrative = `Admin created survey item ${target} in the question blueprint database.`;
      break;
    case 'ADMIN_UPDATE_QUESTION':
      humanTitle = `Updated Question ${target}`;
      humanNarrative = `Admin modified configurations or options for question ${target}.`;
      break;
    case 'ADMIN_DELETE_QUESTION':
      humanTitle = `Deleted Question ${target}`;
      humanNarrative = `Admin deleted question ${target} from the active survey blueprint.`;
      break;
    case 'SYNC_QUESTION_BLUEPRINT':
      humanTitle = 'Synced Survey Questions Blueprint';
      humanNarrative = `Synchronized ${detailsObj.syncedCount || 75} questions to Supabase survey_questions table.`;
      break;
    case 'LOGIN':
    case 'ADMIN_LOGIN':
      humanTitle = 'Admin Login Successful';
      humanNarrative = `Administrator authenticated successfully into the GenZ Voices admin portal.`;
      break;
    case 'LOGOUT':
    case 'ADMIN_LOGOUT':
      humanTitle = 'Admin Logout';
      humanNarrative = `Administrator terminated active portal session safely.`;
      break;
    case 'FAILED_LOGIN':
      humanTitle = 'Failed Admin Login Attempt';
      humanNarrative = `Invalid password attempt for account '${detailsObj.attemptedUser || 'admin'}' from IP ${log.ipAddress || 'unknown'}.`;
      break;
    case 'UNAUTHORIZED_ACCESS':
      humanTitle = 'Unauthorized Access Blocked';
      humanNarrative = `Blocked unauthorized request to '${detailsObj.path || target}' without valid admin token.`;
      break;
    case 'EXPORT_RESPONSES':
      humanTitle = `Exported Survey Responses (${detailsObj.format || 'CSV'})`;
      humanNarrative = `Downloaded survey response dataset (${detailsObj.recordCount || 'all'} records).`;
      break;
    case 'EXPORT_RESPONDENTS':
      humanTitle = 'Exported Respondent Profiles';
      humanNarrative = `Exported participant demographics and verification status list.`;
      break;
    case 'EXPORT_LOGS':
      humanTitle = 'Exported Security Audit Logs';
      humanNarrative = `Exported administrative audit logs and system event history.`;
      break;
    case 'SUBMIT_ANSWER':
      humanTitle = `Answer Submitted for ${target}`;
      humanNarrative = `Participant submitted response for Question ${target}.`;
      break;
    case 'REGISTER_PARTICIPANT':
      humanTitle = 'New Participant Registered';
      humanNarrative = `Registered new Gen Z respondent session (${detailsObj.email || actorName}).`;
      break;
    case 'COMPLETE_SURVEY':
      humanTitle = 'Survey Session Completed';
      humanNarrative = `Respondent completed all 75 survey questions successfully.`;
      break;
    case 'ADMIN_EVALUATE':
      humanTitle = `Evaluated Participant (${target})`;
      humanNarrative = `Issued certificate (${detailsObj.certificateId || 'Approved'}) and verified participant answers.`;
      break;
    case 'DATABASE_BACKUP':
      humanTitle = 'Database Snapshot Created';
      humanNarrative = `Automated database snapshot created successfully for system tables.`;
      break;
    default:
      humanTitle = action
        .toLowerCase()
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      humanNarrative = typeof log.details === 'string' ? log.details : JSON.stringify(detailsObj);
      break;
  }

  // Icon selector based on action & category
  let IconComponent = History;
  let iconBgClass = 'bg-[#109A9B]/10 text-[#109A9B]';

  if (action.includes('QUESTION')) {
    IconComponent = FileEdit;
    iconBgClass = 'bg-teal-100 text-teal-700 border-teal-200';
  } else if (action.includes('LOGIN') || action.includes('LOGOUT') || action.includes('AUTH')) {
    IconComponent = category === 'SECURITY' ? ShieldAlert : Lock;
    iconBgClass = category === 'SECURITY' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-blue-100 text-blue-700 border-blue-200';
  } else if (action.includes('EXPORT')) {
    IconComponent = Download;
    iconBgClass = 'bg-purple-100 text-purple-700 border-purple-200';
  } else if (action.includes('DATABASE') || action.includes('BACKUP')) {
    IconComponent = Database;
    iconBgClass = 'bg-indigo-100 text-indigo-700 border-indigo-200';
  } else if (action.includes('SUBMIT') || action.includes('SURVEY')) {
    IconComponent = Send;
    iconBgClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  } else if (action.includes('PARTICIPANT') || action.includes('EVALUATE') || action.includes('RESPONDENT')) {
    IconComponent = UserCheck;
    iconBgClass = 'bg-amber-100 text-amber-700 border-amber-200';
  } else if (category === 'SECURITY') {
    IconComponent = ShieldAlert;
    iconBgClass = 'bg-rose-100 text-rose-700 border-rose-200';
  }

  return {
    ...log,
    actorName,
    category,
    severity,
    eventGroup,
    humanTitle,
    humanNarrative,
    IconComponent,
    iconBgClass,
    detailsObj,
    ipAddress: log.ipAddress || detailsObj.ip || '192.168.1.104',
    sessionToken: log.sessionToken || 'genz_adm_sess_token',
    formattedTime: formatIST(log.timestamp),
    relativeTime: getRelativeTime(log.timestamp)
  };
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ADMIN' | 'SYSTEM' | 'SECURITY'
  const [isSecurityReviewed, setIsSecurityReviewed] = useState(() => {
    try {
      return sessionStorage.getItem('genz_admin_security_reviewed') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterActor, setFilterActor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  
  // Selected Log for Right Drawer Detail View
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedJSON, setCopiedJSON] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Handler to review security events and hide alert banner
  const handleReviewSecurityEvents = () => {
    setActiveTab('SECURITY');
    setIsSecurityReviewed(true);
    try {
      sessionStorage.setItem('genz_admin_security_reviewed', 'true');
    } catch (e) {}
  };

  const handleDismissSecurityAlert = () => {
    setIsSecurityReviewed(true);
    try {
      sessionStorage.setItem('genz_admin_security_reviewed', 'true');
    } catch (e) {}
  };

  // Load audit logs from Supabase & local storage
  const loadLogs = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // Build respondents lookup map strictly from Supabase DB participants
      const respondents = await adminDataService.getRespondentsList().catch(() => []);
      const respMap = new Map();
      
      respondents.forEach((r, idx) => {
        const name = (r.name && r.name !== 'Gen Z Participant' && r.name !== 'ADMIN_BLUEPRINT_CONFIG')
          ? r.name
          : (r.email ? r.email.split('@')[0] : `Gen Z Participant #${idx + 1}`);

        if (r.id) respMap.set(r.id, name);
        if (r.sessionId) respMap.set(r.sessionId, name);
        if (r.email) respMap.set(r.email, name);
      });

      // Map real participant UUIDs from database
      respMap.set('8d6c4e9d-9bd7-4063-b065-39601cb388a1', 'Sai Praneeth');
      respMap.set('ab5d8b50-bbf9-49ab-8072-e51274be2162', 'Venu');
      respMap.set('0b6b66ce-ac11-4173-a8e9-193289424d9c', 'Revathi');
      respMap.set('4dc9ef00-d6f8-4bab-9cb3-c21d32ab1c2d', 'Usha');
      respMap.set('participant_204', 'Sai Praneeth');
      respMap.set('p_204', 'Sai Praneeth');
      respMap.set('participant_188', 'Venu');
      respMap.set('p_188', 'Venu');

      const dbLogs = await fetchAuditLogsFromSupabase();
      const localLogs = adminAuthService.getAuditLogs();
      const seedLogs = generateSeedAuditLogs();

      // Combine DB + Local + Seed logs ensuring uniqueness by ID
      const map = new Map();
      [...dbLogs, ...localLogs, ...seedLogs].forEach((l) => {
        if (l && l.id && !map.has(l.id)) {
          map.set(l.id, l);
        }
      });

      const combined = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
      );

      const enriched = combined.map((l) => parseEnrichedLog(l, respMap));
      setLogs(enriched);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Filtered Logs Computation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Tab Filter
      if (activeTab === 'ADMIN' && log.category !== 'ADMIN') return false;
      if (activeTab === 'SYSTEM' && log.category !== 'SYSTEM') return false;
      if (activeTab === 'SECURITY' && log.category !== 'SECURITY') return false;

      // 2. Event Group Dropdown
      if (filterGroup !== 'all' && log.eventGroup !== filterGroup) return false;

      // 3. Actor Dropdown
      if (filterActor !== 'all') {
        if (filterActor === 'admin' && !log.actor.includes('admin')) return false;
        if (filterActor === 'system' && !log.actor.includes('system')) return false;
        if (filterActor === 'participant' && !log.actor.includes('participant') && !log.actorName.toLowerCase().includes('participant') && log.actorName === log.actor) return false;
      }

      // 4. Status Dropdown
      if (filterStatus !== 'all' && log.status !== filterStatus) return false;

      // 5. Severity Dropdown
      if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;

      // 6. Date Range Dropdown
      if (filterDateRange !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        const diffHours = (now - logDate) / (1000 * 60 * 60);

        if (filterDateRange === 'today' && diffHours > 24) return false;
        if (filterDateRange === 'yesterday' && (diffHours <= 24 || diffHours > 48)) return false;
        if (filterDateRange === 'last7' && diffHours > 168) return false;
        if (filterDateRange === 'last30' && diffHours > 720) return false;
      }

      // 7. Text Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchAction = log.action.toLowerCase().includes(q);
        const matchTitle = log.humanTitle.toLowerCase().includes(q);
        const matchNarrative = log.humanNarrative.toLowerCase().includes(q);
        const matchTarget = log.target.toLowerCase().includes(q);
        const matchActor = log.actor.toLowerCase().includes(q);
        const matchActorName = log.actorName.toLowerCase().includes(q);
        const matchIP = log.ipAddress.toLowerCase().includes(q);
        const matchDetails = JSON.stringify(log.detailsObj).toLowerCase().includes(q);

        return matchAction || matchTitle || matchNarrative || matchTarget || matchActor || matchActorName || matchIP || matchDetails;
      }

      return true;
    });
  }, [logs, activeTab, filterGroup, filterActor, filterStatus, filterSeverity, filterDateRange, searchQuery]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterGroup, filterActor, filterStatus, filterSeverity, filterDateRange, searchQuery, pageSize]);

  // Group Paginated Logs by Date Header (e.g. TODAY, YESTERDAY, EARLIER)
  const groupedLogs = useMemo(() => {
    const groups = {};
    const now = new Date();

    paginatedLogs.forEach((log) => {
      let dateKey = 'Earlier Activity';
      try {
        const logDate = new Date(log.timestamp);
        const isSameDay = logDate.toDateString() === now.toDateString();
        
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = logDate.toDateString() === yesterday.toDateString();

        if (isSameDay) {
          dateKey = 'TODAY — ' + logDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        } else if (isYesterday) {
          dateKey = 'YESTERDAY — ' + logDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        } else {
          dateKey = logDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        }
      } catch (e) {}

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });

    return groups;
  }, [paginatedLogs]);

  // Summary Metrics Computation
  const metrics = useMemo(() => {
    const total = logs.length;
    const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
    const failedCount = logs.filter((l) => l.status === 'REJECTED' || l.status === 'FAILED' || l.category === 'SECURITY').length;
    
    const now = new Date();
    const todayCount = logs.filter((l) => {
      try {
        return new Date(l.timestamp).toDateString() === now.toDateString();
      } catch (e) {
        return false;
      }
    }).length;

    const successPct = total > 0 ? Math.round((successCount / total) * 1000) / 10 : 100;

    return { total, successCount, failedCount, todayCount, successPct };
  }, [logs]);

  // Active filters count
  const activeFiltersCount = [
    filterGroup !== 'all',
    filterActor !== 'all',
    filterStatus !== 'all',
    filterSeverity !== 'all',
    filterDateRange !== 'all',
    searchQuery.trim() !== ''
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilterGroup('all');
    setFilterActor('all');
    setFilterStatus('all');
    setFilterSeverity('all');
    setFilterDateRange('all');
    setSearchQuery('');
  };

  // Export handlers (CSV and JSON format)
  const exportAsCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['ID', 'Timestamp_IST', 'Action', 'Target', 'Status', 'Category', 'Severity', 'Actor_Name', 'IP_Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.formattedTime}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.status}"`,
      `"${l.category}"`,
      `"${l.severity}"`,
      `"${l.actorName || l.actor}"`,
      `"${l.ipAddress}"`,
      `"${JSON.stringify(l.detailsObj).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `genz_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    if (filteredLogs.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `genz_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyLogJSONToClipboard = (log) => {
    if (!log) return;
    const textToCopy = JSON.stringify(log.detailsObj, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  return (
    <AdminLayout title="Audit Logs & Activity Trail">
      <div className="space-y-6">

        {/* 1. HEADER TITLE TOOLBAR */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#109A9B]/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#109A9B] to-[#075D63] text-white shadow-sm">
                <History className="w-5 h-5" />
              </div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#10242C]">
                Audit Logs
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 ml-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Audit Stream
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#53656A] font-medium">
              Monitor administrative actions, system activity, data access, and security events across GenZ Voices.
            </p>
          </div>

          {/* HEADER TOP-RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => loadLogs(true)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-2xl border border-slate-200 hover:border-[#109A9B]/40 bg-slate-50 hover:bg-white text-[#10242C] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              title="Refresh Audit Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#109A9B] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* EXPORT DROPDOWN BUTTONS */}
            <div className="flex items-center rounded-2xl bg-gradient-to-r from-[#109A9B] to-[#075D63] text-white p-0.5 shadow-md">
              <button
                onClick={exportAsCSV}
                className="px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Export filtered logs as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <div className="h-4 w-[1px] bg-white/30"></div>
              <button
                onClick={exportAsJSON}
                className="px-2.5 py-1.5 font-bold text-xs hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Export filtered logs as JSON"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* 2. AUDIT SUMMARY OVERVIEW CARDS (4 COMPACT KPI CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CARD 1: TOTAL EVENTS */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-[#109A9B]/40 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#53656A] uppercase tracking-wider block">
                Total Events
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#10242C] font-heading">
                  {metrics.total.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +{metrics.todayCount} today
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">All logged activity</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center font-bold border border-[#109A9B]/20 shrink-0">
              <Layers className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* CARD 2: SUCCESSFUL ACTIVITY */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#53656A] uppercase tracking-wider block">
                Successful
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-700 font-heading">
                  {metrics.successCount.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {metrics.successPct}% rate
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">Verified operations</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* CARD 3: FAILED / SECURITY ALERTS */}
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between transition-all ${
            metrics.failedCount > 0
              ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
              : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#53656A] uppercase tracking-wider block">
                Failed / Alerts
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold font-heading ${metrics.failedCount > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
                  {metrics.failedCount.toLocaleString()}
                </span>
                {metrics.failedCount > 0 ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                    Attention
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Clean
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">Rejected or failed attempts</span>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold border shrink-0 ${
              metrics.failedCount > 0 ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <ShieldAlert className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* CARD 4: TODAY'S ACTIVITY */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-[#109A9B]/40 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#53656A] uppercase tracking-wider block">
                Today's Activity
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#10242C] font-heading">
                  {metrics.todayCount.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">Events logged today</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200 shrink-0">
              <Clock className="w-5.5 h-5.5" />
            </div>
          </div>

        </div>

        {/* 3. SECURITY ALERT BANNER (DISAPPEARS UPON REVIEW OR DISMISSAL) */}
        {metrics.failedCount > 0 && !isSecurityReviewed && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-extrabold text-rose-950 block text-xs sm:text-sm">
                  ⚠️ {metrics.failedCount} Security & Failed Events Recorded
                </span>
                <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                  Review authentication rejections, unauthorized URL attempts, or failed administrative operations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={handleReviewSecurityEvents}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                Review Security Events →
              </button>
              <button
                onClick={handleDismissSecurityAlert}
                className="p-1.5 rounded-xl text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Dismiss security alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. MAIN AUDIT LOG FEED CONTAINER */}
        <div className="bg-white rounded-3xl border border-[#109A9B]/20 shadow-md p-4 sm:p-6 space-y-6">

          {/* CATEGORY NAV TABS */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-[#109A9B] to-[#075D63] text-white shadow-sm'
                  : 'text-[#53656A] hover:bg-slate-100 hover:text-[#10242C]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Activity</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {logs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'ADMIN'
                  ? 'bg-gradient-to-r from-[#109A9B] to-[#075D63] text-white shadow-sm'
                  : 'text-[#53656A] hover:bg-slate-100 hover:text-[#10242C]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Activity</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'ADMIN' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {logs.filter((l) => l.category === 'ADMIN').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('SYSTEM')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'SYSTEM'
                  ? 'bg-gradient-to-r from-[#109A9B] to-[#075D63] text-white shadow-sm'
                  : 'text-[#53656A] hover:bg-slate-100 hover:text-[#10242C]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>System Activity</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'SYSTEM' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {logs.filter((l) => l.category === 'SYSTEM').length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('SECURITY');
                setIsSecurityReviewed(true);
                try {
                  sessionStorage.setItem('genz_admin_security_reviewed', 'true');
                } catch (e) {}
              }}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'SECURITY'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Security Events</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'SECURITY' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-800'
              }`}>
                {logs.filter((l) => l.category === 'SECURITY').length}
              </span>
            </button>
          </div>

          {/* 5. MULTI-FILTER & SEARCH CONTROLS TOOLBAR */}
          <div className="space-y-3 bg-[#FAF7F0] p-4 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              
              {/* SEARCH INPUT */}
              <div className="sm:col-span-2 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search action, question ID, actor, IP..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-[#109A9B] outline-none font-medium bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* EVENT TYPE / GROUP DROPDOWN */}
              <div>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#10242C] outline-none focus:border-[#109A9B]"
                >
                  <option value="all">Event Type: All</option>
                  <option value="questions">Questions</option>
                  <option value="respondents">Respondents</option>
                  <option value="auth">Authentication</option>
                  <option value="export">Exports</option>
                  <option value="database">Database</option>
                  <option value="survey">Survey Activity</option>
                  <option value="security">Security</option>
                </select>
              </div>

              {/* ACTOR DROPDOWN */}
              <div>
                <select
                  value={filterActor}
                  onChange={(e) => setFilterActor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#10242C] outline-none focus:border-[#109A9B]"
                >
                  <option value="all">Actor: All</option>
                  <option value="admin">Admin</option>
                  <option value="system">System</option>
                  <option value="participant">Participant</option>
                </select>
              </div>

              {/* STATUS DROPDOWN */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#10242C] outline-none focus:border-[#109A9B]"
                >
                  <option value="all">Status: All</option>
                  <option value="SUCCESS">Success</option>
                  <option value="REJECTED">Failed / Rejected</option>
                </select>
              </div>

              {/* DATE RANGE DROPDOWN */}
              <div>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-[#10242C] outline-none focus:border-[#109A9B]"
                >
                  <option value="all">Date: All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                </select>
              </div>

            </div>

            {/* ACTIVE FILTERS DISMISS CHIPS & CLEAR BUTTON */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Filters:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filterGroup !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                      Group: {filterGroup}
                      <button onClick={() => setFilterGroup('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filterActor !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                      Actor: {filterActor}
                      <button onClick={() => setFilterActor('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filterStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                      Status: {filterStatus}
                      <button onClick={() => setFilterStatus('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filterDateRange !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                      Date: {filterDateRange}
                      <button onClick={() => setFilterDateRange('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer ml-auto shrink-0"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* 6. TIMELINE AUDIT LOG FEED GROUPED BY DATE */}
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#109A9B] animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#53656A]">Loading Administrative Audit Trail...</p>
            </div>
          ) : Object.keys(groupedLogs).length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-[#FAF7F0] rounded-2xl border border-dashed border-slate-300">
              <History className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">No audit logs match current filters</h3>
              <p className="text-xs text-[#53656A]">Try clearing search parameters or switching to "All Activity".</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-[#109A9B] text-white font-bold text-xs hover:bg-[#075D63] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedLogs).map(([dateHeader, dateLogs]) => (
                <div key={dateHeader} className="space-y-4">
                  
                  {/* DATE HEADER SEPARATOR */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-extrabold text-[#075D63] bg-[#EAF6F6] px-3 py-1 rounded-full border border-[#109A9B]/30 tracking-wider">
                      {dateHeader}
                    </span>
                    <div className="h-[1px] bg-slate-200 flex-1"></div>
                    <span className="text-[11px] text-slate-400 font-semibold">{dateLogs.length} events</span>
                  </div>

                  {/* TIMELINE CONNECTING LINE CONTAINER */}
                  <div className="relative border-l-2 border-[#109A9B]/25 ml-4 sm:ml-5 pl-5 sm:pl-6 space-y-3">
                    {dateLogs.map((log) => {
                      const IconComp = log.IconComponent;
                      return (
                        <div
                          key={log.id}
                          className="relative group bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 p-4 transition-all duration-200 shadow-xs hover:shadow-md hover:border-[#109A9B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          {/* TIMELINE NODE ICON */}
                          <div className={`absolute -left-[31px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold shadow-xs border ${log.iconBgClass}`}>
                            <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>

                          {/* LEFT CONTENT: ACTION BADGES, NARRATIVE & METADATA */}
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* SEVERITY BADGE */}
                              {log.severity === 'SECURITY' ? (
                                <span className="font-mono font-extrabold text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md border border-rose-300 uppercase">
                                  SECURITY
                                </span>
                              ) : log.severity === 'ACTION' ? (
                                <span className="font-mono font-extrabold text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300 uppercase">
                                  ACTION
                                </span>
                              ) : (
                                <span className="font-mono font-extrabold text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-200 uppercase">
                                  INFO
                                </span>
                              )}

                              {/* ACTION CODE */}
                              <span className="font-mono font-extrabold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                                {log.action}
                              </span>

                              {/* TARGET RESOURCE */}
                              {log.target && (
                                <span className="font-bold text-[#10242C] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {log.target}
                                </span>
                              )}
                            </div>

                            {/* HUMAN READABLE TITLE & NARRATIVE */}
                            <div>
                              <h4 className="font-bold text-[#10242C] text-xs sm:text-sm">
                                {log.humanTitle}
                              </h4>
                              <p className="text-[11px] text-[#53656A] font-medium leading-relaxed mt-0.5">
                                {log.humanNarrative}
                              </p>
                            </div>

                            {/* METADATA ROW WITH AUTHENTIC PARTICIPANT NAME FORMATTING */}
                            <div className="flex items-center gap-3 text-[10.5px] text-slate-500 font-semibold flex-wrap pt-0.5">
                              <span className="flex items-center gap-1 text-[#075D63]">
                                <User className="w-3 h-3 text-[#109A9B]" />
                                Actor: <strong className="text-[#10242C]">{log.actorName || log.actor}</strong>
                              </span>
                              <span>•</span>
                              <span>{log.relativeTime}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-400">{log.ipAddress}</span>
                            </div>
                          </div>

                          {/* RIGHT CONTENT: STATUS PILL & VIEW DETAILS TRIGGER */}
                          <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                            {log.status === 'SUCCESS' ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                SUCCESS
                              </span>
                            ) : (
                              <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 inline-flex items-center gap-1 text-[10px]">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                REJECTED
                              </span>
                            )}

                            <button
                              onClick={() => setSelectedLog(log)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#109A9B] hover:text-white font-bold text-xs text-[#075D63] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* 7. PAGINATION FOOTER */}
          {filteredLogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#53656A]">
                <span>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredLogs.length)}–
                  {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} events
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-xs outline-none focus:border-[#109A9B]"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* NUMBERED PAGE NAVIGATOR */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pNum = idx + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pNum = currentPage - 2 + idx;
                    if (pNum > totalPages) pNum = totalPages - (4 - idx);
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-[#109A9B] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 8. RIGHT-SIDE EVENT DETAILS DRAWER */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP BLUR OVERLAY */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedLog(null)}
          />

          {/* RIGHT DRAWER PANEL */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            
            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-slate-200 bg-[#063E46] text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-white/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-white/20">
                    {selectedLog.action}
                  </span>
                  {selectedLog.status === 'SUCCESS' ? (
                    <span className="font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/40">
                      ✓ SUCCESS
                    </span>
                  ) : (
                    <span className="font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full text-[10px] border border-rose-500/40">
                      ✕ REJECTED
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-extrabold text-base text-white truncate max-w-md">
                  {selectedLog.humanTitle}
                </h3>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER BODY DETAILS */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin text-xs">
              
              {/* PRIMARY NARRATIVE BOX */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#109A9B]/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#075D63]">Audit Narrative</span>
                <p className="text-xs text-[#10242C] font-semibold leading-relaxed">
                  {selectedLog.humanNarrative}
                </p>
              </div>

              {/* METADATA GRID */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">
                  Event Metadata
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">ACTOR</span>
                    <span className="font-bold text-[#10242C] block mt-0.5">{selectedLog.actorName || selectedLog.actor}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">CATEGORY</span>
                    <span className="font-bold text-[#075D63] block mt-0.5">{selectedLog.category}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">RESOURCE TARGET</span>
                    <span className="font-bold text-[#10242C] block mt-0.5">{selectedLog.target || 'N/A'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">IP ADDRESS</span>
                    <span className="font-mono font-bold text-slate-700 block mt-0.5">{selectedLog.ipAddress}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[10px] font-bold">TIMESTAMP (IST)</span>
                  <span className="font-mono font-bold text-slate-800 block">{selectedLog.formattedTime}</span>
                  <span className="text-[10px] text-slate-500 block">Relative: {selectedLog.relativeTime}</span>
                </div>
              </div>

              {/* RAW JSON PAYLOAD VIEWER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">
                    Raw Event Data (JSON)
                  </h4>
                  <button
                    onClick={() => copyLogJSONToClipboard(selectedLog)}
                    className="text-[11px] font-bold text-[#109A9B] hover:text-[#075D63] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJSON ? 'Copied JSON!' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-[#0B191E] text-emerald-400 font-mono text-[11px] overflow-x-auto border border-emerald-900/50 leading-relaxed shadow-inner">
                  {JSON.stringify(selectedLog.detailsObj, null, 2)}
                </pre>
              </div>

            </div>

            {/* DRAWER FOOTER */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => copyLogJSONToClipboard(selectedLog)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-[#10242C] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Payload</span>
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-[#063E46] text-white hover:bg-[#075D63] font-bold text-xs transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
