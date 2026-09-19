import React, { useState, useRef } from "react";
import { db } from "../firebase"; // 👈 adjust path if your firebase.js is elsewhere
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import ReCAPTCHA from "react-google-recaptcha";

const EVENTS = {
  "Paper Presentation": { type: "team", members: 4, required: 1, category: "Technical" },
  "Web Design": { type: "solo", category: "Technical" },
  "SQL Query": { type: "solo", category: "Technical" },
  "Tech Quiz": { type: "team", members: 2, required: 1, category: "Technical" },
  "Logo Identification": { type: "solo", category: "Semi-Technical" },
  "Chess": { type: "solo", category: "Esports" },
  "Vision Void": { type: "team", members: 2, required: 2, category: "Non-Tech" },
  "Minute to Win It": { type: "team", members: 2, required: 2, category: "Non-Tech" },
};

const CATEGORIES = ["Technical", "Semi-Technical", "Esports", "Non-Tech"];
const STEP_LABELS = ["Basic details", "Event count", "Events", "Team", "Payment"];

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');
.font-orbitron { font-family: 'Orbitron', monospace; }
.font-rajdhani { font-family: 'Rajdhani', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
select option { background: #0c0a00; color: #f0f00c; }
@keyframes shimmerText {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer-text {
  background: linear-gradient(90deg, #f0f00c 0%, #ffffff 50%, #f0f00c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmerText 2s linear infinite;
}
`;

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <label className="text-[12px] tracking-[2px] text-[#f0f00c]/70 uppercase font-rajdhani">
        {label}
      </label>
      {children}
      {error && <p className="text-[#ff4d4d] text-[11px] tracking-wide mt-1">{error}</p>}
    </div>
  );
}

const inputBase =
  "w-full bg-black/80 border font-rajdhani text-[15px] text-[#f0f00c] px-4 py-3 outline-none transition-colors placeholder:text-[#f0f00c]/30 focus:shadow-[0_0_12px_rgba(240,240,12,0.25)]";

function inputClass(hasError) {
  return `${inputBase} ${hasError ? "border-[#ff4d4d]" : "border-[#f0f00c]/30 focus:border-[#f0f00c]"}`;
}

function CheckBox({ checked }) {
  return (
    <span
      className={`w-[18px] h-[18px] flex-shrink-0 border flex items-center justify-center transition-all ${
        checked ? "bg-[#f0f00c] border-[#f0f00c]" : "border-[#f0f00c]/40"
      }`}
    >
      {checked && <span className="w-[8px] h-[8px] bg-black" />}
    </span>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    food: "",
  });
  const [errors, setErrors] = useState({});
  const [pkg, setPkg] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [teamToast, setTeamToast] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const refs = {
    fullName: useRef(),
    email: useRef(),
    phone: useRef(),
    college: useRef(),
    department: useRef(),
  };
  const memberRefs = useRef({});

  const teamEventsChosen = selectedEvents.filter((e) => EVENTS[e].type === "team");
  const needsTeamStep = teamEventsChosen.length > 0;

  function validatePage1() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Fill your full name to continue.";
    if (!form.email.trim()) e.email = "Enter your email to continue.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Enter your number to continue.";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number.";
    if (!form.college.trim()) e.college = "Fill your college name to continue.";
    if (!form.department.trim()) e.department = "Fill your department to continue.";
    if (!form.year) e.year = "Select your year of study.";
    if (!form.food) e.food = "Select a food preference.";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first && refs[first]?.current) refs[first].current.focus();
    return Object.keys(e).length === 0;
  }

  function validateTeamStep() {
    for (const ev of teamEventsChosen) {
      const required = EVENTS[ev].required;
      const names = teamMembers[ev] || [];
      for (let i = 0; i < required; i++) {
        if (!names[i] || !names[i].trim()) {
          setTeamToast(`Fill member ${i + 1}'s name for ${ev}.`);
          const key = `${ev}-${i}`;
          memberRefs.current[key]?.focus();
          setTimeout(() => setTeamToast(""), 3000);
          return false;
        }
      }
    }
    return true;
  }

  function canProceed() {
    if (step === 1) return true;
    if (step === 2) return !!pkg;
    if (step === 3) return !!pkg && selectedEvents.length === pkg.count;
    if (step === 4) return true;
    return true;
  }

  function goNext() {
    if (step === 1 && !validatePage1()) return;
    if (step === 2 && !pkg) return;
    if (step === 3 && (!pkg || selectedEvents.length !== pkg.count)) return;
    if (step === 4 && !validateTeamStep()) return;
    let next = step + 1;
    if (next === 4 && !needsTeamStep) next = 5;
    setStep(next);
  }

  function goBack() {
    let prev = step - 1;
    if (prev === 4 && !needsTeamStep) prev = 3;
    setStep(Math.max(1, prev));
  }

  function toggleEvent(name) {
    setSelectedEvents((prev) => {
      if (prev.includes(name)) return prev.filter((e) => e !== name);
      if (pkg && prev.length >= pkg.count) return prev;
      return [...prev, name];
    });
  }

  function setTeamMemberName(event, idx, value) {
    setTeamMembers((prev) => {
      const arr = [...(prev[event] || Array(EVENTS[event].members).fill(""))];
      arr[idx] = value;
      return { ...prev, [event]: arr };
    });
  }

  function handleScreenshot(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!transactionId.trim()) return setPaymentError("Enter your transaction / UPI ID before submitting.");
    if (!screenshot) return setPaymentError("Upload your payment screenshot before submitting.");
    if (!captchaToken) return setPaymentError("Please tick \"I'm not a robot\" before submitting.");
    setPaymentError("");
    setSubmitError("");
    setSubmitting(true);

    const generatedId = "REG-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    try {
      await addDoc(collection(db, "registrations"), {
        regId: generatedId,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        college: form.college,
        department: form.department,
        year: form.year,
        food: form.food,
        package: pkg,
        selectedEvents,
        teamMembers,
        transactionId,
        screenshot,
        createdAt: serverTimestamp(),
      });

      setRegId(generatedId);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong while saving your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const nextDisabled = !canProceed();

  return (
    <>
      <Hero />
      <div className="min-h-screen bg-black text-[#f0f00c] font-rajdhani px-4 py-16 relative overflow-hidden">
        <style>{FONT_IMPORT}</style>

        {/* Cyber Yellow Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(240,240,12,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,12,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {teamToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0d0c00] border border-[#ff4d4d] text-[#ff4d4d] px-6 py-3 text-[14px] tracking-wide shadow-lg">
            {teamToast}
          </div>
        )}

        <div className="relative max-w-[760px] mx-auto">
          {!submitted && (
            <>
              <div className="text-center mb-12">
                <h2 className="font-[Krona_One] text-[clamp(1.4rem,4vw,2.2rem)] text-white tracking-[4px]">
                  EVENT <span className="text-[#f0f00c]">REGISTRATION</span>
                </h2>
                <p className="text-[14px] text-[#f0f00c]/60 tracking-[2px] mt-2">
                  Fill all steps to complete your registration
                </p>
              </div>

              {/* Stepper Header */}
              <div className="flex items-center justify-center mb-12">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const isSkipped = n === 4 && !needsTeamStep;
                  const active = n === step;
                  const done = n < step;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center font-orbitron text-[13px] transition-all
                            ${active ? "border-[#f0f00c] text-[#f0f00c] bg-[#f0f00c]/10 shadow-[0_0_20px_rgba(240,240,12,0.4)]" : ""}
                            ${done ? "border-[#a3a308] bg-[#a3a308]/20 text-[#a3a308]" : ""}
                            ${!active && !done ? "border-[#f0f00c]/20 bg-[#0a0a00] text-[#f0f00c]/30" : ""}
                            ${isSkipped ? "opacity-40" : ""}`}
                        >
                          {n}
                        </div>
                        <span
                          className={`text-[10px] tracking-[2px] uppercase whitespace-nowrap ${
                            active ? "text-[#f0f00c]" : "text-[#f0f00c]/40"
                          } ${isSkipped ? "opacity-40" : ""}`}
                        >
                          {isSkipped ? "Team (n/a)" : label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`w-[60px] h-px -mt-6 ${n < step ? "bg-[#f0f00c]" : "bg-[#f0f00c]/20"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}

          {/* Form Card */}
          <div className="relative bg-black/90 border border-[#f0f00c]/30 backdrop-blur-md p-10 shadow-[0_0_30px_rgba(240,240,12,0.05)]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f0f00c] to-transparent" />

            {submitted ? (
              <div className="text-center py-10">
                <div className="text-[64px] mb-4">🎉</div>
                <p className="font-orbitron text-[2rem] text-[#f0f00c] tracking-[3px] mb-6">
                  Registration Successful!
                </p>
                <div className="inline-block mb-6 px-10 py-5 border border-[#f0f00c]/60 bg-[#f0f00c]/5">
                  <span className="font-orbitron shimmer-text tracking-[4px] text-[18px]">{regId}</span>
                </div>
                <p className="text-[15px] text-[#f0f00c]/70 leading-relaxed">
                  Your registration has been confirmed.
                  <br />
                  Check your email at <span className="text-white font-bold">{form.email}</span> for confirmation details.
                  <br />
                  See you at the fest! 🚀
                </p>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div>
                    <div className="font-orbitron text-[16px] text-[#f0f00c] tracking-[3px] uppercase mb-7">
                      Basic Details
                    </div>
                    <Field label="Full name" error={errors.fullName}>
                      <input ref={refs.fullName} className={inputClass(errors.fullName)} placeholder="Your full name"
                        value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input ref={refs.email} className={inputClass(errors.email)} placeholder="you@college.edu"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Field>
                    <Field label="Phone number" error={errors.phone}>
                      <input
                        ref={refs.phone}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        className={inputClass(errors.phone)}
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm({ ...form, phone: digitsOnly });
                        }}
                      />
                    </Field>
                    <Field label="College" error={errors.college}>
                      <input ref={refs.college} className={inputClass(errors.college)} placeholder="Your college name"
                        value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                    </Field>
                    <Field label="Department" error={errors.department}>
                      <input ref={refs.department} className={inputClass(errors.department)} placeholder="CSE / ECE / ..."
                        value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Year of study" error={errors.year}>
                        <select className={inputClass(errors.year)} value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}>
                          <option value="">Select year</option>
                          <option value="1">1st year</option>
                          <option value="2">2nd year</option>
                          <option value="3">3rd year</option>
                          <option value="4">4th year</option>
                        </select>
                      </Field>
                      <Field label="Food preference" error={errors.food}>
                        <select className={inputClass(errors.food)} value={form.food}
                          onChange={(e) => setForm({ ...form, food: e.target.value })}>
                          <option value="">Select preference</option>
                          <option value="veg">Veg</option>
                          <option value="non-veg">Non-veg</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="font-orbitron text-[16px] text-[#f0f00c] tracking-[3px] uppercase mb-1">
                      How many events?
                    </div>
                    <p className="text-[13px] text-[#f0f00c]/50 tracking-wide mb-6">Select your participation package</p>
                    <div className="grid grid-cols-2 gap-5">
                      {[{ count: 4, price: 200 }, { count: 5, price: 250 }].map((opt) => (
                        <button key={opt.count}
                          onClick={() => { setPkg(opt); setSelectedEvents([]); }}
                          className={`border p-7 text-center transition-all ${
                            pkg?.count === opt.count
                              ? "border-[#f0f00c] shadow-[0_0_25px_rgba(240,240,12,0.2)] bg-[#f0f00c]/10"
                              : "border-[#f0f00c]/20 hover:border-[#f0f00c]/40"
                          }`}
                        >
                          <div className="font-orbitron text-[2.2rem] font-black text-[#f0f00c]">{opt.count}</div>
                          <div className="text-[13px] tracking-[2px] text-[#f0f00c]/70 mt-1">EVENTS</div>
                          <div className="font-orbitron text-[1.3rem] text-white mt-3">₹{opt.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="font-orbitron text-[16px] text-[#f0f00c] tracking-[3px] uppercase mb-1">
                      Select your events
                    </div>
                    <p className="text-[13px] text-[#f0f00c]/50 text-center mb-5">
                      Selected: <span className="text-[#f0f00c] font-orbitron">{selectedEvents.length}</span> /{" "}
                      <span className="text-[#f0f00c] font-orbitron">{pkg ? pkg.count : "-"}</span> events
                    </p>
                    <div className="scrollbar-hide">
                      {CATEGORIES.map((cat) => (
                        <div key={cat} className="mb-6">
                          <div className="text-[11px] tracking-[4px] text-white uppercase mb-3 pb-1 border-b border-[#f0f00c]/20">
                            {cat}
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            {Object.entries(EVENTS)
                              .filter(([, v]) => v.category === cat)
                              .map(([name, meta]) => {
                                const checked = selectedEvents.includes(name);
                                const disable = !checked && pkg && selectedEvents.length >= pkg.count;
                                return (
                                  <label key={name}
                                    className={`border px-4 py-3 flex items-center gap-3 transition-all ${
                                      checked ? "border-[#f0f00c] bg-[#f0f00c]/10" : "border-[#f0f00c]/20"
                                    } ${disable ? "opacity-35 cursor-not-allowed" : "cursor-pointer hover:border-[#f0f00c]/50"}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!disable) toggleEvent(name);
                                    }}
                                  >
                                    <CheckBox checked={checked} />
                                    <span className="flex-1">
                                      <div className="text-[13px] text-white">{name}</div>
                                      <div className="text-[10px] text-[#f0f00c]/50 tracking-wide">
                                        {meta.type === "team" ? "Team event" : "Solo event"}
                                      </div>
                                    </span>
                                    <span
                                      className={`text-[9px] tracking-[2px] px-2 py-0.5 border ${
                                        meta.type === "team"
                                          ? "bg-[#f0f00c]/20 text-[#f0f00c] border-[#f0f00c]/40"
                                          : "bg-white/5 text-white/70 border-white/20"
                                      }`}
                                    >
                                      {meta.type === "team" ? "TEAM" : "SOLO"}
                                    </span>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && needsTeamStep && (
                  <div>
                    <div className="font-orbitron text-[16px] text-[#f0f00c] tracking-[3px] uppercase mb-6">
                      Team Details
                    </div>
                    {teamEventsChosen.map((ev) => (
                      <div key={ev} className="border border-[#f0f00c]/20 p-6 mb-6 bg-black/40">
                        <div className="font-orbitron text-[13px] text-[#f0f00c] tracking-[2px] mb-1">{ev}</div>
                        <div className="text-[12px] text-[#f0f00c]/50 tracking-wide mb-4">
                          {EVENTS[ev].required} member{EVENTS[ev].required > 1 ? "s" : ""} required
                          {EVENTS[ev].members > EVENTS[ev].required &&
                            ` (up to ${EVENTS[ev].members} total, rest optional)`}
                        </div>
                        {Array.from({ length: EVENTS[ev].members }).map((_, i) => (
                          <input
                            key={i}
                            ref={(el) => (memberRefs.current[`${ev}-${i}`] = el)}
                            className={`${inputClass(false)} mb-3`}
                            placeholder={
                              i < EVENTS[ev].required ? `Member ${i + 1} name (required)` : `Member ${i + 1} name (optional)`
                            }
                            value={(teamMembers[ev] || [])[i] || ""}
                            onChange={(e) => setTeamMemberName(ev, i, e.target.value)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <div className="font-orbitron text-[16px] text-[#f0f00c] tracking-[3px] uppercase mb-6">
                      Payment
                    </div>
                    <div className="text-center border border-[#f0f00c]/20 p-8 mb-7 bg-[#f0f00c]/5">
                      <div className="w-[200px] h-[200px] border-2 border-dashed border-[#f0f00c]/30 mx-auto mb-4 flex items-center justify-center bg-black/50">
                        <span className="text-[#f0f00c]/40 text-[12px] tracking-[2px]">QR CODE HERE</span>
                      </div>
                      <div className="font-orbitron text-[2rem] text-[#f0f00c]">₹{pkg ? pkg.price : "-"}</div>
                      <div className="text-[11px] tracking-[3px] text-[#f0f00c]/50 mt-1">AMOUNT DUE</div>
                    </div>
                    <Field label="Transaction / UPI ID">
                      <input className={inputClass(false)} placeholder="Enter transaction ID"
                        value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                    </Field>
                    <Field label="Payment screenshot">
                      <div className="border border-dashed border-[#f0f00c]/30 p-7 text-center relative hover:border-[#f0f00c] transition-colors bg-black/40">
                        <input type="file" accept="image/*" onChange={handleScreenshot}
                          className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="text-[13px] text-[#f0f00c]/60 tracking-wide">Click to upload screenshot</div>
                      </div>
                    </Field>
                    {screenshot && (
                      <img src={screenshot} alt="Payment screenshot preview" className="max-w-full mt-2 border border-[#f0f00c]/30" />
                    )}
                    <div className="mt-6 flex justify-center">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY}
                        theme="dark"
                        onChange={(token) => setCaptchaToken(token)}
                        onExpired={() => setCaptchaToken(null)}
                      />
                    </div>
                    {paymentError && <p className="text-[#ff4d4d] text-[12px] mt-3">{paymentError}</p>}
                    {submitError && <p className="text-[#ff4d4d] text-[12px] mt-3">{submitError}</p>}
                  </div>
                )}

                <div className="flex justify-between items-center mt-9 pt-6 border-t border-[#f0f00c]/20">
                  <button onClick={goBack} disabled={step === 1}
                    className={`border border-[#f0f00c]/20 px-7 py-3 text-[14px] tracking-[2px] uppercase transition-colors ${
                      step === 1 ? "text-[#f0f00c]/20 cursor-not-allowed border-transparent" : "text-[#f0f00c]/70 hover:text-[#f0f00c] hover:border-[#f0f00c]/60"
                    }`}
                  >
                    ← Back
                  </button>
                  {step < 5 ? (
                    <button
                      onClick={goNext}
                      disabled={nextDisabled}
                      className={`border font-orbitron px-9 py-3 text-[13px] tracking-[3px] uppercase transition-colors ${
                        nextDisabled
                          ? "border-[#f0f00c]/15 text-[#f0f00c]/20 cursor-not-allowed"
                          : "border-[#f0f00c] text-[#f0f00c] hover:bg-[#f0f00c] hover:text-black font-bold"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={submitting}
                      className={`font-orbitron font-bold px-12 py-3.5 text-[14px] tracking-[3px] uppercase transition-colors ${
                        submitting
                          ? "bg-[#f0f00c]/40 text-black/60 cursor-not-allowed"
                          : "bg-[#f0f00c] text-black hover:bg-[#d4d40b] shadow-[0_0_15px_rgba(240,240,12,0.4)]"
                      }`}>
                      {submitting ? "Registering..." : "Submit Registration"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}