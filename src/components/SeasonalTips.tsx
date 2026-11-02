import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MonthlyGardenGuide } from '../types';
import { MONTHLY_GARDEN_GUIDES } from '../data/seasonalTipsData';
import {
  Calendar,
  Sparkles,
  Sprout,
  ShieldAlert,
  Droplets,
  Scissors,
  CheckCircle2,
  RefreshCw,
  Plus,
  Quote,
  Lightbulb,
} from 'lucide-react';

interface SeasonalTipsProps {
  onAddCustomTask?: (taskText: string) => void;
  onNavigateToPlanner?: () => void;
  compact?: boolean;
}

export const SeasonalTips: React.FC<SeasonalTipsProps> = ({
  onAddCustomTask,
  onNavigateToPlanner,
  compact = false,
}) => {
  // Current calendar month (0 = Jan, 10 = Nov, 11 = Dec)
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // External live botanical quote/advice state via Axios
  const [externalTip, setExternalTip] = useState<{ advice: string; source: string } | null>(null);
  const [isFetchingExternal, setIsFetchingExternal] = useState(false);
  const [addedTaskNotice, setAddedTaskNotice] = useState<string | null>(null);

  // Fetch a live tip/advice using Axios GET
  const fetchLiveAdvice = async () => {
    setIsFetchingExternal(true);
    try {
      const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 4000 });
      if (res.data?.slip?.advice) {
        setExternalTip({
          advice: res.data.slip.advice,
          source: 'Live Advice API · Public Endpoint',
        });
      }
    } catch {
      // Fallback advice if network request has latency
      setExternalTip({
        advice: 'Rotate your brassicas and alliums every season to disrupt soil-borne pathogens naturally.',
        source: 'Seedling Botanical Wisdom',
      });
    } finally {
      setIsFetchingExternal(false);
    }
  };

  useEffect(() => {
    fetchLiveAdvice();
  }, []);

  // Current active monthly guide
  const guide: MonthlyGardenGuide = useMemo(() => {
    return MONTHLY_GARDEN_GUIDES[selectedMonth] || MONTHLY_GARDEN_GUIDES[10];
  }, [selectedMonth]);

  // Filtered tips
  const filteredTips = useMemo(() => {
    if (selectedCategory === 'All') return guide.tips;
    return guide.tips.filter((t) => t.category === selectedCategory);
  }, [guide, selectedCategory]);

  const handleAddAsTask = (tipTitle: string) => {
    if (onAddCustomTask) {
      onAddCustomTask(`${guide.monthName}: ${tipTitle}`);
      setAddedTaskNotice(`Added "${tipTitle}" to this week's checklist!`);
      setTimeout(() => setAddedTaskNotice(null), 3000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sow & Plant':
        return <Sprout className="w-4 h-4 text-leaf-600" />;
      case 'Care & Water':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'Frost Protection':
        return <ShieldAlert className="w-4 h-4 text-clay" />;
      case 'Harvest':
        return <Scissors className="w-4 h-4 text-sun-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Sow & Plant':
        return 'bg-leaf-50 text-leaf-700 border border-leaf-200';
      case 'Care & Water':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Frost Protection':
        return 'bg-amber-50 text-clay border border-amber-200';
      case 'Harvest':
        return 'bg-sun-400/20 text-sun-500 border border-sun-400/40 font-bold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section className="w-full">
      {/* Header Banner */}
      <div className="bg-leaf-50 border border-leaf-100 rounded-3xl p-6 sm:p-8 mb-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sun-400 text-leaf-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seasonal Growing Almanac</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {guide.season} · {guide.monthName}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-leaf-900 mt-2">
              What to Do in the Garden this {guide.monthName}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">{guide.summary}</p>
          </div>

          {/* Quick jump to current month button */}
          {selectedMonth !== currentMonthIndex && (
            <button
              onClick={() => setSelectedMonth(currentMonthIndex)}
              className="px-3.5 py-2 rounded-lg bg-white border border-leaf-200 text-leaf-700 hover:bg-leaf-100 text-xs font-bold transition flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Back to Current Month ({MONTHLY_GARDEN_GUIDES[currentMonthIndex].monthName})</span>
            </button>
          )}
        </div>

        {/* Ideal Sow Pill Tags for the active month */}
        <div className="mt-5 pt-4 border-t border-leaf-200/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-leaf-900 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-leaf-600" />
            <span>Top crops to sow in {guide.monthName}:</span>
          </span>
          {guide.idealSow.map((crop) => (
            <span
              key={crop}
              className="px-2.5 py-1 rounded-full bg-white border border-leaf-200 text-leaf-800 font-semibold shadow-2xs"
            >
              {crop}
            </span>
          ))}
          {onNavigateToPlanner && (
            <button
              onClick={onNavigateToPlanner}
              className="ml-auto text-xs font-bold text-leaf-700 hover:text-leaf-800 underline cursor-pointer"
            >
              Add to Bed Layout &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Month Navigator Tabs */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-1.5 min-w-max p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
          {MONTHLY_GARDEN_GUIDES.map((m) => {
            const isSelected = selectedMonth === m.monthIndex;
            const isCurrent = currentMonthIndex === m.monthIndex;

            return (
              <button
                key={m.monthName}
                onClick={() => setSelectedMonth(m.monthIndex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-leaf-700 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-sun-400/30 text-leaf-900 font-extrabold hover:bg-sun-400/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{m.monthName.slice(0, 3)}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sun-500 shrink-0" title="Current Month" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notice when task added */}
      {addedTaskNotice && (
        <div className="mb-4 p-3 rounded-xl bg-leaf-100 border border-leaf-300 text-leaf-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-leaf-600" />
          <span>{addedTaskNotice}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {['All', 'Sow & Plant', 'Care & Water', 'Frost Protection', 'Harvest'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-leaf-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live API advice refresh button */}
        <button
          onClick={fetchLiveAdvice}
          disabled={isFetchingExternal}
          title="Fetch live gardener quote via Axios"
          className="text-xs text-leaf-700 hover:text-leaf-800 flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetchingExternal ? 'animate-spin' : ''}`} />
          <span>Fetch Live Tip</span>
        </button>
      </div>

      {/* Live Axios External Tip Card */}
      {externalTip && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-sun-400/30 flex items-start gap-3 shadow-2xs">
          <Quote className="w-5 h-5 text-sun-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-slate-800 font-medium italic">“{externalTip.advice}”</p>
            <p className="text-[11px] text-clay font-bold mt-1 uppercase tracking-wider">{externalTip.source}</p>
          </div>
        </div>
      )}

      {/* Tips Cards Grid */}
      <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between ${
              tip.highlight
                ? 'border-leaf-500 shadow-sm ring-1 ring-leaf-100'
                : 'border-leaf-100 hover:border-leaf-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${getCategoryBadgeClass(tip.category)}`}>
                  {getCategoryIcon(tip.category)}
                  <span>{tip.category}</span>
                </span>
                {tip.highlight && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sun-400 text-leaf-900">
                    High Priority
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-base text-leaf-900 mt-3 leading-snug">
                {tip.title}
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                {tip.description}
              </p>
            </div>

            {/* Action footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">{guide.monthName} chore</span>
              {onAddCustomTask && (
                <button
                  onClick={() => handleAddAsTask(tip.title)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-leaf-50 hover:bg-leaf-100 text-leaf-700 transition flex items-center gap-1 cursor-pointer"
                  title="Add to weekly checklist"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Checklist</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
