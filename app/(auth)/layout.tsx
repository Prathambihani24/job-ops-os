import { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              GTM
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold text-slate-800 mb-2">Job Ops OS</h1>
          <p className="text-center text-sm text-slate-500 mb-8">GTM Engineering Edition</p>
          {children}
        </div>
      </div>
    </div>
  );
}
