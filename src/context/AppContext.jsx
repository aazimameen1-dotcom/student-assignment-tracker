import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AppContext = createContext();

const DEFAULT_SUBJECTS = [
  { code: 'DIC107T', name: 'Web Design', desc: 'Master layout, typography, and wireframing.', color: 'purple' },
  { code: 'DIC102C', name: 'Python', desc: 'Build logic, syntax, and data structures.', color: 'blue' },
  { code: 'DIC105E', name: 'Disaster Management', desc: 'Risk assessment, emergency response planning.', color: 'amber' },
  { code: 'DIC110H', name: 'Global Literature', desc: 'Comparative narratives and literary analysis.', color: 'indigo' },
  { code: 'DIC102S', name: 'Physics', desc: 'Mechanics, thermodynamics, and electromagnetism.', color: 'slate' },
  { code: 'DIC103M', name: 'Mathematics', desc: 'Algebra, calculus, and statistics.', color: 'purple' }
];

const DEFAULT_TASKS = [
  {
    id: 'wd-p1',
    title: 'Hi-Fi Prototype Submission',
    subject: 'DIC107T',
    description: 'Design interactive high-fidelity wireframe prototype with intuitive user flows.',
    dueDate: '2024-10-14',
    dueTime: '11:59 PM',
    status: 'in-progress',
    category: 'This Week',
    timeLeft: '2 Days Left',
    progress: 67,
    professor: { name: 'Mr Salmaan Farooq', officeHours: 'Mon 2-4 PM' },
    milestones: [
      { id: 'm1', title: 'Design Thinking Brief', completed: true },
      { id: 'm2', title: 'Paper Wireframes', completed: true },
      { id: 'm3', title: 'Interactive Figma Prototype', completed: false }
    ],
    resources: [{ title: 'Wireframe Spec PDF', url: '#' }]
  },
  {
    id: 'py-p1',
    title: 'Data Structures Assignment',
    subject: 'DIC102C',
    description: 'Implement stack, queue, and binary search tree in Python with unit tests.',
    dueDate: '2024-10-18',
    dueTime: '5:00 PM',
    status: 'in-progress',
    category: 'This Week',
    timeLeft: '5 Days Left',
    progress: 50,
    professor: { name: 'Prof Asif Ali Banka', officeHours: 'Wed 10-12 AM' },
    milestones: [
      { id: 'm10', title: 'Stack & Queue Module', completed: true },
      { id: 'm11', title: 'Binary Tree Functions', completed: false }
    ],
    resources: [{ title: 'Python Documentation', url: '#' }]
  },
  {
    id: 'gl-p1',
    title: 'Comparative Essay Outline',
    subject: 'DIC110H',
    description: 'Analytical outline comparing narrative structures across modern literature.',
    dueDate: '2024-10-24',
    dueTime: '11:59 PM',
    status: 'in-progress',
    category: 'Next Week',
    timeLeft: 'Next Week',
    progress: 30,
    professor: { name: 'Dr Afshana Sultan', officeHours: 'Thu 1-3 PM' },
    milestones: [
      { id: 'm20', title: 'Thesis Statement', completed: true },
      { id: 'm21', title: 'Outline Draft', completed: false }
    ],
    resources: [{ title: 'Reading Guide', url: '#' }]
  },
  {
    id: 'dm-p1',
    title: 'Risk Assessment Report',
    subject: 'DIC105E',
    description: 'Community disaster preparedness study and emergency plan draft.',
    dueDate: '2024-11-02',
    dueTime: '11:59 PM',
    status: 'in-progress',
    category: 'Later',
    timeLeft: 'Later',
    progress: 10,
    professor: { name: 'Prof. Emergency Mgmt', officeHours: 'Tue 3-5 PM' },
    milestones: [
      { id: 'm30', title: 'Field Survey Notes', completed: false }
    ],
    resources: [{ title: 'Risk Guideline PDF', url: '#' }]
  }
];

