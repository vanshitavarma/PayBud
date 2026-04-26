import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Loader } from '@/components';
import { paymentsApi, usersApi } from '@/api';
import jsQR from 'jsqr';

const contacts = [
  { id: 1, name: 'Ankita Sharma', phone: '+91 98765 43210', upi: 'ankita@okicici', initial: 'A', color: 'bg-red-100 text-red-700' },
  { id: 2, name: 'Rahul Verma', phone: '+91 87654 32109', upi: 'rahulv@oksbi', initial: 'R', color: 'bg-green-100 text-green-700' },
  { id: 3, name: 'Priya Patel', phone: '+91 76543 21098', upi: 'priya.p@yhfdc', initial: 'P', color: 'bg-blue-100 text-blue-700' },
  { id: 4, name: 'Vikram Singh', phone: '+91 65432 10987', upi: 'vikram.s@okaxis', initial: 'V', color: 'bg-yellow-100 text-yellow-700' },
  { id: 5, name: 'Zomato', phone: 'Business Account', upi: 'zomato@upi', initial: 'Z', color: 'bg-red-50 text-red-600' },
];

export default function Pay() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select_contact'); // select_contact | enter_amount | processing | success
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupId, setGroupId] = useState(null);
  
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upi = params.get('upi');
    const amt = params.get('amount');
    const gid = params.get('groupId');
    
    if (gid) setGroupId(gid);
    
    if (upi) {
      setSearching(true);
      usersApi.searchByUpi(upi).then(({ data }) => {
        handleSelectContact({
          id: data.user._id,
          name: data.user.name,
          upi: data.user.upiId,
          initial: data.user.name[0],
          color: 'bg-primary-100 text-primary-700'
        });
        if (amt) setAmount(amt);
      }).catch(() => {
        // Fallback or ignore
      }).finally(() => {
        setSearching(false);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length < 3) {
      setSearchResults([]);
      return;
    }
    
    // Auto-search for name or UPI ID
    try {
        setSearching(true);
        const { data } = await usersApi.searchByUpi(val);
        setSearchResults([data.user]);
    } catch (err) {
        setSearchResults([]);
    } finally {
        setSearching(false);
    }
  };
  
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setStep('enter_amount');
    setError('');
  };

  const handleQRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSearching(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          // Parse UPI URL: upi://pay?pa=...&pn=...
          const url = new URL(code.data.replace('upi://pay', 'http://dummy.com'));
          const upiId = url.searchParams.get('pa');
          
          if (upiId) {
            try {
              const { data } = await usersApi.searchByUpi(upiId);
              handleSelectContact({
                id: data.user._id,
                name: data.user.name,
                upi: data.user.upiId,
                initial: data.user.name[0],
                color: 'bg-primary-100 text-primary-700'
              });
            } catch (err) {
              setError('User not found in PaySplit system');
            }
          } else {
            setError('Invalid QR: Could not find UPI ID');
          }
        } else {
          setError('Could not detect a QR code in this image');
        }
        setSearching(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePay = async () => {
    if (!amount || parseFloat(amount) === 0) return;
    try {
      setStep('processing');
      setError('');
      await paymentsApi.settle({
        payeeId: selectedContact.id,
        amount: parseFloat(amount),
        method: 'wallet',
        groupId: groupId
      });
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
      setStep('enter_amount');
    }
  };

  const handleAmountKey = (val) => {
    if (val === 'backspace') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      if (amount.length < 10) {
        setAmount((prev) => (prev === '0' ? val : prev + val));
      }
    }
  };

  if (step === 'select_contact') {
    return (
      <div className="min-h-[100dvh] md:min-h-0 bg-surface flex flex-col pt-4 md:max-w-md md:mx-auto md:border md:border-border md:rounded-[36px] md:mt-12 md:h-[800px] md:shadow-xl md:overflow-hidden relative">
        <div className="px-4 flex items-center gap-3 mb-6 mt-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-sunken active:bg-surface-raised transition-colors shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter UPI ID (e.g. name@paysplit)" 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-surface-sunken border border-border pl-11 pr-4 py-3 rounded-full text-[15px] font-medium text-text-primary focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-text-tertiary shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
                autoFocus
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* QR Scan Section */}
        <div className="px-5 mb-8">
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleQRUpload} 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 flex flex-col items-center justify-center gap-2 text-white shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all hover:brightness-110 relative overflow-hidden"
            >
                {searching ? <Loader className="!text-white" /> : (
                    <>
                        <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                        </div>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="text-[15px] font-bold tracking-tight">Scan any QR to pay</span>
                    </>
                )}
            </button>
            {error && <p className="mt-2 text-xs font-semibold text-danger-600 text-center">{error}</p>}
        </div>

        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-text-secondary tracking-tight uppercase">
            {searchQuery ? 'Search Results' : 'System Users'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((contact) => (
                <button 
                  key={contact._id} 
                  onClick={() => handleSelectContact({
                    id: contact._id,
                    name: contact.name,
                    upi: contact.upiId,
                    initial: contact.name[0],
                    color: 'bg-primary-100 text-primary-700'
                  })}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-surface-sunken active:bg-surface-raised transition-all cursor-pointer border-b border-border/40 last:border-0"
                >
                  <div className={`w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[18px] font-bold shadow-sm shrink-0`}>
                    {contact.name[0]}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[15.5px] font-bold text-text-primary leading-tight truncate">{contact.name}</p>
                    <p className="text-[13px] text-text-secondary mt-0.5 truncate">{contact.upiId}</p>
                  </div>
                </button>
              ))
          ) : searchQuery.length >= 3 ? (
            <div className="p-8 text-center">
                <p className="text-sm text-text-tertiary">No users found with "{searchQuery}"</p>
                <p className="text-xs text-text-tertiary/60 mt-1">Try entering a full UPI ID like name@paysplit</p>
            </div>
          ) : (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="text-text-tertiary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <p className="text-sm text-text-secondary font-medium">Search for someone to pay</p>
                <p className="text-xs text-text-tertiary mt-1">Enter their name or UPI ID above</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'enter_amount') {
    return (
      <div className="min-h-[100dvh] md:min-h-0 bg-surface flex flex-col pt-4 md:max-w-md md:mx-auto md:border md:border-border md:rounded-[36px] md:mt-12 md:h-[800px] md:shadow-xl md:overflow-hidden relative">
        {/* Header */}
        <div className="px-4 flex items-center gap-4 mb-8 mt-2">
          <button onClick={() => setStep('select_contact')} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-sunken transition-colors shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-full ${selectedContact.color} flex items-center justify-center text-[16px] font-bold shadow-sm shrink-0`}>
                {selectedContact.initial}
              </div>
            <div className="text-left flex-1">
              <p className="text-[16px] font-bold text-text-primary leading-tight truncate">{selectedContact.name}</p>
              <p className="text-[12.5px] text-text-secondary mt-0.5 truncate">{selectedContact.upi}</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {error && <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-[13px] font-semibold animate-in fade-in zoom-in-95 duration-200">{error}</div>}
          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="text-[32px] text-text-tertiary font-medium">₹</span>
            <span className={`text-[56px] font-bold tracking-tight ${amount ? 'text-text-primary' : 'text-text-tertiary'}`}>
              {amount ? parseInt(amount).toLocaleString('en-IN') : '0'}
            </span>
          </div>

          <div className="w-full max-w-[240px] mb-8">
            <input 
              type="text" 
              placeholder="Add a note (optional)" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-center bg-surface-sunken border border-border py-2.5 px-4 rounded-xl text-[14px] font-medium text-text-primary focus:outline-none focus:border-primary-300 focus:bg-white transition-all placeholder:text-text-tertiary"
            />
          </div>
        </div>

        {/* Numpad */}
        <div className="bg-surface pb-safe border-t border-border/50">
           <div className="grid grid-cols-3 gap-0 bg-surface">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
              <button 
                key={num}
                onClick={() => handleAmountKey(num.toString())}
                className="h-[72px] flex items-center justify-center text-[26px] font-semibold text-text-primary active:bg-surface-sunken transition-colors border-r border-b border-border/50"
              >
                {num}
              </button>
            ))}
            <button 
                onClick={() => handleAmountKey('backspace')}
                className="h-[72px] flex items-center justify-center text-text-primary active:bg-surface-sunken transition-colors border-b border-border/50"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" /><path d="m18 9-6 6" /><path d="m12 9 6 6" />
                </svg>
            </button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
             <button
               onClick={() => setStep('select_contact')}
               className="h-[52px] rounded-xl font-bold text-[16px] text-text-primary border border-border active:scale-95 transition-all outline-none shadow-sm"
             >
               Cancel
             </button>
             <button
               onClick={handlePay}
               disabled={!amount || parseInt(amount) === 0}
               className="h-[52px] rounded-xl font-bold text-[16px] text-white bg-[#1E3A5F] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all outline-none shadow-md"
             >
               Pay
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-[100dvh] md:min-h-0 bg-[#1E3A5F] flex flex-col items-center justify-center md:max-w-md md:mx-auto md:border md:border-border md:rounded-[36px] md:mt-12 md:h-[800px] md:shadow-xl md:overflow-hidden relative">
         <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
         <p className="text-white font-medium text-[16px]">Processing Payment...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[100dvh] md:min-h-0 bg-surface flex flex-col pt-20 px-6 items-center md:max-w-md md:mx-auto md:border md:border-border md:rounded-[36px] md:mt-12 md:h-[800px] md:shadow-xl md:overflow-hidden relative">
         <div className="w-24 h-24 rounded-full bg-success-500 text-white flex items-center justify-center shadow-lg shadow-success-500/30 mb-6 scale-in-center animate-[pop_.4s_ease-out]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
         </div>
         <h1 className="text-[24px] font-bold text-text-primary tracking-tight text-center leading-tight mb-2">
           ₹{parseInt(amount).toLocaleString('en-IN')} paid to<br/>{selectedContact.name}
         </h1>
         <p className="text-[14px] text-text-tertiary mb-10 text-center">
           {selectedContact.phone}<br/>{new Date().toLocaleString('en-IN')}
         </p>

         <button 
           onClick={() => navigate('/dashboard')}
           className="w-full max-w-[280px] h-[52px] px-6 rounded-xl font-bold text-[15px] text-[#1E3A5F] border border-[#1E3A5F]/20 active:bg-surface-sunken transition-all outline-none shadow-sm bg-surface-raised"
         >
           Done
         </button>
      </div>
    );
  }

  return null;
}
