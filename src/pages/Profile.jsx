import { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';

// Modern clean avatar presets
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
];

export default function Profile() {
  const { user, updateUserProfile, setCurrentView, enrolledSubjects = [], tasks = [] } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form State initialized from user metadata or local storage
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || 'Alex Morgan');
  const [studentId, setStudentId] = useState(user?.user_metadata?.student_id || 'STU-2026-9041');
  const [institution, setInstitution] = useState(user?.user_metadata?.institution || 'Faculty of Computer Science & Design');
  const [degree, setDegree] = useState(user?.user_metadata?.degree || 'B.S. in Software Systems & UI/UX');
  const [semester, setSemester] = useState(user?.user_metadata?.semester || 'Semester 4 (Spring 2026)');
  const [bio, setBio] = useState(user?.user_metadata?.bio || 'Focused on human-computer interaction, distributed systems, and modern web architecture. Currently maintaining high academic standing while researching intelligent workflows.');
  const [email] = useState(user?.email || 'alex.morgan@university.edu');
  const [contactEmail, setContactEmail] = useState(user?.user_metadata?.contact_email || user?.email || 'alex.morgan@university.edu');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '+1 (555) 234-5678');
  const [githubUrl, setGithubUrl] = useState(user?.user_metadata?.github_url || 'https://github.com/scholar-student');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.user_metadata?.linkedin_url || 'https://linkedin.com/in/scholar');
  const [targetGpa, setTargetGpa] = useState(user?.user_metadata?.target_gpa || '3.90');
  
  const initialAvatar = localStorage.getItem('user_avatar') || 
    user?.user_metadata?.custom_avatar_url || 
    user?.user_metadata?.avatar_url || 
    AVATAR_PRESETS[0];

  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  // Helper to compress and convert uploaded image into high-quality square avatar
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 320;
          let width = image.width;
          let height = image.height;

          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressedDataUrl);
        };
        image.onerror = reject;
        image.src = readerEvent.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle direct file upload from computer/device
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please select a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const optimizedAvatar = await processImageFile(file);
      
      setAvatarUrl(optimizedAvatar);
      localStorage.setItem('user_avatar', optimizedAvatar);

      if (updateUserProfile) {
        await updateUserProfile({
          custom_avatar_url: optimizedAvatar,
          avatar_url: optimizedAvatar
        });
      }

      setSaveSuccess('Profile picture uploaded and saved successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to process image. Please try another file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle preset avatar selection
  const handleSelectPreset = async (presetUrl) => {
    setAvatarUrl(presetUrl);
    localStorage.setItem('user_avatar', presetUrl);
    if (updateUserProfile) {
      await updateUserProfile({
        custom_avatar_url: presetUrl,
        avatar_url: presetUrl
      });
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: name.trim(),
          name: name.trim(),
          student_id: studentId.trim(),
          institution: institution.trim(),
          degree: degree.trim(),
          semester: semester.trim(),
          bio: bio.trim(),
          contact_email: contactEmail.trim(),
          phone: phone.trim(),
          custom_avatar_url: avatarUrl,
          avatar_url: avatarUrl,
          github_url: githubUrl.trim(),
          linkedin_url: linkedinUrl.trim(),
          target_gpa: targetGpa.trim()
        });
      }
      localStorage.setItem('user_avatar', avatarUrl);
      setIsEditing(false);
      setSaveSuccess('Profile details and credentials successfully updated!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Error updating profile information.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-32">
      
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl font-mono text-xs flex items-center gap-2 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Top Banner & Profile Header */}
      <div className="app-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with live upload badge */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 flex-shrink-0">
                <img 
                  src={avatarUrl} 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <label 
                htmlFor="avatar-upload-input"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors cursor-pointer"
                title="Upload custom profile photo"
              >
                <span className="material-symbols-outlined text-sm">
                  {isUploading ? 'sync' : 'photo_camera'}
                </span>
              </label>
              
              <input 
                ref={fileInputRef}
                id="avatar-upload-input"
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {name}
                </h1>
                <span className="app-badge app-badge-blue">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>{studentId}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">{degree}</p>
              <p className="text-xs text-slate-500 font-mono">{institution} • {semester}</p>
            </div>
          </div>

          {/* Action Trigger */}
          <div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "app-btn-secondary text-xs" : "app-btn-primary text-xs"}
            >
              <span className="material-symbols-outlined text-sm">
                {isEditing ? 'close' : 'edit'}
              </span>
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile & Credentials'}</span>
            </button>
          </div>

        </div>

        {/* Quick Avatar Presets Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Avatar Presets:</span>
            <div className="flex items-center gap-2">
              {AVATAR_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    avatarUrl === preset ? 'border-blue-600 scale-110 shadow-sm' : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <label 
            htmlFor="avatar-upload-input" 
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            <span>Upload custom photo</span>
          </label>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="app-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Academic Standing</span>
          <span className="font-heading text-xl font-bold text-slate-900">Dean's List</span>
          <span className="text-[10px] font-mono text-emerald-600 block">Top 5% Percentile</span>
        </div>

        <div className="app-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Target GPA</span>
          <span className="font-heading text-xl font-bold text-slate-900">{targetGpa}</span>
          <span className="text-[10px] font-mono text-blue-600 block">Cumulative Target</span>
        </div>

        <div className="app-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Active Courses</span>
          <span className="font-heading text-xl font-bold text-slate-900">{enrolledSubjects.length} Modules</span>
          <span className="text-[10px] font-mono text-slate-500 block">18 Credit Units</span>
        </div>

        <div className="app-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Completed Tasks</span>
          <span className="font-heading text-xl font-bold text-slate-900">{completedTasks}</span>
          <span className="text-[10px] font-mono text-emerald-600 block">{tasks.length} Total Deliverables</span>
        </div>
      </div>

      {/* EDIT MODE: FULL PROFILE & CREDENTIALS WORKSPACE */}
      {isEditing ? (
        <form onSubmit={handleSave} className="app-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">Edit Scholar Profile & Credentials</h2>
              <p className="text-xs text-slate-500">Update academic registration, personal statement, contact information, and portfolio handles.</p>
            </div>
            <span className="app-badge app-badge-amber">Editing Active</span>
          </div>

          {/* Section 1: Academic Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              1. Academic Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal / Display Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll Number *</label>
                <input 
                  type="text" 
                  value={studentId} 
                  onChange={(e) => setStudentId(e.target.value)} 
                  required
                  placeholder="e.g. STU-2026-9041"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Major *</label>
                <input 
                  type="text" 
                  value={degree} 
                  onChange={(e) => setDegree(e.target.value)} 
                  required
                  placeholder="e.g. B.S. in Software Systems & UI/UX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty / Institution</label>
                <input 
                  type="text" 
                  value={institution} 
                  onChange={(e) => setInstitution(e.target.value)} 
                  placeholder="e.g. Faculty of Computer Science & Design"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Term / Semester</label>
                <input 
                  type="text" 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)} 
                  placeholder="e.g. Semester 4 (Spring 2026)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target GPA</label>
                <input 
                  type="text" 
                  value={targetGpa} 
                  onChange={(e) => setTargetGpa(e.target.value)} 
                  placeholder="e.g. 3.90"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Web Credentials */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              2. Contact & Digital Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                  placeholder="e.g. alex.morgan@university.edu"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Code Repository URL</label>
                <input 
                  type="text" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                  placeholder="e.g. https://github.com/alexmorgan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn / Academic Portfolio URL</label>
                <input 
                  type="text" 
                  value={linkedinUrl} 
                  onChange={(e) => setLinkedinUrl(e.target.value)} 
                  placeholder="e.g. https://linkedin.com/in/alexmorgan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Statement & Research Statement */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
              3. Academic Statement & Bio
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Research Statement & Academic Focus</label>
              <textarea 
                rows={4} 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Describe your academic background, research interests, and project specializations..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="app-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="app-btn-primary text-xs"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Profile & Credentials</span>
            </button>
          </div>
        </form>
      ) : (
        /* VIEW MODE: DETAILS & CONTACT CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Academic Bio & Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            <div className="app-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-sm font-bold text-slate-900">Academic Summary & Research Statement</h3>
                <span className="text-slate-400 text-xs font-mono">Overview</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>

            {/* Enrolled Courses */}
            <div className="app-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-sm font-bold text-slate-900">Current Semester Curriculum</h3>
                <button 
                  type="button"
                  onClick={() => setCurrentView('subjects')} 
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Manage Courses →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledSubjects.map((sub) => (
                  <div key={sub.code} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500">{sub.code}</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{sub.name}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                      3 CR
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Contact & Digital Credentials Card */}
          <div className="space-y-6">
            <div className="app-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Contact & Credentials
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Primary Email</span>
                  <p className="font-medium text-slate-900 mt-0.5">{contactEmail || email}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Phone Number</span>
                  <p className="font-medium text-slate-900 mt-0.5">{phone || 'Not provided'}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">GitHub / Code Portfolio</span>
                  {githubUrl ? (
                    <a 
                      href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium text-blue-600 hover:underline mt-0.5 block truncate flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">link</span>
                      <span>{githubUrl}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not set</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">LinkedIn / Profile</span>
                  {linkedinUrl ? (
                    <a 
                      href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium text-blue-600 hover:underline mt-0.5 block truncate flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                      <span>{linkedinUrl}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not set</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block mb-1.5">Scholar Verification</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                    <span className="material-symbols-outlined text-xs">verified</span> Active Student Standing
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
