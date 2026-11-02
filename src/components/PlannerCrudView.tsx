import React, { useState, useMemo } from 'react';
import { PlantRecord, PlantCategory, PlantStatus, WaterSchedule } from '../types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Sprout,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Droplets,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PlannerCrudViewProps {
  records: PlantRecord[];
  onAddRecord: (record: Omit<PlantRecord, 'id' | 'createdAt'>) => void;
  onUpdateRecord: (id: string, record: Partial<PlantRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onResetRecords: () => void;
}

export const PlannerCrudView: React.FC<PlannerCrudViewProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onResetRecords,
}) => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedBed, setSelectedBed] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'sowDate' | 'harvestDays'>('sowDate');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    category: 'Vegetables' as PlantCategory,
    bed: 'Bed 1 - Sunny',
    sowDate: new Date().toISOString().split('T')[0],
    harvestDays: 60,
    waterSchedule: 'Every 2-3 Days' as WaterSchedule,
    status: 'Sown' as PlantStatus,
    frostSensitive: true,
    notes: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open modal for Update (using JavaScript array .find() method)
  const handleOpenEdit = (id: string) => {
    // Array method .find() to locate specific record
    const targetRecord = records.find((item) => item.id === id);
    if (targetRecord) {
      setEditingId(id);
      setFormData({
        name: targetRecord.name,
        category: targetRecord.category,
        bed: targetRecord.bed,
        sowDate: targetRecord.sowDate,
        harvestDays: targetRecord.harvestDays,
        waterSchedule: targetRecord.waterSchedule,
        status: targetRecord.status,
        frostSensitive: targetRecord.frostSensitive,
        notes: targetRecord.notes,
      });
      setIsModalOpen(true);
    }
  };

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Array method .every() used for field validation check
    const requiredFields = [formData.name, formData.bed, formData.sowDate];
    const allFilled = requiredFields.every((field) => Boolean(field && field.trim().length > 0));

    if (!allFilled) {
      setFeedbackMsg({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    if (formData.harvestDays <= 0) {
      setFeedbackMsg({ type: 'error', text: 'Days to harvest must be greater than 0.' });
      return;
    }

    // Array method .some() used to verify no exact duplicate name exists in same bed
    const isDuplicate = records.some(
      (item) =>
        item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        item.bed === formData.bed &&
        item.id !== editingId
    );

    if (isDuplicate) {
      setFeedbackMsg({
        type: 'error',
        text: `A crop with the name "${formData.name}" already exists in ${formData.bed}.`,
      });
      return;
    }

    if (editingId) {
      // Update existing record
      onUpdateRecord(editingId, formData);
      setFeedbackMsg({ type: 'success', text: `Updated "${formData.name}" successfully!` });
    } else {
      // Create new record
      onAddRecord(formData);
      setFeedbackMsg({ type: 'success', text: `Added "${formData.name}" to ${formData.bed}!` });
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      const target = records.find((r) => r.id === deleteConfirmId);
      onDeleteRecord(deleteConfirmId);
      setFeedbackMsg({
        type: 'success',
        text: `Removed "${target?.name || 'plant'}" from your garden bed.`,
      });
      setDeleteConfirmId(null);
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  // Unique beds list using array .map() and Set
  const availableBeds = useMemo(() => {
    const beds = records.map((r) => r.bed);
    return ['All', ...Array.from(new Set(beds))];
  }, [records]);

  // Dynamic Search & Filter using JavaScript array .filter() and .sort()
  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => {
        // Search filter matching name, bed, or notes
        const matchesSearch =
          searchTerm.trim() === '' ||
          record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.notes.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = selectedCategory === 'All' || record.category === selectedCategory;

        // Status filter
        const matchesStatus = selectedStatus === 'All' || record.status === selectedStatus;

        // Bed filter
        const matchesBed = selectedBed === 'All' || record.bed === selectedBed;

        return matchesSearch && matchesCategory && matchesStatus && matchesBed;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'sowDate') return new Date(b.sowDate).getTime() - new Date(a.sowDate).getTime();
        if (sortBy === 'harvestDays') return a.harvestDays - b.harvestDays;
        return 0;
      });
  }, [records, searchTerm, selectedCategory, selectedStatus, selectedBed, sortBy]);

  // Statistics calculated using array methods
  const stats = useMemo(() => {
    const totalPlants = records.length;
    const readyToHarvest = records.filter((r) => r.status === 'Ready to Harvest').length;
    const growing = records.filter((r) => r.status === 'Growing' || r.status === 'Seedling').length;
    const frostSensitiveCount = records.filter((r) => r.frostSensitive).length;
    const uniqueBedsCount = new Set(records.map((r) => r.bed)).size;

    return { totalPlants, readyToHarvest, growing, frostSensitiveCount, uniqueBedsCount };
  }, [records]);

  // Helper for status badge styling
  const getStatusBadge = (status: PlantStatus) => {
    switch (status) {
      case 'Ready to Harvest':
        return 'bg-sun-400/20 text-sun-500 border border-sun-400/40 font-bold';
      case 'Growing':
        return 'bg-leaf-100 text-leaf-700 border border-leaf-200 font-semibold';
      case 'Seedling':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold';
      case 'Sown':
        return 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Assignment Header Banner */}
      <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sun-400 text-leaf-900 text-xs font-bold uppercase tracking-wider">
              Task 1 · CRUD & Local Storage
            </span>
            <span className="text-xs text-slate-500">Persisted in browser localStorage</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-leaf-900 mt-2">
            Garden Bed & Plant Records Planner
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Manage your garden crops dynamically: add new plants, edit schedules, filter by bed or growth stage, and delete completed harvests.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onResetRecords}
            title="Reset data to default example seeds"
            className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-lg bg-leaf-700 text-white hover:bg-leaf-600 transition text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Plant Record</span>
          </button>
        </div>
      </div>

      {/* Live Feedback Toast */}
      {feedbackMsg && (
        <div
          role="status"
          className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center justify-between shadow-xs transition animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-leaf-100 text-leaf-800 border border-leaf-500/30'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs underline ml-4 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Garden Overview Metric Cards (Calculated using array methods) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-leaf-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>TOTAL CROPS</span>
            <Sprout className="w-4 h-4 text-leaf-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-leaf-900">{stats.totalPlants}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {stats.uniqueBedsCount} garden beds</div>
        </div>

        <div className="bg-white border border-leaf-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>ACTIVE GROWING</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-700">{stats.growing}</div>
          <div className="text-[11px] text-slate-500 mt-1">Sown & seedling stages</div>
        </div>

        <div className="bg-white border border-leaf-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>READY TO HARVEST</span>
            <Sparkles className="w-4 h-4 text-sun-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-sun-500">{stats.readyToHarvest}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pick this week for fresh meals</div>
        </div>

        <div className="bg-white border border-leaf-100 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>FROST SENSITIVE</span>
            <AlertTriangle className="w-4 h-4 text-clay" />
          </div>
          <div className="font-display text-3xl font-extrabold text-clay">{stats.frostSensitiveCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Need cloche/fleece if &lt; 2°C</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-leaf-100 rounded-xl p-4 mb-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plant name, bed location, or notes…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 shrink-0 self-end md:self-auto bg-slate-50">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-leaf-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-leaf-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Sorting Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-sm">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium focus:border-leaf-500 outline-none bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Herbs">Herbs</option>
              <option value="Fruits">Fruits</option>
              <option value="Flowers">Flowers</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Growth Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium focus:border-leaf-500 outline-none bg-white"
            >
              <option value="All">All Stages</option>
              <option value="Sown">Sown</option>
              <option value="Seedling">Seedling</option>
              <option value="Growing">Growing</option>
              <option value="Ready to Harvest">Ready to Harvest</option>
            </select>
          </div>

          {/* Bed Location Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Garden Bed</label>
            <select
              value={selectedBed}
              onChange={(e) => setSelectedBed(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium focus:border-leaf-500 outline-none bg-white"
            >
              {availableBeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium focus:border-leaf-500 outline-none bg-white"
            >
              <option value="sowDate">Newest Sown First</option>
              <option value="name">Plant Name (A-Z)</option>
              <option value="harvestDays">Fastest Harvest Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter summary count */}
      <div className="flex items-center justify-between mb-4 text-xs font-medium text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of{' '}
          <strong className="text-slate-800">{records.length}</strong> crops
          {searchTerm && ` for "${searchTerm}"`}
        </span>
        {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedBed !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedBed('All');
            }}
            className="text-leaf-600 hover:underline cursor-pointer"
          >
            Reset active filters
          </button>
        )}
      </div>

      {/* Main Records Display (Read Operation) */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Sprout className="w-12 h-12 text-leaf-500/50 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-slate-800">No garden records found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or add a new plant to this garden bed.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-5 px-4 py-2 bg-leaf-700 text-white rounded-lg text-sm font-semibold hover:bg-leaf-600 cursor-pointer"
          >
            Add New Plant Record
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl border border-leaf-100 p-5 shadow-xs hover:border-leaf-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-leaf-50 text-leaf-700 border border-leaf-100">
                    {plant.category}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${getStatusBadge(plant.status)}`}>
                    {plant.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-leaf-900 mt-2.5 leading-snug">{plant.name}</h3>
                <p className="text-xs font-semibold text-leaf-600 flex items-center gap-1 mt-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{plant.bed}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sown: {plant.sowDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plant.harvestDays} days to harvest</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plant.waterSchedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${plant.frostSensitive ? 'text-clay' : 'text-slate-300'}`}
                    />
                    <span>{plant.frostSensitive ? 'Frost sensitive' : 'Cold hardy'}</span>
                  </div>
                </div>

                {plant.notes && (
                  <p className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    “{plant.notes}”
                  </p>
                )}
              </div>

              {/* Action buttons (Update & Delete) */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(plant.id)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-leaf-700 bg-leaf-50 hover:bg-leaf-100 transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(plant.id)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-leaf-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-leaf-50 text-leaf-900 font-display font-semibold text-xs uppercase tracking-wider border-b border-leaf-100">
                <tr>
                  <th className="p-4">Crop Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Bed</th>
                  <th className="p-4">Sow Date</th>
                  <th className="p-4">Days</th>
                  <th className="p-4">Watering</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((plant) => (
                  <tr key={plant.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-semibold text-leaf-900">
                      <div>{plant.name}</div>
                      {plant.frostSensitive && (
                        <span className="text-[10px] text-clay font-medium flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> Frost sensitive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                        {plant.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-leaf-700">{plant.bed}</td>
                    <td className="p-4 text-xs text-slate-500">{plant.sowDate}</td>
                    <td className="p-4 text-xs">{plant.harvestDays}d</td>
                    <td className="p-4 text-xs text-slate-500">{plant.waterSchedule}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${getStatusBadge(plant.status)}`}>
                        {plant.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(plant.id)}
                          className="p-1.5 rounded-md text-leaf-700 hover:bg-leaf-100 transition cursor-pointer"
                          title="Edit plant"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(plant.id)}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete plant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / UPDATE MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-leaf-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display text-2xl font-bold text-leaf-900">
                {editingId ? 'Edit Plant Record' : 'Add New Plant Record'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pname">
                  Crop / Plant Name *
                </label>
                <input
                  id="pname"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tomato (San Marzano Plum)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pcat">
                    Category *
                  </label>
                  <select
                    id="pcat"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PlantCategory })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 outline-none bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Flowers">Flowers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pbed">
                    Garden Bed *
                  </label>
                  <input
                    id="pbed"
                    type="text"
                    required
                    value={formData.bed}
                    onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                    placeholder="e.g. Bed 1 - Sunny"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="psow">
                    Sow / Plant Date *
                  </label>
                  <input
                    id="psow"
                    type="date"
                    required
                    value={formData.sowDate}
                    onChange={(e) => setFormData({ ...formData, sowDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="phdays">
                    Days to Harvest *
                  </label>
                  <input
                    id="phdays"
                    type="number"
                    min="5"
                    max="365"
                    required
                    value={formData.harvestDays}
                    onChange={(e) => setFormData({ ...formData, harvestDays: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pwater">
                    Water Schedule
                  </label>
                  <select
                    id="pwater"
                    value={formData.waterSchedule}
                    onChange={(e) => setFormData({ ...formData, waterSchedule: e.target.value as WaterSchedule })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 outline-none bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Every 2-3 Days">Every 2-3 Days</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pstatus">
                    Growth Stage
                  </label>
                  <select
                    id="pstatus"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PlantStatus })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 outline-none bg-white"
                  >
                    <option value="Sown">Sown</option>
                    <option value="Seedling">Seedling</option>
                    <option value="Growing">Growing</option>
                    <option value="Ready to Harvest">Ready to Harvest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.frostSensitive}
                    onChange={(e) => setFormData({ ...formData, frostSensitive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded-sm"
                  />
                  <span>Frost Sensitive (Triggers alert if weather dips below 2°C)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1" htmlFor="pnotes">
                  Notes & Companion Planting Tips
                </label>
                <textarea
                  id="pnotes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Great companion for basil; pinch suckers weekly."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-leaf-700 text-white hover:bg-leaf-600 transition text-sm font-bold cursor-pointer shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Delete Garden Record?</h3>
            <p className="text-slate-600 text-sm mt-2">
              Are you sure you want to remove this plant from your garden bed? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition cursor-pointer shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
