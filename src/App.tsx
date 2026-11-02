import React, { useState, useEffect } from 'react';
import { PageView, PlantRecord, WeeklyTask } from './types';
import { INITIAL_PLANTS, INITIAL_TASKS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PlannerCrudView } from './components/PlannerCrudView';
import { WeatherApiView } from './components/WeatherApiView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { SignInView } from './components/SignInView';
import { SignUpView } from './components/SignUpView';
import { SeasonalTips } from './components/SeasonalTips';

const LOCAL_STORAGE_PLANTS_KEY = 'seedling_garden_records';
const LOCAL_STORAGE_TASKS_KEY = 'seedling_weekly_tasks';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Task 1 Local Storage: Initialize garden records from localStorage or initial seed
  const [plantRecords, setPlantRecords] = useState<PlantRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading plant records from Local Storage', e);
    }
    return INITIAL_PLANTS;
  });

  // Local Storage for weekly checklist
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading weekly tasks from Local Storage', e);
    }
    return INITIAL_TASKS;
  });

  // Persist plant records whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(plantRecords));
    } catch (e) {
      console.error('Error writing plant records to Local Storage', e);
    }
  }, [plantRecords]);

  // Persist weekly tasks whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(weeklyTasks));
    } catch (e) {
      console.error('Error writing weekly tasks to Local Storage', e);
    }
  }, [weeklyTasks]);

  // CRUD Handler 1: Create Record
  const handleAddPlant = (newRecord: Omit<PlantRecord, 'id' | 'createdAt'>) => {
    const record: PlantRecord = {
      ...newRecord,
      id: `plant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setPlantRecords((prev) => [record, ...prev]);
  };

  // CRUD Handler 2: Update Record (using Array .map())
  const handleUpdatePlant = (id: string, updatedFields: Partial<PlantRecord>) => {
    setPlantRecords((prev) =>
      prev.map((plant) => (plant.id === id ? { ...plant, ...updatedFields } : plant))
    );
  };

  // CRUD Handler 3: Delete Record (using Array .filter())
  const handleDeletePlant = (id: string) => {
    setPlantRecords((prev) => prev.filter((plant) => plant.id !== id));
  };

  // Reset to demo initial data
  const handleResetPlants = () => {
    setPlantRecords(INITIAL_PLANTS);
    try {
      localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(INITIAL_PLANTS));
    } catch (e) {
      console.error(e);
    }
  };

  // Weekly tasks handlers
  const handleToggleTask = (id: string) => {
    setWeeklyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (text: string) => {
    const newTask: WeeklyTask = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
    };
    setWeeklyTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-700 antialiased">
      {/* Top Navigation */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Page Content */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={setCurrentPage}
            weeklyTasks={weeklyTasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        )}

        {currentPage === 'planner' && (
          <PlannerCrudView
            records={plantRecords}
            onAddRecord={handleAddPlant}
            onUpdateRecord={handleUpdatePlant}
            onDeleteRecord={handleDeletePlant}
            onResetRecords={handleResetPlants}
          />
        )}

        {currentPage === 'weather' && <WeatherApiView />}

        {currentPage === 'tips' && (
          <main className="max-w-6xl mx-auto px-4 py-8">
            <SeasonalTips
              onAddCustomTask={handleAddTask}
              onNavigateToPlanner={() => setCurrentPage('planner')}
            />
          </main>
        )}

        {currentPage === 'about' && <AboutView onNavigate={setCurrentPage} />}

        {currentPage === 'contact' && <ContactView onNavigate={setCurrentPage} />}

        {currentPage === 'signin' && <SignInView onNavigate={setCurrentPage} />}

        {currentPage === 'signup' && <SignUpView onNavigate={setCurrentPage} />}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
