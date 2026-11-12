import type { AuthRole } from '../types/auth.types';

interface RoleSelectorProps {
  role: AuthRole;
  setRole: (role: AuthRole) => void;
}

export const RoleSelector = ({ role, setRole }: RoleSelectorProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        type="button"
        onClick={() => setRole('user')}
        className={`flex-1 py-2 border-[3px] border-black rounded-xl text-black transition-all font-hand text-2xl ${
          role === 'user'
            ? 'bg-[#93C5FD] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
            : 'bg-white hover:bg-slate-100'
        }`}
      >
        Citizen
      </button>
    </div>
  );
};