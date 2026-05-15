"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ error?: string }>(error)) return error.response?.data?.error || "Registration failed";
  return "Registration failed";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="auth-main"
      style={{
        minHeight: "100vh",
        borderTop: "3px solid #1f108e",
        background: "#faf8ff",
        display: "grid",
        placeItems: "center",
        padding: "48px 18px",
      }}
    >
      <section
        className="auth-card auth-card-register"
        style={{
          width: "min(100%, 560px)",
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: "0 22px 46px rgba(19, 27, 46, 0.07)",
          padding: "62px 60px 58px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="font-newsreader auth-title" style={{ fontSize: 40, lineHeight: "50px", fontWeight: 700 }}>
            Get the Full Story with
            <br />
            HeadlineHub
          </h1>
          <p className="font-newsreader auth-subtitle" style={{ marginTop: 22, color: "#464553", fontSize: 20, lineHeight: "32px" }}>
            Join our community of readers for curated insights and breaking news delivered daily.
          </p>
        </div>

        <form className="auth-form auth-form-register" onSubmit={handleSubmit} style={{ marginTop: 66 }}>
          <label className="font-newsreader auth-label" style={{ display: "block", fontSize: 18, marginBottom: 9 }}>
            Full Name
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label className="font-newsreader auth-label auth-stacked-label" style={{ display: "block", fontSize: 18, marginTop: 30, marginBottom: 9 }}>
            Email Address
          </label>
          <input
            className="form-input"
            type="text"
            inputMode="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="font-newsreader auth-label auth-stacked-label" style={{ display: "block", fontSize: 18, marginTop: 30, marginBottom: 9 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
            <button
              className="icon-button"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              style={{ position: "absolute", right: 12, top: 13, width: 36, height: 36, color: "#464553" }}
            >
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                {showPassword && <path d="M4 20 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
          </div>

          <label className="auth-terms flex gap-4" style={{ marginTop: 34, color: "#464553", fontSize: 15, lineHeight: "25px" }}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              style={{ width: 20, height: 20, marginTop: 0, flex: "0 0 auto", accentColor: "#1f108e" }}
            />
            <span>
              By creating an account, I agree to the{" "}
              <Link href="#" style={{ color: "#1f108e", fontWeight: 700 }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" style={{ color: "#1f108e", fontWeight: 700 }}>
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && <p style={{ marginTop: 16, color: "#ba1a1a", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="auth-submit"
            style={{
              width: "100%",
              height: 56,
              marginTop: 31,
              border: "none",
              borderRadius: 8,
              background: "#2b159b",
              color: "#ffffff",
              fontFamily: "'Newsreader', serif",
              fontSize: 17,
              fontWeight: 700,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.75 : 1,
            }}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-divider" style={{ height: 1, background: "#c8c4d5", margin: "60px 0 34px" }} />
        <p className="font-newsreader auth-switch" style={{ textAlign: "center", color: "#464553", fontSize: 20 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1f108e", fontWeight: 700 }}>
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
