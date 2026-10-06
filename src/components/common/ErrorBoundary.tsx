import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OUTPOST Mission Trainer Unhandled Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('outpost_save_v1');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isBn = typeof localStorage !== 'undefined' && localStorage.getItem('outpost_language_pref') === 'bn';

      return (
        <div className="min-h-screen bg-[#050914] text-[#F5F7FA] flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-xl bg-[#0B1324] border border-rose-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-950/50">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              {isBn ? 'মিশন কন্ট্রোল টেলিমেট্রি সেফ মোড' : 'MISSION CONTROL SAFE MODE'}
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
              {isBn ? 'সিমুলেশন সিস্টেমে সাময়িক সমস্যা হয়েছে' : 'Simulation Anomaly Detected'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
              {isBn
                ? 'ব্রাউজারে সংরক্ষিত পুরনো ডেটার কারণে সমস্যা হতে পারে। নিচের বাটনে চাপ দিয়ে ঘাঁটি রিসেট করে নতুন মিশন শুরু করুন।'
                : 'A telemetry state anomaly occurred. Resetting the outpost will clear corrupted browser memory and launch a fresh expedition.'}
            </p>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800 text-[11px] font-mono text-slate-400 text-left mb-6 overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-lg shadow-rose-900/30 hover:scale-105 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {isBn ? 'সিমুলেশন রিসেট করো ও পুনরায় শুরু করো' : 'RESET OUTPOST & RESTART MISSION'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
