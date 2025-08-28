import React, { useState } from "react";

function SignupForm({ onSubmit, loading, errorMsg }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onSubmit(email, password, role);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-crimson">Sign Up</h2>

      {errorMsg && (
        <div className="text-sm text-red-600 text-center font-medium">
          {errorMsg}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
        required
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
      >
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full max-w-xs mx-auto block bg-crimson hover:bg-red-700 transition text-white py-2 rounded font-semibold shadow"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-crimson hover:underline font-medium">
          Log in here
        </a>
      </p>

      <style>{`.text-crimson { color: #DC143C; } .bg-crimson { background-color: #DC143C; }`}</style>
    </form>
  );
}

export default SignupForm;
