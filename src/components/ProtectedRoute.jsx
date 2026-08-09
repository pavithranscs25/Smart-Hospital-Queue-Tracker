import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const ProtectedRoute = ({
  children,
  allowedRoles = []
}) => {
  const { user, switchRole } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in or select a role from the top role switcher bar to access this section.
        </p>
        <button
          onClick={() => switchRole('patient')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2"
        >
          Login as Patient <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Unauthorized Role</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Your current account role is <strong className="uppercase">{user.role}</strong>. You need to be logged in as{' '}
          <strong className="uppercase">{allowedRoles.join(' or ')}</strong> to view this page.
        </p>
        <div className="flex gap-3">
          {allowedRoles.map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl uppercase tracking-wider"
            >
              Switch to {role}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
