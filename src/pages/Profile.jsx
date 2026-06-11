import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { supabase } from '../supabaseClient';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://api.dicebear.com/7.x/bottts/svg?seed=StudyTracker',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex'
];

export default function Profile() {
  const { user, tasks, setCurrentView, updateUserProfile } = useContext(AppContext);

  // Completed tasks count from context
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  
  // Local profile states
  const [major, setMajor] = useState(user?.user_metadata?.major || '');
  const [year, setYear] = useState(user?.user_metadata?.year || '');
  const [gpa, setGpa] = useState(user?.user_metadata?.gpa || '');
  const [credits, setCredits] = useState(user?.user_metadata?.credits || '');
  const [portfolio, setPortfolio] = useState(user?.user_metadata?.portfolio || '');
  const [linkedin, setLinkedin] = useState(user?.user_metadata?.linkedin || '');

  // Academic interests list
  const [interests, setInterests] = useState(user?.user_metadata?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [showAddInterest, setShowAddInterest] = useState(false);

  // Avatar Modal & Crop state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropView, setCropView] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sync state with user metadata when loaded
  useEffect(() => {
    if (user) {
      setMajor(user.user_metadata?.major || '');
      setYear(user.user_metadata?.year || '');
      setGpa(user.user_metadata?.gpa || '');
      setCredits(user.user_metadata?.credits || '');
      setPortfolio(user.user_metadata?.portfolio || '');
      setLinkedin(user.user_metadata?.linkedin || '');
      setInterests(user.user_metadata?.interests || []);
    }
  }, [user]);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User');
  const [editMajor, setEditMajor] = useState(major);
  const [editYear, setEditYear] = useState(year);
  const [editGpa, setEditGpa] = useState(gpa);
  const [editCredits, setEditCredits] = useState(credits);
  const [editPortfolio, setEditPortfolio] = useState(portfolio);
  const [editLinkedin, setEditLinkedin] = useState(linkedin);

  // Helper for dynamic user avatar
  const renderLargeAvatar = () => {
    const avatarCleared = user?.user_metadata?.avatar_cleared;
    const avatarUrl = !avatarCleared && (user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.photoURL);
    if (avatarUrl) {
      return (
        <img 
          alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'user profile'} 
          className="w-full h-full object-cover border-4 border-surface rounded-full" 
          src={avatarUrl}
        />
      );
    }
    const nameToUse = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User';
    const initial = nameToUse ? nameToUse[0].toUpperCase() : 'G';
    return (
      <div className="w-full h-full rounded-full border-4 border-surface bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-5xl">
        {initial}
      </div>
    );
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
    setCropView(false);
    setImageSrc(null);
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPan({ x: 0, y: 0 });
  };

  const handleSelectAvatar = async (url) => {
    const marker = 'storage/v1/object/public/avatars/';
    const oldUrl = user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url;

    if (updateUserProfile) {
      try {
        await updateUserProfile({ 
          custom_avatar_url: url,
          avatar_cleared: url ? false : true
        });
        
        // If the update succeeded, automatically delete the old custom file from storage
        if (oldUrl && oldUrl !== url && oldUrl.includes(marker)) {
          const oldPath = oldUrl.split(marker)[1];
          if (oldPath) {
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        }
      } catch (err) {
        console.error("Failed to update avatar:", err);
        alert("Failed to update profile photo.");
      }
    }
    closeAvatarModal();
  };

  const handleAvatarUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      // Increased size validation to 50MB limit as requested
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCropView(true);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Failed to read image file.");
    }
  };

  // Drag Pan handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setDragging(true);
    setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
  };

  const handleTouchMove = (e) => {
    if (!dragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleCropSave = async () => {
    if (!imageSrc) return;
    setUploading(true);

    try {
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setUploading(false);
          return;
        }

        ctx.clearRect(0, 0, 256, 256);
        ctx.save();

        // 1. Move origin to center of canvas
        ctx.translate(128, 128);
        
        // 2. Apply pan translation in screen coordinates
        ctx.translate(pan.x, pan.y);

        // 3. Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // 4. Apply scale (zoom & flip states)
        ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);

        // 5. Draw image centered
        const imgRatio = img.width / img.height;
        let drawW = 256;
        let drawH = 256;
        if (imgRatio > 1) {
          drawH = 256 / imgRatio;
        } else {
          drawW = 256 * imgRatio;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // 6. Convert to PNG Blob and upload to Supabase Storage
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setUploading(false);
            alert("Failed to process image crop.");
            return;
          }

          try {
            const filePath = `${user.id}/${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, blob, {
                contentType: 'image/png',
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            await handleSelectAvatar(data.publicUrl);
          } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload cropped image.");
          } finally {
            setUploading(false);
          }
        }, 'image/png');
      };
      img.onerror = () => {
        setUploading(false);
        alert("Failed to load image for cropping.");
      };
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: editName,
          major: editMajor,
          year: editYear,
          gpa: editGpa,
          credits: editCredits,
          portfolio: editPortfolio,
          linkedin: editLinkedin
        });
      }
      setMajor(editMajor);
      setYear(editYear);
      setGpa(editGpa);
      setCredits(editCredits);
      setPortfolio(editPortfolio);
      setLinkedin(editLinkedin);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile details.");
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest) return;
    const updatedInterests = interests.includes(newInterest) ? interests : [...interests, newInterest];
    if (updateUserProfile) {
      try {
        await updateUserProfile({ interests: updatedInterests });
      } catch (err) {
        console.error("Failed to update interests:", err);
      }
    }
    setInterests(updatedInterests);
    setNewInterest('');
    setShowAddInterest(false);
  };

  const removeInterest = async (interestToRemove) => {
    const updatedInterests = interests.filter(i => i !== interestToRemove);
    if (updateUserProfile) {
      try {
        await updateUserProfile({ interests: updatedInterests });
      } catch (err) {
        console.error("Failed to remove interest:", err);
      }
    }
    setInterests(updatedInterests);
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto px-margin-mobile py-8 text-left pb-24">
      {/* Top Header Row (Back & Title) */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('dashboard')}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">arrow_back</span>
        </button>
        <h2 className="font-headline text-headline-md font-bold text-primary">Academic Profile</h2>
      </header>

      {/* Hero Profile Section */}
      <section className="mt-4 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-surface-container-highest">
            {renderLargeAvatar()}
          </div>
          <button 
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-white text-[18px]">edit</span>
          </button>
        </div>

        <div className="mt-6 w-full">
          <h3 className="font-headline text-headline-lg font-bold text-on-surface">
            {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User'}
          </h3>
          <p className="font-body text-body-md text-on-surface-variant mt-1 font-medium">
            {major && year ? `${major} • ${year}` : major || year || 'No academic details added yet'}
          </p>
          {year && (
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full">
              <span className="font-mono text-label-md text-primary font-bold uppercase tracking-wider">{year}</span>
            </div>
          )}
        </div>

        {!isEditing && (
          <button 
            onClick={() => {
              setEditName(user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User');
              setEditMajor(major);
              setEditYear(year);
              setEditGpa(gpa);
              setEditCredits(credits);
              setEditPortfolio(portfolio);
              setEditLinkedin(linkedin);
              setIsEditing(true);
            }}
            className="mt-6 w-full py-3 bg-primary text-on-primary rounded-xl font-mono text-label-md hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm cursor-pointer text-center"
          >
            EDIT PROFILE
          </button>
        )}
      </section>

      {/* Profile Edit Mode Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-6 bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl space-y-4">
          <h4 className="font-headline text-headline-sm font-semibold text-primary">Edit Details</h4>
          
          <div>
            <label className="block font-mono text-label-md text-on-surface-variant mb-1">Full Name</label>
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
              required
            />
          </div>
          
          <div>
            <label className="block font-mono text-label-md text-on-surface-variant mb-1">Academic Major</label>
            <input 
              type="text" 
              value={editMajor}
              onChange={(e) => setEditMajor(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-label-md text-on-surface-variant mb-1">Year</label>
              <input 
                type="text" 
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono text-label-md text-on-surface-variant mb-1">GPA</label>
              <input 
                type="text" 
                value={editGpa}
                onChange={(e) => setEditGpa(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-label-md text-on-surface-variant mb-1">Credits</label>
              <input 
                type="text" 
                value={editCredits}
                onChange={(e) => setEditCredits(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono text-label-md text-on-surface-variant mb-1">Portfolio Domain</label>
              <input 
                type="text" 
                value={editPortfolio}
                onChange={(e) => setEditPortfolio(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-label-md text-on-surface-variant mb-1">LinkedIn Handle</label>
            <input 
              type="text" 
              value={editLinkedin}
              onChange={(e) => setEditLinkedin(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 border border-outline text-on-surface rounded-lg font-mono text-label-md hover:bg-surface-container transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all cursor-pointer shadow-sm text-center"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Stats Bento Grid */}
      <section className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            grade
          </span>
          <span className="font-headline text-headline-sm font-bold text-on-surface">{gpa || '—'}</span>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Current GPA</span>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            task_alt
          </span>
          <span className="font-headline text-headline-sm font-bold text-on-surface">
            {completedTasksCount}
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Tasks Done</span>
        </div>

        <div className="col-span-2 bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-surface-container-lowest">
              <span className="font-mono text-label-md text-primary font-bold">{credits || '0'}</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-body text-body-md font-semibold text-on-surface">Semester Credits</span>
              <span className="font-body text-body-sm text-on-surface-variant">
                {credits ? "On track for Dean's List" : "No credits recorded"}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </div>
      </section>

      {/* Academic Interests */}
      <section className="mt-10">
        <h3 className="font-headline text-headline-sm font-semibold mb-4 text-on-surface">Academic Interests</h3>
        <div className="flex flex-wrap gap-2 items-center">
          {interests.length === 0 ? (
            <span className="text-body-sm text-on-surface-variant italic py-1">No interests added yet</span>
          ) : (
            interests.map((interest) => (
              <span 
                key={interest} 
                className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-lg font-mono text-label-md flex items-center gap-1.5 group hover:border-error/45 transition-colors cursor-pointer"
                onClick={() => removeInterest(interest)}
                title="Click to remove"
              >
                {interest}
                <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:text-error group-hover:opacity-100 transition-opacity">
                  close
                </span>
              </span>
            ))
          )}

          {!showAddInterest ? (
            <button 
              onClick={() => setShowAddInterest(true)}
              className="px-3 py-1.5 border border-outline border-dashed rounded-lg font-mono text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add
            </button>
          ) : (
            <form onSubmit={handleAddInterest} className="flex gap-1.5 items-center">
              <input 
                type="text" 
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="New Interest"
                required
                autoFocus
                className="px-2 py-1.5 text-xs border border-outline rounded-lg bg-surface text-on-surface focus:outline-none focus:border-primary w-28"
              />
              <button type="submit" className="material-symbols-outlined text-primary hover:bg-surface-container rounded-full p-1 cursor-pointer">
                check
              </button>
              <button type="button" onClick={() => setShowAddInterest(false)} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer">
                close
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact & Socials */}
      <section className="mt-10 mb-8">
        <h3 className="font-headline text-headline-sm font-semibold mb-4 text-on-surface">Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
            <div className="flex flex-col text-left">
              <span className="font-body text-[11px] text-on-surface-variant">University Email</span>
              <span className="font-body text-body-md text-on-surface font-semibold truncate max-w-[280px]">
                {user?.email || 'guest@studytrack.demo'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">link</span>
            <div className="flex flex-col text-left">
              <span className="font-body text-[11px] text-on-surface-variant">Portfolio</span>
              <span className="font-body text-body-md text-primary font-semibold">{portfolio || 'Not set'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">share</span>
            <div className="flex flex-col text-left">
              <span className="font-body text-[11px] text-on-surface-variant">LinkedIn</span>
              <span className="font-body text-body-md text-on-surface font-semibold">{linkedin || 'Not set'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-headline text-headline-sm font-bold text-primary">
                {cropView ? 'Crop & Rotate Photo' : 'Choose Profile Photo'}
              </h4>
              <button 
                type="button"
                onClick={closeAvatarModal}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {cropView ? (
              <div className="space-y-4">
                {/* Circular Viewport */}
                <div 
                  className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-primary bg-surface-container relative flex items-center justify-center cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Preview"
                      draggable={false}
                      className="select-none"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom * (flipH ? -1 : 1)}, ${zoom * (flipV ? -1 : 1)})`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transition: dragging ? 'none' : 'transform 0.1s ease'
                      }}
                    />
                  )}
                  {/* Outer circle overlay */}
                  <div className="absolute inset-0 border-[24px] border-black/40 rounded-full pointer-events-none"></div>
                </div>

                {/* Zoom range */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Rotation & Flip Controls */}
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="flex-1 py-1.5 px-2.5 bg-surface-container border border-outline-variant rounded-lg font-mono text-[11px] text-on-surface hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">rotate_right</span>
                    Rotate
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipH((f) => !f)}
                    className="flex-1 py-1.5 px-2.5 bg-surface-container border border-outline-variant rounded-lg font-mono text-[11px] text-on-surface hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">flip</span>
                    Flip H
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipV((f) => !f)}
                    className="flex-1 py-1.5 px-2.5 bg-surface-container border border-outline-variant rounded-lg font-mono text-[11px] text-on-surface hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">flip</span>
                    Flip V
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 justify-end pt-4 border-t border-outline-variant mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCropView(false);
                      setImageSrc(null);
                      setZoom(1);
                      setRotation(0);
                      setFlipH(false);
                      setFlipV(false);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="px-4 py-2 border border-outline text-on-surface rounded-lg font-mono text-label-sm hover:bg-surface-container transition-colors cursor-pointer mr-auto"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={closeAvatarModal}
                    className="px-4 py-2 border border-outline text-on-surface rounded-lg font-mono text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCropSave}
                    disabled={uploading}
                    className="px-5 py-2 bg-primary text-on-primary rounded-lg font-mono text-label-sm hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Photo'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preset Avatars Grid */}
                <p className="font-mono text-label-md text-on-surface-variant mb-2">Preset Avatars</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvatar(url)}
                      className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary focus:border-primary active:scale-95 transition-all cursor-pointer bg-surface"
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Custom File Upload */}
                <p className="font-mono text-label-md text-on-surface-variant mb-2">Or upload image file</p>
                <div className="space-y-4">
                  <label 
                    htmlFor="avatar-file-upload" 
                    className="w-full py-5 px-4 border-2 border-dashed border-outline-variant hover:border-primary rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-[28px] text-primary mb-1">
                      cloud_upload
                    </span>
                    <span className="font-body text-body-sm font-semibold text-on-surface text-center">
                      Select an image file
                    </span>
                    <span className="font-body text-[10px] text-on-surface-variant mt-0.5 text-center">
                      PNG, JPG, GIF up to 50MB
                    </span>
                  </label>
                  <input 
                    type="file"
                    id="avatar-file-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2 justify-end pt-2 border-t border-outline-variant">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectAvatar(null); // remove / reset to default initials
                      }}
                      className="px-3 py-2 text-error hover:bg-error/5 rounded-lg font-mono text-label-sm transition-colors cursor-pointer mr-auto"
                    >
                      Clear Image
                    </button>
                    <button
                      type="button"
                      onClick={closeAvatarModal}
                      className="px-4 py-2 border border-outline text-on-surface rounded-lg font-mono text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
