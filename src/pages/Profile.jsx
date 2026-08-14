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
  
  const initialAvatar = localStorage.getItem('user_avatar') || 
    user?.user_metadata?.custom_avatar_url || 
    user?.user_metadata?.avatar_url || 
    AVATAR_PRESETS[0];

  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [githubUrl, setGithubUrl] = useState(user?.user_metadata?.github_url || 'https://github.com/scholar-student');
  const [targetGpa, setTargetGpa] = useState(user?.user_metadata?.target_gpa || '3.90');

  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  // Helper to compress and convert uploaded image into high-quality square avatar
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Draw image to a canvas (max 320x320 for super-fast loading and crisp quality)
          const canvas = document.createElement('canvas');
          const maxDim = 320;
          let width = image.width;
          let height = image.height;

          // Crop to square aspect ratio
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

          // Get compressed Base64 Data URL (JPEG, 0.88 quality)
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

    // Security Hardening: Cap image file size at 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please select a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Strict MIME validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const optimizedAvatar = await processImageFile(file);
      
      // Update local state immediately
      setAvatarUrl(optimizedAvatar);
      localStorage.setItem('user_avatar', optimizedAvatar);

      // Persist to Supabase user metadata
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
    e.preventDefault();
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: name,
          name: name,
          student_id: studentId,
          institution: institution,
          degree: degree,
          semester: semester,
          bio: bio,
          custom_avatar_url: avatarUrl,
          avatar_url: avatarUrl,
          github_url: githubUrl,
          target_gpa: targetGpa
        });
      }
      localStorage.setItem('user_avatar', avatarUrl);
      setIsEditing(false);
      setSaveSuccess('Profile details successfully updated!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in text-left pb-16">
      
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/png, image/jpeg, image/webp, image/gif" 
        className="hidden" 
      />

      {/* Toast Notification */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess('')} className="text-emerald-600 hover:text-emerald-900">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Main Profile Header Hero Card */}
      <div className="app-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            {/* Avatar with click-to-upload button */}
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-100 shadow-md flex items-center justify-center cursor-pointer relative"
                title="Click to change profile picture"
              >
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                  <span className="material-symbols-outlined text-2xl">
                    {isUploading ? 'progress_activity' : 'photo_camera'}
                  </span>
                  <span className="text-[10px] font-bold">
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </span>
                </div>
              </div>

              {/* Floating Camera Button */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer ring-2 ring-white"
                title="Upload Photo"
              >
                <span className="material-symbols-outlined text-sm">
                  {isUploading ? 'sync' : 'upload'}
                </span>
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="font-heading text-2xl font-bold text-slate-900">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {studentId}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">{degree}</p>
              <p className="text-xs text-slate-400 font-mono">{institution} • {semester}</p>
              
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                  <span>Upload custom picture</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'app-btn-primary' : 'app-btn-secondary'}
            >
              <span className="material-symbols-outlined text-base">{isEditing ? 'save' : 'edit'}</span>
              <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Settings"
            >
              <span className="material-symbols-outlined text-base">settings</span>
            </button>
          </div>
        </div>

        {/* Avatar Upload & Selection Drawer in Editing Mode */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 font-heading">Choose Avatar or Upload Device Photo</label>
                <p className="text-[11px] text-slate-500">Pick one of our presets or upload any image from your computer.</p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="app-btn-primary text-xs self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                <span>Upload From Computer</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    avatarUrl === preset ? 'border-slate-900 ring-2 ring-slate-900/20 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Academic Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-semibold uppercase">Current SGPA</span>
            <span className="material-symbols-outlined text-base">grade</span>
          </div>
          <p className="font-heading text-2xl font-bold text-slate-900">3.84</p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">trending_up</span> Top 5% standing
          </p>
        </div>

        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-semibold uppercase">Target GPA</span>
            <span className="material-symbols-outlined text-base">flag</span>
          </div>
          <p className="font-heading text-2xl font-bold text-slate-900">{targetGpa}</p>
          <p className="text-[10px] text-slate-500">Target for 2026</p>
        </div>

        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-semibold uppercase">Enrolled Courses</span>
            <span className="material-symbols-outlined text-base">auto_stories</span>
          </div>
          <p className="font-heading text-2xl font-bold text-slate-900">{enrolledSubjects.length || 6}</p>
          <p className="text-[10px] text-slate-500">18 total credits</p>
        </div>

        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-semibold uppercase">Completed Tasks</span>
            <span className="material-symbols-outlined text-base">task_alt</span>
          </div>
          <p className="font-heading text-2xl font-bold text-slate-900">{completedTasks}</p>
          <p className="text-[10px] text-blue-600 font-semibold">{tasks.length} total assigned</p>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Academic Bio & Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="app-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-sm font-bold text-slate-900">Academic Summary & Research Interests</h3>
              <span className="text-slate-400 text-xs font-mono">Overview</span>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Major</label>
                  <input 
                    type="text" 
                    value={degree} 
                    onChange={(e) => setDegree(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Statement & Bio</label>
                  <textarea 
                    rows={4} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="app-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSave} 
                    className="app-btn-primary text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                {bio}
              </p>
            )}
          </div>

          {/* Enrolled Courses Summary */}
          <div className="app-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-sm font-bold text-slate-900">Current Semester Curriculum</h3>
              <button 
                onClick={() => setCurrentView('subjects')} 
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                View Details
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

        {/* Right 1 Col: Account & Metadata */}
        <div className="space-y-6">
          <div className="app-card p-6 space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Contact & Credentials
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Primary University Email</span>
                <p className="font-medium text-slate-900 mt-0.5">{email}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Repository / Portfolio</span>
                {githubUrl ? (
                  <a 
                    href={
                      githubUrl.startsWith('https://') || githubUrl.startsWith('http://')
                        ? githubUrl
                        : `https://${githubUrl}`
                    } 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-blue-600 hover:underline mt-0.5 block truncate"
                  >
                    {githubUrl}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not set</span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Student Identity Verification</span>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                  <span className="material-symbols-outlined text-xs">verified</span> Active Registered Student
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
