import { Navigate, useNavigate } from "react-router-dom";

import { ShieldAlert } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuth } = useAuth();

  const navigate = useNavigate();

  // ======================================================
  // SESSION EXPIRED / NOT LOGGED IN
  // ======================================================

  if (!isAuth) {
    return <Navigate to="/landing" replace />;
  }

  // ======================================================
  // WRONG ROLE
  // ======================================================

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>

          <p className="mt-3 text-sm text-slate-500">
            You do not have permission to access this page.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Required role:
            <span className="ml-1 font-semibold text-green-600">
              {allowedRoles.join(" or ")}
            </span>
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Your role:
            <span className="ml-1 font-semibold">{user?.role}</span>
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
