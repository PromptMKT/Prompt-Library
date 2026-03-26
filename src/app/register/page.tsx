"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ensureUserProfile, isRegisteredEmail, isRegisteredUsername, isValidEmail, sanitizeEmail, signInWithGoogle, signInWithGithub, toAuthMessage, validatePassword } from "@/lib/auth";
import { Github, ArrowRight, Shield, Sparkles, Code2, Palette, Megaphone, Briefcase, Users, Globe, Rocket, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { pepperPassword } from "@/app/actions/auth-actions";

export default function RegisterPage() {
  const duplicateEmailMessage = "This email is already registered. Please sign in instead.";
  const mismatchMessage = "Create Password and Confirm Password must match.";
  const passwordRuleHint = "At least 8 chars, with uppercase, lowercase, and number";
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("buyer");
  const [interests, setInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState(0);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  useEffect(() => {
    if (retryAfterSec <= 0) return;
    const timer = window.setInterval(() => {
      setRetryAfterSec((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [retryAfterSec]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("step") === "2") {
        setStep(2);
      }
    }
  }, []);

  const pathOptions = [
    { id: "creator", label: "Content Creator", sub: "Influencers, writers, creators", icon: Sparkles },
    { id: "designer", label: "Designer", sub: "UI/UX, 3D, brand artists", icon: Palette },
    { id: "developer", label: "Developer", sub: "Software, web, AI engineers", icon: Code2 },
    { id: "marketer", label: "Marketer", sub: "SEO, ads, content strategy", icon: Megaphone },
    { id: "business-owner", label: "Business Owner", sub: "Founders, CEOs, managers", icon: Briefcase },
    { id: "other", label: "Other", sub: "Everything else", icon: Users },
  ];

  const interestGroups: { label: string; items: string[] }[] = [
    { label: "Generative AI", items: ["ChatGPT", "Claude", "Gemini", "Grok", "Midjourney", "Stable Diffusion"] },
    { label: "Media & Arts", items: ["AI Music", "Video Synthesis", "3D Generation", "Photography", "Illustration"] },
    { label: "Productivity", items: ["Automation", "Coding", "Marketing", "Research", "Copywriting"] },
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const displayName = (username || (email.includes("@") ? email.split("@")[0] : "newuser"))
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const passwordRulesNotMet = password.length > 0 && Boolean(validatePassword(password));

  const validateStepOneWithInlineErrors = (): boolean => {
    const cleanEmail = sanitizeEmail(email);
    const nextEmailError = !isValidEmail(cleanEmail) ? "Please enter a valid email address." : null;
    const nextUsernameError = username.trim().length === 0 ? "Username is required." : (username.trim().length < 3 ? "Username must be at least 3 characters." : null);
    const nextPasswordError = validatePassword(password);
    const nextConfirmError = password !== confirmPassword ? mismatchMessage : null;
    const nextTermsError = !acceptedTerms ? "Please accept terms before continuing." : null;

    setEmailError(nextEmailError);
    setUsernameError(nextUsernameError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmError);
    setTermsError(nextTermsError);

    if (nextEmailError) {
      setError(nextEmailError);
      return false;
    }
    if (nextUsernameError) {
      setError(nextUsernameError);
      return false;
    }
    if (nextPasswordError) {
      setError(nextPasswordError);
      return false;
    }
    if (nextConfirmError) {
      setError(null);
      return false;
    }
    if (nextTermsError) {
      setError(nextTermsError);
      return false;
    }

    setError(null);
    return true;
  };

  const validateStep = (phase: number): string | null => {
    if (phase === 1) {
      const cleanEmail = sanitizeEmail(email);
      if (!isValidEmail(cleanEmail)) return "Please enter a valid email address.";
      const passwordError = validatePassword(password);
      if (passwordError) return passwordError;
      if (password !== confirmPassword) return "Create Password and Confirm Password must match.";
      if (!acceptedTerms) return "Please accept terms before continuing.";
      return null;
    }

    if (phase === 2) {
      if (!role) return "Please select your path before continuing.";
      return null;
    }

    if (phase === 3) {
      if (interests.length === 0) return "Please select at least one interest before creating account.";
      return null;
    }

    return null;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!validateStepOneWithInlineErrors()) {
        return;
      }

      setCheckingAvailability(true);
      // We check username first
      const userCheck = await isRegisteredUsername(username);

      if (userCheck.exists) {
        setCheckingAvailability(false);
        setUsernameError("This username is already taken. Please try another one.");
        return;
      }

      // Attempt to sign up immediately to catch "Email already registered" errors on Step 1
      const cleanEmail = sanitizeEmail(email);
      const finalPassword = await pepperPassword(password);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: finalPassword,
        options: {
          data: {
            username: username.trim().toLowerCase(),
            display_name: displayName,
          },
        },
      });

      setCheckingAvailability(false);

      if (signUpError) {
        const authMessage = toAuthMessage(signUpError.message || "", "signup");
        if (authMessage === duplicateEmailMessage) {
          setEmailError(authMessage);
        } else {
          setError(authMessage);
        }
        return;
      }
      
      // Successfully signed up or email confirmation sent. Move to step 2.
    } else {
      const validationError = validateStep(step);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    setInfo(null);
    setStep((current) => Math.min(3, current + 1));
  };

  const handleRegister = async () => {
    if (retryAfterSec > 0) {
      setError(`Too many attempts right now. Please wait ${retryAfterSec}s and try again.`);
      return;
    }

    const stepThreeError = validateStep(3);
    if (stepThreeError) {
      setError(stepThreeError);
      setStep(3);
      return;
    }

    setSubmitting(true);
    setError(null);
    setInfo(null);

    // The user was already created in Step 1.
    // Now we update their metadata with the final choices and ensure the profile is synced.
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Update the auth user's metadata to include the new role and interests
      await supabase.auth.updateUser({
        data: {
          role,
          interests,
        }
      });

      await ensureUserProfile(user, {
        role,
        interests,
        displayName,
      });

      router.push("/register/welcome");
    } else {
      setInfo("Account created. Please sign in to continue.");
      router.push("/sign-in?registered=1");
    }
  };

  return (
    <main className="min-h-dvh bg-[#0a0a0f] text-white selection:bg-purple-500/30 selection:text-white">
      <div className="grid min-h-dvh lg:grid-cols-[40%_60%]">
        <aside className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/5 bg-[#0f0f1a]">
          <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-indigo-600/10 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-900/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-2xl font-black tracking-tight text-white">PROMPT<span className="text-purple-500 italic">VAULT</span></span>
            </Link>

            <div className="space-y-5">
              <h2 className="text-6xl font-black tracking-tight leading-[0.95] text-white">Your gateway to <span className="text-purple-500">Elite AI</span> Engineering.</h2>
              <p className="text-lg text-slate-400 max-w-md">Join thousands of creators shaping the future of generative media.</p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { title: "Top Rated Prompts", sub: "Access the highest quality prompts in the world.", icon: Rocket },
                { title: "Secure Transactions", sub: "All purchases are protected and verified.", icon: Shield },
                { title: "Expert Community", sub: "Learn from the best prompt engineers globally.", icon: Globe },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 p-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs tracking-[0.18em] uppercase text-slate-500 font-black">Empowering the next 1B creators</div>
        </aside>

        <section className="relative p-6 sm:p-10 lg:p-14 flex items-center justify-center bg-[#07070b] min-h-dvh">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
          <div className="w-full max-w-160 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1 w-8 rounded-full", i <= step ? "bg-purple-600" : "bg-white/15")} />
                ))}
              </div>
              <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-500">Phase {String(step).padStart(2, "0")} / 03</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl border border-white/8 bg-[#060913] p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
              {info ? (
                <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {info}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              ) : null}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-6xl font-black tracking-tight leading-[0.95] text-white">
                      Create your <span className="text-purple-400 italic">account</span>
                    </h1>
                    <p className="text-slate-400 mt-3">Join 48,000+ creators. Sign up with Google for the fastest experience, or use your email.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        const { error } = await signInWithGoogle("/register?step=2");
                        if (error) setError(error.message);
                      }}
                      className="h-14 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google" className="w-5 h-5" />
                      <span className="text-sm font-bold text-white">Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const { error } = await signInWithGithub("/register?step=2");
                        if (error) setError(error.message);
                      }}
                      className="h-14 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Github className="w-5 h-5 text-white" />
                      <span className="text-sm font-bold text-white">GitHub</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">
                    <span className="h-px bg-white/10 flex-1" />
                    or continue with email
                    <span className="h-px bg-white/10 flex-1" />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                        setError(null);
                      }}
                      className={cn(
                        "w-full h-12 rounded-2xl bg-white/5 border px-4 text-sm text-white outline-none focus:border-purple-500/50",
                        emailError ? "border-rose-500/70 focus:border-rose-500/70" : "border-white/10"
                      )}
                      placeholder="you@example.com"
                      required
                    />
                    {emailError ? <p className="text-xs text-rose-300">{emailError}</p> : null}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="username-input" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Username</label>
                    <input
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError(null);
                        setError(null);
                      }}
                      className={cn(
                        "w-full h-12 rounded-2xl bg-white/5 border px-4 text-sm text-white outline-none focus:border-purple-500/50",
                        usernameError ? "border-rose-500/70 focus:border-rose-500/70" : "border-white/10"
                      )}
                      placeholder="e.g. promptmaster"
                      required
                    />
                    {usernameError ? <p className="text-xs text-rose-300">{usernameError}</p> : null}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="password" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Create Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          const nextPassword = e.target.value;
                          setPassword(nextPassword);
                          setPasswordError(null);
                          if (confirmPassword && nextPassword !== confirmPassword) {
                            setConfirmPasswordError(mismatchMessage);
                          } else {
                            setConfirmPasswordError(null);
                          }
                        }}
                        className={cn(
                          "w-full h-12 rounded-2xl bg-white/5 border pl-4 pr-11 text-sm text-white outline-none focus:border-purple-500/50",
                          passwordError || passwordRulesNotMet ? "border-rose-500/70 focus:border-rose-500/70" : "border-white/10"
                        )}
                        placeholder="********"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className={cn("text-xs", passwordRulesNotMet || passwordError ? "text-rose-300" : "text-slate-500")}>{passwordRuleHint}</p>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="confirmPassword" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          const nextConfirmPassword = e.target.value;
                          setConfirmPassword(nextConfirmPassword);
                          if (password && nextConfirmPassword && password !== nextConfirmPassword) {
                            setConfirmPasswordError(mismatchMessage);
                          } else {
                            setConfirmPasswordError(null);
                          }
                        }}
                        className={cn(
                          "w-full h-12 rounded-2xl bg-white/5 border pl-4 pr-11 text-sm text-white outline-none focus:border-purple-500/50",
                          confirmPasswordError ? "border-rose-500/70 focus:border-rose-500/70" : "border-white/10"
                        )}
                        placeholder="********"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {confirmPasswordError ? <p className="text-xs text-rose-300 -mt-2">{confirmPasswordError}</p> : null}
                  {termsError ? <p className="text-xs text-rose-300 -mt-2">{termsError}</p> : null}

                  <label className="inline-flex items-center gap-2.5 text-sm text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        setTermsError(null);
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-500"
                    />
                    I agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-5xl font-black tracking-tight text-white">Pick your path.</h2>
                    <p className="text-slate-400 mt-2">How will you use PromptVault?</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pathOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id)}
                        className={cn(
                          "text-left rounded-2xl border px-4 py-4 transition-all",
                          role === item.id ? "border-purple-500/60 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-purple-500/40"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                            <item.icon className="w-5 h-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-black uppercase tracking-wide text-white">{item.label}</span>
                            <span className="block text-xs text-slate-400 mt-1">{item.sub}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-5xl font-black tracking-tight text-white">Your interests.</h2>
                    <p className="text-slate-400 mt-2">Curating your custom marketplace feed.</p>
                  </div>

                  <div className="space-y-4">
                    {interestGroups.map((group) => (
                      <div key={group.label} className="space-y-2.5">
                        <p className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">{group.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleInterest(item)}
                              className={cn(
                                "px-3.5 h-9 rounded-xl text-sm font-bold border transition-all",
                                interests.includes(item)
                                  ? "bg-purple-500/15 border-purple-500/60 text-purple-300"
                                  : "bg-white/5 border-white/10 text-slate-300 hover:border-purple-500/40"
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="h-12 px-4 rounded-2xl border border-white/10 bg-white/5 text-slate-300 text-xs font-black uppercase tracking-[0.16em] inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={submitting || checkingAvailability}
                    className="h-12 px-6 rounded-2xl bg-purple-600 text-white text-xs font-black uppercase tracking-[0.16em] disabled:opacity-40 inline-flex items-center gap-2 hover:bg-purple-500"
                  >
                    {checkingAvailability ? "Checking Records..." : "Initiate Next Step"} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={submitting || retryAfterSec > 0}
                    className="h-12 px-6 rounded-2xl bg-purple-600 text-white text-xs font-black uppercase tracking-[0.16em] disabled:opacity-40 inline-flex items-center gap-2 hover:bg-purple-500"
                  >
                    {submitting ? "Creating Account..." : retryAfterSec > 0 ? `Retry in ${retryAfterSec}s` : "Create Account"} <Rocket className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            <p className="text-xs text-slate-500">
              Already have an account? <Link href="/sign-in" className="text-purple-400 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
