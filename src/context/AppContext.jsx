import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation & Routing state
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState('econ-302');
  const [selectedDate, setSelectedDate] = useState('2024-10-12'); // Oct 12, 2024 to match mockup default

  // Appearance & Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') !== 'false'
  );
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
    } catch {
      return [];
    }
  });

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('notificationsEnabled', String(next));
      return next;
    });
  };

  const markNotificationAsRead = (id) => {
    setReadNotificationIds(prev => {
      const next = [...new Set([...prev, id])];
      localStorage.setItem('readNotificationIds', JSON.stringify(next));
      return next;
    });
  };

  const markAllNotificationsAsRead = (ids) => {
    setReadNotificationIds(prev => {
      const next = [...new Set([...prev, ...ids])];
      localStorage.setItem('readNotificationIds', JSON.stringify(next));
      return next;
    });
  };

  const clearReadNotifications = () => {
    setReadNotificationIds([]);
    localStorage.removeItem('readNotificationIds');
  };

  // Helper to dynamically calculate current notifications based on tasks and deadlines
  const getNotifications = () => {
    if (!notificationsEnabled) return [];

    const list = [];
    const today = new Date('2024-10-12'); // set static mock current date matching mockup calendar select default

    tasks.forEach(t => {
      if (t.status === 'completed') return;

      const dateObj = new Date(t.dueDate);
      const diffTime = dateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        list.push({
          id: `due-today-${t.id}`,
          title: 'Due Today',
          message: `Task "${t.title}" for ${t.subject} is due today!`,
          type: 'warning',
          taskId: t.id
        });
      } else if (diffDays === 1) {
        list.push({
          id: `due-tomorrow-${t.id}`,
          title: 'Due Tomorrow',
          message: `Task "${t.title}" for ${t.subject} is due tomorrow.`,
          type: 'info',
          taskId: t.id
        });
      } else if (diffDays < 0) {
        list.push({
          id: `overdue-${t.id}`,
          title: 'Overdue Assignment',
          message: `Task "${t.title}" for ${t.subject} is overdue!`,
          type: 'error',
          taskId: t.id
        });
      }
    });

    if (enrolledSubjects.length === 0) {
      list.push({
        id: 'welcome-no-subjects',
        title: 'Get Started',
        message: 'Add a new subject in Subject Mastery to start tracking assignments.',
        type: 'info'
      });
    }

    return list;
  };

  // Helper to fetch user data from Supabase
  const fetchUserData = async (userId) => {
    try {
      let { data: dbSubjects, error: subError } = await supabase
        .from('subjects')
        .select('*');

      if (subError) throw subError;

      let { data: dbTasks, error: taskError } = await supabase
        .from('tasks')
        .select('*');

      if (taskError) throw taskError;

      // No seeding - database starts empty

      const mappedSubjects = dbSubjects.map(sub => ({
        code: sub.code,
        name: sub.name,
        desc: sub.desc || '',
        color: sub.color || 'blue'
      }));

      const mappedTasks = dbTasks.map(task => {
        const progress = task.milestones && task.milestones.length > 0
          ? Math.round((task.milestones.filter(m => m.completed).length / task.milestones.length) * 100)
          : 0;
        return {
          id: task.id,
          title: task.title,
          subject: task.subject,
          description: task.description || '',
          dueDate: task.due_date,
          dueTime: task.due_time,
          status: task.status,
          category: task.category,
          timeLeft: task.time_left,
          milestones: task.milestones || [],
          resources: task.resources || [],
          professor: task.professor || {},
          progress
        };
      });

      setEnrolledSubjects(mappedSubjects);
      setTasks(mappedTasks);

      if (mappedTasks.length > 0) {
        const econTask = mappedTasks.find(t => t.subject === 'ECON 302');
        setSelectedTaskId(econTask ? econTask.id : mappedTasks[0].id);
      }
    } catch (err) {
      console.error("Error loading user data from Supabase:", err);
    }
  };

  // Listen for authentication state changes on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setEnrolledSubjects([]);
        setTasks([]);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setEnrolledSubjects([]);
        setTasks([]);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme application effect
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        // System theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Supabase Auth Methods
  const loginWithGoogle = () => {
    return supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const loginWithEmail = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = (email, password) => {
    return supabase.auth.signUp({ email, password });
  };

  const loginAsGuest = () => {
    return supabase.auth.signInAnonymously();
  };

  const logout = () => {
    return supabase.auth.signOut();
  };

  // Subjects state - starts empty
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);

  // Tasks state - starts empty
  const [tasks, setTasks] = useState([]);

  // Helper function to calculate a task's progress dynamically
  const calculateTaskProgress = (task) => {
    if (!task.milestones || task.milestones.length === 0) return 0;
    const completedCount = task.milestones.filter(m => m.completed).length;
    return Math.round((completedCount / task.milestones.length) * 100);
  };

  // Toggle milestone completion
  const updateTaskMilestone = async (taskId, milestoneId, completed) => {
    if (!user) return;
    
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedMilestones = taskToUpdate.milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          completed,
          completedDate: completed ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined
        };
      }
      return m;
    });

    const newProgress = Math.round((updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100);
    const newStatus = newProgress === 100 ? 'completed' : 'in-progress';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          milestones: updatedMilestones,
          status: newStatus
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            milestones: updatedMilestones,
            progress: newProgress,
            status: newStatus
          };
        }
        return t;
      }));
    } catch (err) {
      console.error("Error updating milestone:", err);
    }
  };

  // Add a new task
  const addTask = async (newTask) => {
    if (!user) return;
    
    const defaultMilestones = [
      { id: 'm1', title: 'Initial Draft & Plan', completed: false },
      { id: 'm2', title: 'Core Implementation', completed: false },
      { id: 'm3', title: 'Review & Submission', completed: false }
    ];

    const milestones = newTask.milestones !== undefined ? newTask.milestones : defaultMilestones;
    const profName = (newTask.professor?.name || '').trim() || 'TBD';
    const profHours = (newTask.professor?.officeHours || '').trim() || 'TBD';
    
    const taskData = {
      title: newTask.title,
      subject: newTask.subject,
      description: newTask.description || 'No description provided.',
      due_date: newTask.dueDate || '2024-10-24',
      due_time: newTask.dueTime || '11:59 PM',
      status: 'in-progress',
      category: newTask.category || 'This Week',
      time_left: newTask.timeLeft || 'Calculated',
      milestones: milestones,
      resources: [],
      professor: {
        name: profName,
        officeHours: profHours
      },
      user_id: user.id
    };

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;

      const mappedTask = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        description: data.description,
        dueDate: data.due_date,
        dueTime: data.due_time,
        status: data.status,
        category: data.category,
        timeLeft: data.time_left,
        milestones: data.milestones,
        resources: data.resources,
        professor: data.professor,
        progress: 0
      };
      
      setTasks(prev => [mappedTask, ...prev]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Edit an existing task
  const editTask = async (taskId, updatedTask) => {
    if (!user) return;

    const milestones = updatedTask.milestones || [];
    const progress = milestones.length > 0
      ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
      : 0;
    const status = progress === 100 ? 'completed' : 'in-progress';

    const taskData = {
      title: updatedTask.title,
      subject: updatedTask.subject,
      description: updatedTask.description || 'No description provided.',
      due_date: updatedTask.dueDate || '2024-10-24',
      due_time: updatedTask.dueTime || '11:59 PM',
      status: status,
      category: updatedTask.category || 'This Week',
      time_left: updatedTask.timeLeft || 'Calculated',
      milestones: milestones,
      professor: {
        name: (updatedTask.professor?.name || '').trim() || 'TBD',
        officeHours: (updatedTask.professor?.officeHours || '').trim() || 'TBD'
      }
    };

    try {
      const { error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            title: taskData.title,
            subject: taskData.subject,
            description: taskData.description,
            dueDate: taskData.due_date,
            dueTime: taskData.due_time,
            status: taskData.status,
            category: taskData.category,
            timeLeft: taskData.time_left,
            milestones: taskData.milestones,
            professor: taskData.professor,
            progress: progress
          };
        }
        return t;
      }));
    } catch (err) {
      console.error("Error editing task:", err);
      throw err;
    }
  };

  // Add a new subject
  const addSubject = async (newSub) => {
    if (!user) return;
    const subjectData = {
      code: newSub.code,
      name: newSub.name,
      desc: newSub.desc || '',
      color: newSub.color || 'blue',
      user_id: user.id
    };

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();

      if (error) throw error;

      setEnrolledSubjects(prev => [
        ...prev,
        {
          code: data.code,
          name: data.name,
          desc: data.desc || '',
          color: data.color || 'blue'
        }
      ]);
    } catch (err) {
      console.error("Error adding subject:", err);
    }
  };

  // Edit an existing subject
  const editSubject = async (subjectCode, updatedSub) => {
    if (!user) return;
    const subjectData = {
      name: updatedSub.name,
      desc: updatedSub.desc || '',
      color: updatedSub.color || 'blue'
    };

    try {
      const { error } = await supabase
        .from('subjects')
        .update(subjectData)
        .eq('code', subjectCode)
        .eq('user_id', user.id);

      if (error) throw error;

      setEnrolledSubjects(prev => prev.map(sub => {
        if (sub.code === subjectCode) {
          return {
            ...sub,
            name: subjectData.name,
            desc: subjectData.desc,
            color: subjectData.color
          };
        }
        return sub;
      }));
    } catch (err) {
      console.error("Error editing subject:", err);
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Delete a subject and its associated tasks
  const deleteSubject = async (subjectCode) => {
    if (!user) return;
    try {
      // 1. Delete tasks for this subject
      const { error: taskDeleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('subject', subjectCode);
      
      if (taskDeleteError) throw taskDeleteError;

      // 2. Delete subject
      const { error: subDeleteError } = await supabase
        .from('subjects')
        .delete()
        .eq('code', subjectCode);

      if (subDeleteError) throw subDeleteError;

      setEnrolledSubjects(prev => prev.filter(sub => sub.code !== subjectCode));
      setTasks(prev => prev.filter(t => t.subject !== subjectCode));
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  // Update user profile metadata (e.g., full_name)
  const updateUserProfile = async (metadataUpdates) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadataUpdates
      });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Error updating user metadata:", err);
      throw err;
    }
  };

  // Dynamically compute subjects progress and pending counts from tasks list
  const getSubjectMetrics = () => {
    return enrolledSubjects.map(sub => {
      const subjectTasks = tasks.filter(t => t.subject === sub.code);
      const pendingTasks = subjectTasks.filter(t => t.status !== 'completed');
      
      // Calculate average progress
      let avgProgress = 0;
      if (subjectTasks.length > 0) {
        const totalProgress = subjectTasks.reduce((sum, t) => {
          const progress = calculateTaskProgress(t);
          return sum + progress;
        }, 0);
        avgProgress = Math.round(totalProgress / subjectTasks.length);
      }

      const pendingCount = pendingTasks.length;

      return {
        ...sub,
        pendingCount,
        progress: avgProgress
      };
    });
  };

  // Helper to calculate overall completion velocity
  const getWeeklyVelocity = () => {
    const totalMilestones = tasks.reduce((sum, t) => sum + t.milestones.length, 0);
    const completedMilestones = tasks.reduce((sum, t) => sum + t.milestones.filter(m => m.completed).length, 0);
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      loginWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      loginAsGuest,
      logout,
      theme,
      setTheme,
      currentView,
      setCurrentView,
      selectedTaskId,
      setSelectedTaskId,
      selectedDate,
      setSelectedDate,
      tasks,
      setTasks,
      addTask,
      editTask,
      updateTaskMilestone,
      deleteTask,
      deleteSubject,
      updateUserProfile,
      enrolledSubjects,
      addSubject,
      editSubject,
      subjects: getSubjectMetrics(),
      weeklyVelocity: getWeeklyVelocity(),
      calculateTaskProgress,
      notificationsEnabled,
      toggleNotifications,
      readNotificationIds,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearReadNotifications,
      notifications: getNotifications()
    }}>
      {children}
    </AppContext.Provider>
  );
};
