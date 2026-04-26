import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/api';
import { QRCodeCanvas } from 'qrcode.react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();

  const upiUrl = `upi://pay?pa=${user?.upiId}&pn=${encodeURIComponent(user?.name || '')}&cu=INR`;

  const downloadQR = () => {
    const canvas = document.getElementById('user-qr-canvas');
    if (!canvas) return;
    
    // Create a new canvas to add white background and padding
    const finalCanvas = document.createElement('canvas');
    const size = 600;
    const padding = 60;
    finalCanvas.width = size;
    finalCanvas.height = size + 100; // Extra room for name
    const ctx = finalCanvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = "white";
    ctx.roundRect ? ctx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, 40) : ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.fill();
    
    // Title
    ctx.fillStyle = "#1E3A5F";
    ctx.font = "bold 40px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scan to Pay", size / 2, 80);

    // Draw QR
    ctx.drawImage(canvas, padding, 120, size - (padding * 2), size - (padding * 2));
    
    // Draw Name/UPI
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 28px Inter, sans-serif";
    ctx.fillText(user?.name || 'User', size / 2, size + 40);
    ctx.font = "20px monospace";
    ctx.fillText(user?.upiId || '', size / 2, size + 75);

    const pngFile = finalCanvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `${user?.name || 'User'}_PaySplit_QR.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const { data } = await usersApi.updateProfile({ name: form.name, phone: form.phone });
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full px-5 pt-6 pb-12 bg-surface">
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-[14px] text-text-secondary mt-1">Manage your account and preferences.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-surface-raised rounded-xl border border-border p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar name={user?.name || 'User'} size="xl" />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-text-primary">{user?.name || 'User'}</h2>
              <p className="text-[13px] text-text-secondary mt-0.5">{user?.email}</p>
              {user?.upiId && (
                <p className="text-[12px] text-text-tertiary mt-0.5">UPI: {user.upiId}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-block text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role || 'user'}
                </span>
                {user?.walletBalance !== undefined && (
                  <span className="text-[12px] text-success-700 font-medium">
                    Wallet: ₹{user.walletBalance.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowQR(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-surface-sunken transition-all border border-transparent hover:border-border"
          >
            <div className="w-10 h-10 bg-white shadow-sm border border-border/60 rounded-xl flex items-center justify-center p-2">
                <QRCodeCanvas value={upiUrl} size={32} />
            </div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">My QR</span>
          </button>
        </div>
      </div>
 
      <Modal open={showQR} onClose={() => setShowQR(false)} title="My Payment QR">
        <div className="p-4 flex flex-col items-center text-center">
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-border/40 mb-8 relative">
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary-500 rounded-tl-sm"/>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary-500 rounded-tr-sm"/>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary-500 rounded-bl-sm"/>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary-500 rounded-br-sm"/>
                
                <QRCodeCanvas 
                    id="user-qr-canvas"
                    value={upiUrl} 
                    size={240} 
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "/favicon.ico",
                        x: undefined,
                        y: undefined,
                        height: 48,
                        width: 48,
                        excavate: true,
                    }}
                />
            </div>
            
            <div className="mb-8">
                <h3 className="text-xl font-black text-text-primary mb-1">{user?.name}</h3>
                <p className="text-sm font-mono text-text-secondary bg-surface-sunken px-3 py-1 rounded-full border border-border/40">{user?.upiId}</p>
                <p className="text-xs text-text-tertiary mt-2">Scan this code to pay me on PaySplit</p>
            </div>
            
            <div className="w-full flex gap-3">
                <Button className="flex-1 gap-2" onClick={downloadQR}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setShowQR(false)}>Close</Button>
            </div>
        </div>
      </Modal>

      {/* Personal Info */}
      <div className="bg-surface-raised rounded-xl border border-border p-6 mb-6 shadow-sm">
        <h3 className="text-[15px] font-semibold text-text-primary mb-5">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              hint="Email cannot be changed"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="UPI ID"
              value={user?.upiId || ''}
              disabled
              hint="Auto-generated on registration"
            />
          </div>
        </div>
      </div>

      {/* Save + Logout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} loading={saving}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
        </div>
        <button
          onClick={handleLogout}
          className="text-[13px] font-medium text-danger-600 hover:text-danger-700 transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
