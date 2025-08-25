import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LoginForm from "../components/login";

function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setErrorMsg("Could not retrieve role. Contact admin.");
      return;
    }

    if (profile.role === "landlord") navigate("/dashboard");
    else if (profile.role === "tenant") navigate("/dashboard-tenant");
    else setErrorMsg("Unknown role.");
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      errorMsg={errorMsg}
    />
  );
}

export default Login;
