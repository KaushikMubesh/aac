import { useState } from "react";

function StudentAuthCard({ language, onStudentAccess, studentNotice }) {
  const isEnglish = language === "en";
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    age: "",
    supportNeed: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onStudentAccess(form);
  };

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_rgba(16,35,63,0.12)] backdrop-blur md:p-8">
      <div className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-900">
        {isEnglish ? "Student Access" : "மாணவர் அணுகல்"}
      </div>
      <h2 className="mt-4 text-3xl font-black text-slate-900">
        {isEnglish ? "Create or open a student profile" : "மாணவர் சுயவிவரத்தை உருவாக்கவும் அல்லது திறக்கவும்"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        {isEnglish
          ? "Enter the student details once. The app will remember quiz attempts and overall progress for the same student ID."
          : "மாணவர் விவரங்களை ஒரு முறை உள்ளிடுங்கள். அதே மாணவர் அடையாள எண்ணுக்கான வினாடி வினா முன்னேற்றம் சேமிக்கப்படும்."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            {isEnglish ? "Student Name" : "மாணவர் பெயர்"}
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              placeholder={isEnglish ? "Enter name" : "பெயரை உள்ளிடவும்"}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            {isEnglish ? "Student ID" : "மாணவர் அடையாள எண்"}
            <input
              value={form.studentId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, studentId: event.target.value.toUpperCase() }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              placeholder={isEnglish ? "Ex: STU101" : "உதா: STU101"}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.4fr_1fr]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            {isEnglish ? "Age" : "வயது"}
            <input
              value={form.age}
              onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              placeholder={isEnglish ? "Age" : "வயது"}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            {isEnglish ? "Support Need / Condition" : "ஆதரவு தேவை / நிலை"}
            <input
              value={form.supportNeed}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, supportNeed: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              placeholder={
                isEnglish
                  ? "Ex: Speech delay, autism support, assisted communication"
                  : "உதா: பேச்சு தாமதம், autism support"
              }
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20"
        >
          {isEnglish ? "Continue as Student" : "மாணவராக தொடரவும்"}
        </button>
      </form>

      {studentNotice && (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {studentNotice}
        </div>
      )}
    </section>
  );
}

function TeacherLoginCard({
  language,
  onTeacherLogin,
  teacherError,
  teacherLoggedIn,
  onTeacherOpen,
  teacherCredentials,
}) {
  const isEnglish = language === "en";
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    onTeacherLogin(form);
  };

  return (
    <section className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:p-8">
      <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200">
        {isEnglish ? "Teacher Login" : "ஆசிரியர் உள்நுழைவு"}
      </div>
      <h2 className="mt-4 text-3xl font-black">
        {isEnglish ? "Monitor progress and export reports" : "முன்னேற்றத்தை கண்காணித்து அறிக்கைகளை பதிவிறக்கவும்"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
        {isEnglish
          ? "Teachers can view the latest student marks, past progress, and download a report with graphs."
          : "ஆசிரியர்கள் சமீபத்திய மதிப்பெண்கள், முந்தைய முன்னேற்றம் மற்றும் வரைபட அறிக்கைகளை பார்க்கலாம்."}
      </p>

      {teacherLoggedIn ? (
        <button
          onClick={onTeacherOpen}
          className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900"
        >
          {isEnglish ? "Open Teacher Dashboard" : "ஆசிரியர் பலகையை திறக்கவும்"}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-100">
            {isEnglish ? "Username" : "பயனர் பெயர்"}
            <input
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 outline-none"
              placeholder={teacherCredentials.username}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-100">
            {isEnglish ? "Password" : "கடவுச்சொல்"}
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 outline-none"
              placeholder={teacherCredentials.password}
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900"
          >
            {isEnglish ? "Login as Teacher" : "ஆசிரியராக உள்நுழைக"}
          </button>
        </form>
      )}

      {teacherError && (
        <div className="mt-4 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-200">
          {teacherError}
        </div>
      )}

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
        <div className="font-bold text-white">
          {isEnglish ? "Demo credentials" : "டெமோ உள்நுழைவு"}
        </div>
        <div>{isEnglish ? "Username" : "பயனர் பெயர்"}: {teacherCredentials.username}</div>
        <div>{isEnglish ? "Password" : "கடவுச்சொல்"}: {teacherCredentials.password}</div>
      </div>
    </section>
  );
}