export const AppContextProvider = ({ children }) => {
  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation & Routing state
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('web-design');
  const [selectedTaskId, setSelectedTaskId] = useState('wd-p1');
  const [selectedDate, setSelectedDate] = useState('2024-10-14'); // Oct 14, 2024

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

  // Subjects state initialized with default subjects
  const [enrolledSubjects, setEnrolledSubjects] = useState(DEFAULT_SUBJECTS);

  // Tasks state initialized with default tasks
  const [tasks, setTasks] = useState(DEFAULT_TASKS);

  // Helper to dynamically calculate current notifications based on tasks and deadlines
  const getNotifications = () => {
    if (!notificationsEnabled) return [];

    const list = [];
    const today = new Date('2024-10-12');

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
      } else if (diffDays === 1 || diffDays === 2) {
        list.push({
          id: `due-soon-${t.id}`,
          title: 'Due Soon',
          message: `Task "${t.title}" for ${t.subject} is due in ${diffDays} days.`,
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

    return list;
  };

  // Helper to fetch user data from Supabase
  const fetchUserData = async (userId) => {
    try {
      let { data: dbSubjects, error: subError } = await supabase
        .from('subjects')
        .select('*');

      let { data: dbTasks, error: taskError } = await supabase
        .from('tasks')
        .select('*');

      if (!subError && dbSubjects && dbSubjects.length > 0) {
        const mappedSubjects = dbSubjects.map(sub => ({
          code: sub.code,
          name: sub.name,
          desc: sub.desc || '',
          color: sub.color || 'blue'
        }));
        setEnrolledSubjects(mappedSubjects);
      }

      if (!taskError && dbTasks && dbTasks.length > 0) {
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
        setTasks(mappedTasks);
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
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
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
  }, [theme]);

  // Auth Methods
  const loginWithGoogle = () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const loginWithEmail = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = (email, password, metadata = {}) => {
    return supabase.auth.signUp({ email, password, options: { data: metadata } });
  };

  const loginAsGuest = () => {
    setUser({ id: 'guest-user', email: 'guest@assignify.app', user_metadata: { full_name: 'Guest Student' } });
  };

  const logout = () => {
    setUser(null);
    return supabase.auth.signOut();
  };

  const updateUserProfile = async (newMetadata) => {
    if (user) {
      try {
        await supabase.auth.updateUser({ data: newMetadata });
      } catch (err) {
        console.error(err);
      }
      setUser(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, ...newMetadata } } : prev);
    }
  };

  // Helper function to calculate a task's progress dynamically
  const calculateTaskProgress = (task) => {
    if (!task.milestones || task.milestones.length === 0) return 0;
    const completedCount = task.milestones.filter(m => m.completed).length;
    return Math.round((completedCount / task.milestones.length) * 100);
  };

  // Toggle milestone completion
  const updateTaskMilestone = async (taskId, milestoneId, completed) => {
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        const updatedMilestones = t.milestones.map(m => {
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

        if (user && user.id !== 'guest-user') {
          supabase.from('tasks').update({ milestones: updatedMilestones, status: newStatus }).eq('id', taskId).then();
        }

        return {
          ...t,
          milestones: updatedMilestones,
          progress: newProgress,
          status: newStatus
        };
      }
      return t;
    }));
  };

  // Add a new task
  const addTask = async (newTask) => {
    const defaultMilestones = [
      { id: 'm1', title: 'Initial Draft & Plan', completed: false },
      { id: 'm2', title: 'Core Implementation', completed: false },
      { id: 'm3', title: 'Review & Submission', completed: false }
    ];

    const milestones = newTask.milestones !== undefined && newTask.milestones.length > 0 ? newTask.milestones : defaultMilestones;
    const profName = (newTask.professor?.name || '').trim() || 'Faculty Instructor';
    const profHours = (newTask.professor?.officeHours || '').trim() || 'Mon/Wed 2-4 PM';

    const createdTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      subject: newTask.subject || enrolledSubjects[0]?.code || 'DIC107T',
      description: newTask.description || 'No description provided.',
      dueDate: newTask.dueDate || '2024-10-24',
      dueTime: newTask.dueTime || '11:59 PM',
      status: 'in-progress',
      category: newTask.category || 'This Week',
      timeLeft: newTask.timeLeft || 'Calculated',
      milestones,
      resources: [],
      professor: { name: profName, officeHours: profHours },
      progress: 0
    };

    if (user && user.id !== 'guest-user') {
      try {
        const { data, error } = await supabase.from('tasks').insert({
          title: createdTask.title,
          subject: createdTask.subject,
          description: createdTask.description,
          due_date: createdTask.dueDate,
          due_time: createdTask.dueTime,
          status: createdTask.status,
          category: createdTask.category,
          time_left: createdTask.timeLeft,
          milestones: createdTask.milestones,
          resources: createdTask.resources,
          professor: createdTask.professor,
          user_id: user.id
        }).select().single();

        if (!error && data) {
          createdTask.id = data.id;
        }
      } catch (err) {
        console.error("Supabase task add fallback to local:", err);
      }
    }

    setTasks(prev => [createdTask, ...prev]);
  };

  // Edit an existing task
  const editTask = async (taskId, updatedTask) => {
    const milestones = updatedTask.milestones || [];
    const progress = milestones.length > 0
      ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
      : 0;
    const status = progress === 100 ? 'completed' : 'in-progress';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          title: updatedTask.title,
          subject: updatedTask.subject,
          description: updatedTask.description || 'No description provided.',
          dueDate: updatedTask.dueDate || '2024-10-24',
          dueTime: updatedTask.dueTime || '11:59 PM',
          status,
          category: updatedTask.category || 'This Week',
          timeLeft: updatedTask.timeLeft || 'Calculated',
          milestones,
          professor: {
            name: (updatedTask.professor?.name || '').trim() || 'Faculty Instructor',
            officeHours: (updatedTask.professor?.officeHours || '').trim() || 'TBD'
          },
          progress
        };
      }
      return t;
    }));

    if (user && user.id !== 'guest-user') {
      try {
        await supabase.from('tasks').update({
          title: updatedTask.title,
          subject: updatedTask.subject,
          description: updatedTask.description,
          due_date: updatedTask.dueDate,
          due_time: updatedTask.dueTime,
          status,
          category: updatedTask.category,
          time_left: updatedTask.timeLeft,
          milestones
        }).eq('id', taskId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (user && user.id !== 'guest-user') {
      try {
        await supabase.from('tasks').delete().eq('id', taskId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Add a new subject
  const addSubject = async (newSub) => {
    const createdSub = {
      code: newSub.code,
      name: newSub.name,
      desc: newSub.desc || '',
      color: newSub.color || 'blue'
    };

    setEnrolledSubjects(prev => [...prev, createdSub]);

    if (user && user.id !== 'guest-user') {
      try {
        await supabase.from('subjects').insert({
          code: createdSub.code,
          name: createdSub.name,
          desc: createdSub.desc,
          color: createdSub.color,
          user_id: user.id
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Edit subject
  const editSubject = async (code, updatedSub) => {
    setEnrolledSubjects(prev => prev.map(s => s.code === code ? { ...s, ...updatedSub } : s));
    if (user && user.id !== 'guest-user') {
      try {
        await supabase.from('subjects').update(updatedSub).eq('code', code);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete subject
  const deleteSubject = async (code) => {
    setEnrolledSubjects(prev => prev.filter(s => s.code !== code));
    setTasks(prev => prev.filter(t => t.subject !== code));

    if (user && user.id !== 'guest-user') {
      try {
        await supabase.from('subjects').delete().eq('code', code);
        await supabase.from('tasks').delete().eq('subject', code);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Helper metrics for Subjects view
  const getSubjectMetrics = () => {
    return enrolledSubjects.map(sub => {
      const subTasks = tasks.filter(t => t.subject === sub.code);
      const completedCount = subTasks.filter(t => t.status === 'completed').length;
      const pendingCount = subTasks.length - completedCount;
      const progress = subTasks.length > 0 ? Math.round((completedCount / subTasks.length) * 100) : 0;
      return {
        ...sub,
        totalTasks: subTasks.length,
        completedCount,
        pendingCount,
        progress
      };
    });
  };

  // Calculate overall weekly velocity
  const getWeeklyVelocity = () => {
    const totalMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.length : 0), 0);
    const completedMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.filter(m => m.completed).length : 0), 0);
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 78;
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
      selectedSubjectKey,
      setSelectedSubjectKey,
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
