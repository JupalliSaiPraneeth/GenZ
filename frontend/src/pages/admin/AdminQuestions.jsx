import React, { useState, useEffect } from 'react';
import {
  Search,
  HelpCircle,
  Layers,
  ChevronRight,
  CheckCircle2,
  CheckSquare,
  Edit3,
  X,
  Plus,
  Trash2,
  Save,
  Sliders,
  FolderPlus,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSurveyStore } from '../../stores/surveyStore';
import GridModal from '../../components/common/GridModal';

export default function AdminQuestions() {
  const { questions, sections, addQuestion, updateQuestion, deleteQuestion, loadQuestionsFromSupabase } = useSurveyStore();

  useEffect(() => {
    loadQuestionsFromSupabase();
  }, [loadQuestionsFromSupabase]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showAlert = (title, message, type = 'warning') => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm, type = 'confirm') => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  // Draft state for new question modal
  const [newQuestionDraft, setNewQuestionDraft] = useState({
    sectionId: 'sec-1',
    topic: '',
    text: '',
    selectionType: 'single',
    options: [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
      { label: 'Option 3', value: 'option_3' },
    ],
  });

  const filteredQs = questions.filter((q) => {
    const matchesSec = selectedSection === 'all' || q.sectionId === selectedSection;
    const matchesQuery =
      q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSec && matchesQuery;
  });

  const handleOpenInspectModal = (q) => {
    setEditingQuestion({
      ...q,
      sectionId: q.sectionId || 'sec-1',
      isMultiSelect: Boolean(q.isMultiSelect || q.selectionType === 'multiple'),
      selectionType: q.isMultiSelect || q.selectionType === 'multiple' ? 'multiple' : 'single',
      options: q.options ? q.options.map((opt) => ({ ...opt })) : [],
    });
  };

  const handleCloseModal = () => {
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const isMulti = editingQuestion.selectionType === 'multiple';
    const updated = {
      ...editingQuestion,
      isMultiSelect: isMulti,
      selectionType: isMulti ? 'multiple' : 'single',
    };

    await updateQuestion(updated);
    setSavedSuccessMsg(`Updated ${updated.code} and synced to Supabase database!`);
    setTimeout(() => setSavedSuccessMsg(''), 4000);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (qId, qCode) => {
    showConfirm(
      'Confirm Deletion',
      `Are you sure you want to delete question ${qCode}? Question numbers across sections will re-sequence automatically.`,
      async () => {
        await deleteQuestion(qId);
        setSavedSuccessMsg(`Deleted question ${qCode} and synced to Supabase database.`);
        setTimeout(() => setSavedSuccessMsg(''), 4000);
        setEditingQuestion(null);
      },
      'confirm'
    );
  };

  const handleCreateQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestionDraft.text.trim()) {
      showAlert('Missing Information', 'Please enter a question prompt text!', 'warning');
      return;
    }
    if (!newQuestionDraft.topic.trim()) {
      showAlert('Missing Information', 'Please enter a topic or construct category!', 'warning');
      return;
    }

    const res = await addQuestion(newQuestionDraft);
    const created = res?.created || res;
    const syncRes = res?.syncRes;
    const targetSec = sections.find((s) => s.id === newQuestionDraft.sectionId);

    if (syncRes?.success || syncRes === true) {
      setSavedSuccessMsg(
        `Added new question (${created?.code || 'New Q'}) into Section ${targetSec?.number || 1}! Successfully created in Supabase database.`
      );
      setTimeout(() => setSavedSuccessMsg(''), 4500);
    } else {
      const errMsg = syncRes?.error || 'Unknown Supabase write error';
      showAlert('Supabase Database Warning', `Saved locally, but Supabase rejected database write.\n\nReason: ${errMsg}`, 'warning');
    }

    setIsCreateModalOpen(false);
    setNewQuestionDraft({
      sectionId: 'sec-1',
      topic: '',
      text: '',
      selectionType: 'single',
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ],
    });
  };

  const handleOptionChange = (idx, field, val) => {
    if (!editingQuestion) return;
    const newOptions = [...editingQuestion.options];
    newOptions[idx] = { ...newOptions[idx], [field]: val };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const handleAddOption = () => {
    if (!editingQuestion) return;
    const count = editingQuestion.options.length + 1;
    const newOpt = { label: `New Option ${count}`, value: `option_${count}` };
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, newOpt],
    });
  };

  const handleRemoveOption = (idx) => {
    if (!editingQuestion) return;
    if (editingQuestion.options.length <= 1) {
      showAlert('Action Not Allowed', 'A question must have at least one option!', 'warning');
      return;
    }
    const newOptions = editingQuestion.options.filter((_, i) => i !== idx);
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  // Draft options helpers for Create Modal
  const handleDraftOptionChange = (idx, field, val) => {
    const newOptions = [...newQuestionDraft.options];
    newOptions[idx] = { ...newOptions[idx], [field]: val };
    setNewQuestionDraft({ ...newQuestionDraft, options: newOptions });
  };

  const handleAddDraftOption = () => {
    const count = newQuestionDraft.options.length + 1;
    const newOpt = { label: `Option ${count}`, value: `option_${count}` };
    setNewQuestionDraft({
      ...newQuestionDraft,
      options: [...newQuestionDraft.options, newOpt],
    });
  };

  const handleRemoveDraftOption = (idx) => {
    if (newQuestionDraft.options.length <= 1) {
      showAlert('Action Not Allowed', 'A question must have at least one option!', 'warning');
      return;
    }
    const newOptions = newQuestionDraft.options.filter((_, i) => i !== idx);
    setNewQuestionDraft({ ...newQuestionDraft, options: newOptions });
  };

  return (
    <AdminLayout title={`Questionnaire Blueprint (${questions.length} Questions)`}>
      {savedSuccessMsg && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{savedSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold shrink-0 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION TABS & SEARCH TOOLBAR */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#109A9B] shrink-0" />
              <span>Official Study Blueprint ({questions.length} Questions)</span>
            </h2>
            <p className="text-xs text-[#53656A] font-medium leading-relaxed">
              Create new questions, allocate to sections, and auto-sequence question numbers automatically across all sections.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#063E46] to-[#075D63] hover:from-[#075D63] hover:to-[#109A9B] text-white font-sora font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95 border border-white/10"
            >
              <Plus className="w-4 h-4 text-[#FDE7B5]" />
              <span>+ Add New Question</span>
            </button>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code, text, or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B] bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* CHAPTER SECTION BUTTONS DYNAMICALLY RENDERED */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 scrollbar-none pb-0.5">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
              selectedSection === 'all'
                ? 'bg-gradient-to-r from-[#063E46] to-[#075D63] text-white shadow-sm ring-1 ring-white/10'
                : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
            }`}
          >
            All Sections ({questions.length} Qs)
          </button>

          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                selectedSection === sec.id
                  ? 'bg-gradient-to-r from-[#063E46] to-[#075D63] text-white shadow-sm ring-1 ring-white/10'
                  : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
              }`}
            >
              Sec {sec.number}: {sec.questionRange}
            </button>
          ))}
        </div>
      </div>

      {/* QUESTIONS GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredQs.map((q) => {
          const isMulti = Boolean(q.isMultiSelect || q.selectionType === 'multiple');
          const sec = sections.find((s) => s.id === q.sectionId);

          return (
            <div
              key={q.id}
              onClick={() => handleOpenInspectModal(q)}
              className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#109A9B]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-extrabold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                      {q.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Sec {sec?.number || 1}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isMulti
                        ? 'bg-purple-50 text-purple-900 border-purple-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isMulti ? (
                      <>
                        <CheckSquare className="w-3 h-3 text-purple-700 shrink-0" />
                        <span>Multi-Select</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>Single Option</span>
                      </>
                    )}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-[#53656A] block truncate">{q.topic}</span>
                <h4 className="font-bold text-xs sm:text-sm text-[#10242C] leading-snug group-hover:text-[#075D63] transition-colors line-clamp-3">
                  {q.text}
                </h4>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#53656A] font-semibold">
                <span className="text-slate-500 text-[11px] sm:text-xs">{q.options?.length || 0} Options</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenInspectModal(q);
                  }}
                  className="text-[#075D63] group-hover:text-[#109A9B] font-extrabold flex items-center gap-1 hover:underline cursor-pointer text-xs"
                >
                  <span>Inspect & Edit</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW QUESTION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#063E46] via-[#075D63] to-[#109A9B] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#FDE7B5] flex items-center justify-center font-extrabold text-sm shadow-xs border border-white/20 shrink-0">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white truncate">
                    Create New Question & Allocate Section
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-200 font-medium truncate">
                    Question sequence number will be assigned automatically based on selected section
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateQuestionSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-xs">
              {/* SECTION ALLOCATION DROPDOWN */}
              <div className="bg-[#EAF6F6] p-3.5 sm:p-4 rounded-2xl border border-[#109A9B]/30 space-y-2">
                <label className="block text-[#075D63] font-extrabold uppercase tracking-wider text-[10px] sm:text-[10.5px]">
                  📌 Allocate Question To Questionnaire Section
                </label>
                <select
                  value={newQuestionDraft.sectionId}
                  onChange={(e) => setNewQuestionDraft({ ...newQuestionDraft, sectionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#109A9B] outline-none font-bold text-xs bg-white text-[#063E46] cursor-pointer shadow-xs"
                  required
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      Section {sec.number}: {sec.title.replace(/^[^\w]+/, '').trim()} ({sec.questionRange})
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] sm:text-[11px] text-[#53656A] font-medium leading-relaxed">
                  Adding a question here will insert it into this section and automatically re-sequence all question numbers across Section 1 to Section 4.
                </p>
              </div>

              {/* Topic & Question Prompt Text */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[#53656A] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    Construct Topic / Category
                  </label>
                  <input
                    type="text"
                    value={newQuestionDraft.topic}
                    onChange={(e) => setNewQuestionDraft({ ...newQuestionDraft, topic: e.target.value })}
                    placeholder="e.g. Digital Habits, Career Aspirations..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#109A9B] outline-none font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#53656A] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    Question Prompt Text
                  </label>
                  <textarea
                    rows={3}
                    value={newQuestionDraft.text}
                    onChange={(e) => setNewQuestionDraft({ ...newQuestionDraft, text: e.target.value })}
                    placeholder="Enter the full question text that respondents will read..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#109A9B] outline-none font-semibold text-xs leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* ANSWER SELECTION MODE */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-[#10242C] text-xs flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#109A9B]" />
                    Question Selection Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      newQuestionDraft.selectionType !== 'multiple'
                        ? 'bg-emerald-50/80 border-[#075D63] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="draftSelectionType"
                      value="single"
                      checked={newQuestionDraft.selectionType !== 'multiple'}
                      onChange={() =>
                        setNewQuestionDraft({
                          ...newQuestionDraft,
                          selectionType: 'single',
                        })
                      }
                      className="mt-0.5 accent-[#075D63]"
                    />
                    <div>
                      <div className="font-bold text-[#10242C] text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Single Option
                      </div>
                      <p className="text-[10.5px] text-[#53656A] font-medium mt-0.5">
                        User picks 1 choice (Auto-advances)
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      newQuestionDraft.selectionType === 'multiple'
                        ? 'bg-purple-50/90 border-purple-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="draftSelectionType"
                      value="multiple"
                      checked={newQuestionDraft.selectionType === 'multiple'}
                      onChange={() =>
                        setNewQuestionDraft({
                          ...newQuestionDraft,
                          selectionType: 'multiple',
                        })
                      }
                      className="mt-0.5 accent-purple-700"
                    />
                    <div>
                      <div className="font-bold text-purple-950 text-xs flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-purple-700" />
                        Multiple Options
                      </div>
                      <p className="text-[10.5px] text-[#53656A] font-medium mt-0.5">
                        User selects multiple options
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* OPTIONS LIST EDITOR */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-[#10242C] text-xs">
                    Options List ({newQuestionDraft.options.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddDraftOption}
                    className="px-3 py-1.5 rounded-xl bg-[#EAF6F6] hover:bg-[#109A9B] text-[#075D63] hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer border border-[#109A9B]/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {newQuestionDraft.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200"
                    >
                      <span className="font-mono font-bold text-[#53656A] text-[10px] w-6 shrink-0 text-center">
                        #{idx + 1}
                      </span>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleDraftOptionChange(idx, 'label', e.target.value)}
                          placeholder="Option Label (e.g. Strongly Agree)"
                          className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none text-xs font-semibold"
                          required
                        />

                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => handleDraftOptionChange(idx, 'value', e.target.value)}
                          placeholder="Option Value (e.g. strongly_agree)"
                          className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-mono text-[11px] text-[#075D63]"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDraftOption(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#063E46] hover:bg-[#075D63] text-white font-sora font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 text-[#FDE7B5]" />
                  <span>Create & Sequence Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT & EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col transition-all">
            {/* Modal Header */}
            <div className="bg-[#EAF6F6] p-4 sm:p-5 border-b border-[#109A9B]/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#063E46] text-[#FFF8E8] flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                  {editingQuestion.code}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#10242C] truncate">
                    Inspect & Edit Question ({editingQuestion.code})
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#53656A] font-medium truncate">
                    Modify section allocation, prompt text, selection mode, and options
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveQuestion} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-xs">
              {/* SECTION ALLOCATION DROPDOWN */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-[#075D63] font-extrabold uppercase tracking-wider text-[10px]">
                  Section Allocation (Re-Assign Section)
                </label>
                <select
                  value={editingQuestion.sectionId || 'sec-1'}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, sectionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#109A9B] outline-none font-bold text-xs bg-white text-[#063E46] cursor-pointer"
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      Section {sec.number}: {sec.title.replace(/^[^\w]+/, '').trim()} ({sec.questionRange})
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] sm:text-[11px] text-[#53656A] leading-relaxed">
                  Changing section will re-locate this question and automatically re-sequence all question numbers across Section 1 to Section 4.
                </p>
              </div>

              {/* Question Code & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#53656A] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    Question Code / Display ID
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.code}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono font-bold text-xs cursor-not-allowed"
                    title="Question codes are auto-sequenced based on section allocation"
                  />
                </div>

                <div>
                  <label className="block text-[#53656A] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    Construct Topic / Category
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.topic}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#109A9B] outline-none font-bold text-xs"
                    required
                  />
                </div>
              </div>

              {/* Question Prompt Text */}
              <div>
                <label className="block text-[#53656A] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  Question Prompt Text
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#109A9B] outline-none font-semibold text-xs leading-relaxed"
                  required
                />
              </div>

              {/* ANSWER SELECTION MODE */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-[#10242C] text-xs flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#109A9B]" />
                    Question Selection Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      editingQuestion.selectionType !== 'multiple'
                        ? 'bg-emerald-50/80 border-[#075D63] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectionType"
                      value="single"
                      checked={editingQuestion.selectionType !== 'multiple'}
                      onChange={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          selectionType: 'single',
                          isMultiSelect: false,
                        })
                      }
                      className="mt-0.5 accent-[#075D63]"
                    />
                    <div>
                      <div className="font-bold text-[#10242C] text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Single Option (Auto-Advance)
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      editingQuestion.selectionType === 'multiple'
                        ? 'bg-purple-50/90 border-purple-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectionType"
                      value="multiple"
                      checked={editingQuestion.selectionType === 'multiple'}
                      onChange={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          selectionType: 'multiple',
                          isMultiSelect: true,
                        })
                      }
                      className="mt-0.5 accent-purple-700"
                    />
                    <div>
                      <div className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-purple-700" />
                        Multiple Options (Multi-Select)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* OPTIONS LIST EDITOR */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-[#10242C] text-xs">
                    Options List ({editingQuestion.options.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-3 py-1.5 rounded-xl bg-[#EAF6F6] hover:bg-[#109A9B] text-[#075D63] hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer border border-[#109A9B]/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {editingQuestion.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200"
                    >
                      <span className="font-mono font-bold text-[#53656A] text-[10px] w-6 shrink-0 text-center">
                        #{idx + 1}
                      </span>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleOptionChange(idx, 'label', e.target.value)}
                          placeholder="Option Label"
                          className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none text-xs font-semibold"
                          required
                        />

                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => handleOptionChange(idx, 'value', e.target.value)}
                          placeholder="Option Value"
                          className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-mono text-[11px] text-[#075D63]"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(editingQuestion.id, editingQuestion.code)}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-rose-200 cursor-pointer w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Question</span>
                </button>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#063E46] hover:bg-[#075D63] text-white font-sora font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 text-[#109A9B]" />
                    <span>Save & Re-Sequence</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <GridModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </AdminLayout>
  );
}