function StudentPortal({ language, currentStudent, setPage, onStudentLogout }) {
  const isEnglish = language === "en";
  const attempts = currentStudent.attempts ?? [];
  const latest = attempts[attempts.length - 1];
  const average = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) => sum + (attempt.accuracyPercentage ?? attempt.percentage ?? 0),
          0,
        ) / attempts.length,
      )
    : 0;

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_rgba(16,35,63,0.12)] backdrop-blur md:p-8 lg:p-10">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold tracking-wide text-white">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        {isEnglish ? "Student Dashboard" : "மாணவர் பலகை"}
      </div>

      <h1 className="max-w-2xl text-4xl font-black leading-tight text-slate-900 md:text-5xl">
        {currentStudent.name}
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        {isEnglish
          ? "Use the communication board, practice the quiz regularly, and keep track of progress over time."
          : "தொடர்பு பலகையை பயன்படுத்தி, வினாடி வினாவை தொடர்ந்து பயிற்சி செய்து, காலப்போக்கில் முன்னேற்றத்தை கவனிக்கவும்."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] bg-sky-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            {isEnglish ? "Student ID" : "அடையாள எண்"}
          </div>
          <div className="mt-2 text-2xl font-black text-sky-950">{currentStudent.studentId}</div>
        </div>
        <div className="rounded-[1.75rem] bg-amber-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            {isEnglish ? "Latest Accuracy" : "கடைசி துல்லியம்"}
          </div>
          <div className="mt-2 text-2xl font-black text-amber-950">
            {latest ? `${latest.accuracyPercentage ?? latest.percentage ?? 0}%` : "-"}
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-emerald-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {isEnglish ? "Average Accuracy" : "சராசரி துல்லியம்"}
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-950">{average}%</div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setPage("home")}
          className="rounded-[1.75rem] bg-[linear-gradient(135deg,#155eef,#3b82f6,#7dd3fc)] p-6 text-left text-white shadow-[0_22px_45px_rgba(21,94,239,0.25)] transition duration-300 hover:-translate-y-1"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {isEnglish ? "Speak" : "பேசு"}
          </div>
          <div className="mt-3 text-2xl font-black">
            {isEnglish ? "Communication Board" : "தொடர்பு பலகை"}
          </div>
        </button>

        <button
          onClick={() => setPage("quiz")}
          className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f59e0b,#f97316,#fb7185)] p-6 text-left text-white shadow-[0_22px_45px_rgba(249,115,22,0.25)] transition duration-300 hover:-translate-y-1"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {isEnglish ? "Practice" : "பயிற்சி"}
          </div>
          <div className="mt-3 text-2xl font-black">
            {isEnglish ? "Learning Quiz" : "கற்றல் வினாடி வினா"}
          </div>
        </button>

        <button
          onClick={() => setPage("progress")}
          className="rounded-[1.75rem] bg-[linear-gradient(135deg,#0f766e,#14b8a6,#67e8f9)] p-6 text-left text-white shadow-[0_22px_45px_rgba(20,184,166,0.24)] transition duration-300 hover:-translate-y-1"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {isEnglish ? "Track" : "பதிவு"}
          </div>
          <div className="mt-3 text-2xl font-black">
            {isEnglish ? "My Progress" : "என் முன்னேற்றம்"}
          </div>
        </button>
      </div>

      <button
        onClick={onStudentLogout}
        className="mt-8 rounded-full bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-100"
      >
        {isEnglish ? "Switch Student" : "மாணவரை மாற்று"}
      </button>
    </section>
  );
}

export default function MainMenu({
  setPage,
  language,
  setLanguage,
  currentStudent,
  onStudentAccess,
  onStudentLogout,
  onTeacherLogin,
  onTeacherOpen,
  teacherLoggedIn,
  teacherError,
  studentNotice,
  teacherCredentials,
  cloudStatus,
  isLoadingStudents,
  isFirebaseReady,
}) {
  const isEnglish = language === "en";

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_62%)]" />
      <div className="absolute left-[-6rem] top-20 -z-10 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="absolute bottom-16 right-[-4rem] -z-10 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold tracking-wide text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              {isEnglish ? "AAC Learning Portal" : "AAC கற்றல் மையம்"}
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
              {isEnglish ? "Assistive Communication and Progress Tracking" : "உதவி தொடர்பும் முன்னேற்றப் பதிவும்"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                isEnglish
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              English
            </button>

            <button
              onClick={() => setLanguage("ta")}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                !isEnglish
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        <div
          className={`mb-6 rounded-[1.5rem] px-5 py-4 text-sm font-semibold ${
            isFirebaseReady
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {isLoadingStudents
            ? isEnglish
              ? "Connecting to Firebase cloud storage..."
              : "Firebase cloud storage-க்கு இணைக்கப்படுகிறது..."
            : cloudStatus}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {currentStudent ? (
            <StudentPortal
              language={language}
              currentStudent={currentStudent}
              setPage={setPage}
              onStudentLogout={onStudentLogout}
            />
          ) : (
            <StudentAuthCard
              language={language}
              onStudentAccess={onStudentAccess}
              studentNotice={studentNotice}
            />
          )}

          <div className="grid gap-4">
            <TeacherLoginCard
              language={language}
              onTeacherLogin={onTeacherLogin}
              teacherError={teacherError}
              teacherLoggedIn={teacherLoggedIn}
              onTeacherOpen={onTeacherOpen}
              teacherCredentials={teacherCredentials}
            />

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                {
                  value: "Profiles",
                  label: isEnglish ? "Student accounts saved locally" : "மாணவர் விவரங்கள் சேமிப்பு",
                  tone: "bg-emerald-100 text-emerald-950",
                },
                {
                  value: "Reports",
                  label: isEnglish ? "Graph-based teacher export" : "வரைபட ஆசிரியர் அறிக்கை",
                  tone: "bg-sky-100 text-sky-950",
                },
                {
                  value: "Progress",
                  label: isEnglish ? "Quiz history over time" : "காலமுறை வினா வரலாறு",
                  tone: "bg-amber-100 text-amber-950",
                },
              ].map((item) => (
                <div
                  key={item.value}
                  className={`rounded-[1.75rem] p-5 shadow-lg shadow-slate-200/60 ${item.tone}`}
                >
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-1 text-sm font-semibold leading-6">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
