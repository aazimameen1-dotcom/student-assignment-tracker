import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Profile() {
  const { user, setCurrentView, updateUserProfile } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);

  // Profile data states based on PDF wireframe pages 3 & 4
  const [name, setName] = useState(user?.user_metadata?.full_name || 'Alex Morgan');
  const [studentId, setStudentId] = useState(user?.user_metadata?.student_id || 'STU102938');
  const [bio, setBio] = useState(
    user?.user_metadata?.bio || 
    'Computer Science student with a growing interest in web design and literature. Currently balancing coursework across programming, writing, and design, aiming to build practical skills in each. Always working toward the next deadline.'
  );

  const [institution, setInstitution] = useState(user?.user_metadata?.institution || 'State University of Technology');
  const [semester, setSemester] = useState(user?.user_metadata?.semester || '2nd');
  const [program, setProgram] = useState(user?.user_metadata?.program || 'BS Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(user?.user_metadata?.year_of_study || '2nd Year');

  const [uniMail, setUniMail] = useState(user?.user_metadata?.uni_mail || 'alex.m@university.edu');
  const [personalMail, setPersonalMail] = useState(user?.email || 'alex.morgan@example.com');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '+1 (555) 019-2834');

  const [link1, setLink1] = useState(user?.user_metadata?.link1 || 'https://github.com/alexmorgan');
  const [link2, setLink2] = useState(user?.user_metadata?.link2 || 'https://linkedin.com/in/alexmorgan');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: name,
          student_id: studentId,
          bio,
          institution,
          semester,
          program,
          year_of_study: yearOfStudy,
          uni_mail: uniMail,
          phone,
          link1,
          link2
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile changes.');
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6 text-left pb-24 select-none">
      
      {/* Top Controls / Mode Indicator */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-sm">
        <h2 className="font-headline text-xl font-bold">
          {isEditing ? 'Edit Profile' : 'Your Profile'}
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white text-slate-900 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-base">{isEditing ? 'check' : 'edit'}</span>
          <span>{isEditing ? 'Save Mode' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Card */}
        <div className="col-span-1 md:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
          
          {/* Profile Picture */}
          <div className="relative group my-2">
            <div className="w-40 h-40 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 shadow-xl flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer opacity-90">
                <span className="material-symbols-outlined text-3xl">photo_camera</span>
              </div>
            )}
          </div>

          <div className="w-full text-center md:text-left">
            <h3 className="font-headline text-2xl font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-300 opacity-80 mt-0.5 font-mono">{studentId}</p>
          </div>

          {/* About Section */}
          <div className="w-full bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 space-y-2 text-xs leading-relaxed">
            <div className="flex justify-between items-center text-white font-bold mb-1">
              <span>About</span>
              {isEditing && <span className="material-symbols-outlined text-sm">edit</span>}
            </div>
            {isEditing ? (
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full p-2 bg-slate-900 rounded-xl border border-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400 text-white"
              />
            ) : (
              <p className="text-slate-300">{bio}</p>
            )}
          </div>

          {/* Left Action Buttons */}
          <div className="w-full space-y-2 pt-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span>Settings</span>
            </button>
          </div>

        </div>

        {/* Right Content Area Cards */}
        <div className="col-span-1 md:col-span-8 space-y-6">
          
          {/* Card 1: Core Identity */}
          <div className="bg-slate-100 p-6 rounded-2xl space-y-4 shadow-sm border border-slate-200">
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-bold text-xs inline-block">
              Core Identity
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Name</span>
                  {isEditing ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none" />
                  ) : (
                    <span className="font-bold text-slate-900">{name}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Student ID</span>
                  {isEditing ? (
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none" />
                  ) : (
                    <span className="font-bold text-slate-900">{studentId}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>
            </div>
          </div>

          {/* Card 2: Academic Information */}
          <div className="bg-slate-100 p-6 rounded-2xl space-y-4 shadow-sm border border-slate-200">
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-bold text-xs inline-block">
              Academic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center col-span-1 md:col-span-2">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Institution</span>
                  {isEditing ? (
                    <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none w-full" />
                  ) : (
                    <span className="font-bold text-slate-900">{institution}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Current Semester</span>
                  {isEditing ? (
                    <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none" />
                  ) : (
                    <span className="font-bold text-slate-900">{semester}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Program</span>
                  {isEditing ? (
                    <input type="text" value={program} onChange={(e) => setProgram(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none" />
                  ) : (
                    <span className="font-bold text-slate-900">{program}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center col-span-1 md:col-span-2">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Year of Study</span>
                  {isEditing ? (
                    <input type="text" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="font-bold text-slate-900 border-b border-slate-400 focus:outline-none" />
                  ) : (
                    <span className="font-bold text-slate-900">{yearOfStudy}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>
            </div>
          </div>

          {/* Card 3: Contact Details */}
          <div className="assignify-card-lavender p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-xs inline-block">
              Contact Details
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">University Mail</span>
                  {isEditing ? (
                    <input type="email" value={uniMail} onChange={(e) => setUniMail(e.target.value)} className="font-bold text-slate-900 border-b border-purple-400 focus:outline-none w-full" />
                  ) : (
                    <span className="font-bold text-slate-900">{uniMail}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Personal Mail</span>
                  {isEditing ? (
                    <input type="email" value={personalMail} onChange={(e) => setPersonalMail(e.target.value)} className="font-bold text-slate-900 border-b border-purple-400 focus:outline-none w-full" />
                  ) : (
                    <span className="font-bold text-slate-900">{personalMail}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Contact Number</span>
                  {isEditing ? (
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="font-bold text-slate-900 border-b border-purple-400 focus:outline-none w-full" />
                  ) : (
                    <span className="font-bold text-slate-900">{phone}</span>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>
            </div>
          </div>

          {/* Card 4: Other Links */}
          <div className="assignify-card-lavender p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-xs inline-block">
              Other Links
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div className="w-full">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Link 1</span>
                  {isEditing ? (
                    <input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} className="font-bold text-slate-900 border-b border-purple-400 focus:outline-none w-full" />
                  ) : (
                    <a href={link1} target="_blank" rel="noreferrer" className="font-bold text-purple-700 hover:underline">
                      {link1 || 'Not specified'}
                    </a>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div className="w-full">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Link 2</span>
                  {isEditing ? (
                    <input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} className="font-bold text-slate-900 border-b border-purple-400 focus:outline-none w-full" />
                  ) : (
                    <a href={link2} target="_blank" rel="noreferrer" className="font-bold text-purple-700 hover:underline">
                      {link2 || 'Not specified'}
                    </a>
                  )}
                </div>
                {isEditing && <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>}
              </div>
            </div>
          </div>

          {/* Form Submit Bar when in Edit Mode */}
          {isEditing && (
            <div className="flex gap-4 pt-2">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-[#231f5c] hover:bg-purple-900 text-white font-bold rounded-xl text-xs transition-all shadow cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
