import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SignupForm from "../components/signup";

function Signup() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (email, password, role) => {
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("profiles").insert([
      { id: data.user.id, email, role },
    ]);

    setLoading(false);
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <SignupForm
      onSubmit={handleSignup}
      loading={loading}
      errorMsg={errorMsg}
    />
  );
}

export default Signup;
