import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, Loader2, X, Search, ShieldCheck } from 'lucide-react';

interface ConnectPanelProps {
  isConnected: boolean;
  connectedUser: string;
  onConnect: (username: string) => Promise<void>;
  onDisconnect: () => void;
}

type ConnectStatus = 'IDLE' | 'SEARCHING' | 'VERIFYING' | 'CONNECTED';

const ConnectPanel: React.FC<ConnectPanelProps> = ({ isConnected, connectedUser, onConnect, onDisconnect }) => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<ConnectStatus>('IDLE');
  const [error, setError] = useState('');
  const [statusText, setStatusText] = useState('');

  // Reset internal state if external props change (e.g., forced disconnect)
  useEffect(() => {
    if (!isConnected && status === 'CONNECTED') {
      setStatus('IDLE');
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (username.length < 4 || username.length > 15) {
      setError('Username must be between 4 and 15 characters');
      return;
    }
    setError('');
    
    // Simulate realistic connection steps
    setStatus('SEARCHING');
    setStatusText('Searching database...');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStatusText('User found. Verifying encryption...');
    setStatus('VERIFYING');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatusText('Establishing secure handshake...');
    await new Promise(resolve => setTimeout(resolve, 600));

    await onConnect(username);
    setStatus('CONNECTED');
  };

  const handleDisconnect = () => {
    setUsername('');
    setStatus('IDLE');
    onDisconnect();
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-800 mb-6 transition-all duration-300">
      
      {status === 'CONNECTED' ? (
        <div className="animate-fade-in-up">
           <div className="flex items-center justify-between gap-3">
             <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/50 rounded-xl px-4 py-3 flex items-center gap-3">
               <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-full">
                 <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
               </div>
               <div>
                  <div className="text-xs text-green-600 dark:text-green-500 font-medium">Connected securely to</div>
                  <div className="text-green-800 dark:text-green-300 font-bold">@{connectedUser}</div>
               </div>
             </div>
             <button
              onClick={handleDisconnect}
              className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 font-medium px-4 py-3 rounded-xl text-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 shadow-sm"
             >
               Change
             </button>
           </div>
           <div className="mt-3 flex items-center gap-2 px-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-500">Encrypted Connection Active</span>
           </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Target Username
            </h2>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <ShieldCheck size={12} className="text-gray-400 dark:text-slate-500" />
                <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Anonymous</span>
            </div>
          </div>

          <div className="relative">
             <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        value={username}
                        disabled={status !== 'IDLE'}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter username"
                        className={`w-full bg-gray-50 dark:bg-slate-800/50 border ${error ? 'border-red-300 dark:border-red-500/50' : 'border-gray-200 dark:border-slate-700 focus:border-yellow-400 dark:focus:border-yellow-400'} rounded-xl px-4 py-3.5 pl-11 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all font-medium disabled:opacity-70`}
                    />
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${status !== 'IDLE' ? 'text-yellow-500' : 'text-gray-400 dark:text-slate-500'}`}>
                         {status === 'SEARCHING' || status === 'VERIFYING' ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                    </div>
                    
                    {username && status === 'IDLE' && (
                        <button 
                            onClick={() => setUsername('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 bg-gray-200/50 dark:bg-slate-700/50 rounded-full"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
                
                <button
                    onClick={handleConnect}
                    disabled={status !== 'IDLE' || !username}
                    className="bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none min-w-[100px]"
                >
                    Connect
                </button>
            </div>
            
            {/* Status Feedback Area */}
            <div className={`overflow-hidden transition-all duration-300 ${status !== 'IDLE' || error ? 'max-h-10 mt-2' : 'max-h-0'}`}>
                 {error ? (
                     <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1">
                        <X size={12} /> {error}
                     </p>
                 ) : (
                     <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium ml-1 flex items-center gap-2 animate-pulse">
                        <Search size={12} /> {statusText}
                     </p>
                 )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectPanel;