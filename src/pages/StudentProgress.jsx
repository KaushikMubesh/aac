function formatDate(iso, language) {
  return new Date(iso).toLocaleString(language === "ta" ? "ta-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getAccuracy(attempt) {
  return attempt.accuracyPercentage ?? attempt.percentage ?? 0;
}

function ProgressBars({ attempts = [] }) {
  if (!attempts.length) {
    return (
      <div className="rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-500">
        No quiz history yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {attempts.map((attempt, index) => (
        <div key={`${attempt.completedAt}-${index}`} className="rounded-[1.5rem] bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-600">
            <span>Attempt {attempts.length - index}</span>
            <span>{getAccuracy(attempt)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9,#22c55e)]"
              style={{ width: `${getAccuracy(attempt)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudentProgress({ language, student, onTeacherBackRequest }) {
  const isEnglish = language === "en";
  const attempts = [...(student?.attempts ?? [])].reverse();
  const latestAttempt = attempts[0];
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + getAccuracy(attempt), 0) / attempts.length)
    : 0;
  const best = attempts.length ? Math.max(...attempts.map((attempt) => getAccuracy(attempt))) : 0;

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_25px_90px_rgba(16,35,63,0.12)] backdrop-blur sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900">
              {isEnglish ? "Student Progress" : "மாணவர் முன்னேற்றம்"}
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              {student?.name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              {isEnglish
                ? "This page tracks quiz performance over time and helps teachers or guardians review improvement."
                : "இந்தப் பகுதி காலப்போக்கில் வினாடி வினா செயல்திறனைப் பதிவு செய்து முன்னேற்றத்தை காட்டுகிறது."}
            </p>
          </div>

          <button
            onClick={onTeacherBackRequest}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20"
          >
            {isEnglish ? "Teacher Exit" : "ஆசிரியர் வெளியேறு"}
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-sky-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              {isEnglish ? "Attempts" : "முயற்சிகள்"}
            </div>
            <div className="mt-2 text-3xl font-black text-sky-950">{attempts.length}</div>
          </div>

            <div className="rounded-[1.5rem] bg-amber-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              {isEnglish ? "Average Accuracy" : "சராசரி துல்லியம்"}
              </div>
              <div className="mt-2 text-3xl font-black text-amber-950">{average}%</div>
            </div>

          <div className="rounded-[1.5rem] bg-emerald-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {isEnglish ? "Best Accuracy" : "சிறந்த துல்லியம்"}
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-950">{best}%</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.75rem] bg-slate-50 p-5">
            <h2 className="text-xl font-black text-slate-900">
              {isEnglish ? "Profile" : "சுயவிவரம்"}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-slate-900">
                  {isEnglish ? "Student ID: " : "மாணவர் அடையாள எண்: "}
                </span>
                {student?.studentId}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-slate-900">
                  {isEnglish ? "Age: " : "வயது: "}
                </span>
                {student?.age || "-"}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-slate-900">
                  {isEnglish ? "Support Need: " : "ஆதரவு தேவை: "}
                </span>
                {student?.supportNeed || "-"}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-slate-900">
                  {isEnglish ? "Latest Attempt: " : "கடைசி முயற்சி: "}
                </span>
                {latestAttempt ? formatDate(latestAttempt.completedAt, language) : "-"}
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-white p-5 ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-900">
              {isEnglish ? "Progress Trend" : "முன்னேற்ற வரைபடம்"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isEnglish
                ? "Each bar represents one quiz attempt based on answer accuracy."
                : "ஒவ்வொரு பட்டையும் பதில் துல்லியத்தை அடிப்படையாக கொண்ட ஒரு வினாடி வினா முயற்சியை குறிக்கிறது."}
            </p>
            <div className="mt-4">
              <ProgressBars attempts={attempts} />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[1.75rem] bg-white p-5 ring-1 ring-slate-100">
          <h2 className="text-xl font-black text-slate-900">
            {isEnglish ? "Attempt History" : "முயற்சி வரலாறு"}
          </h2>
          <div className="mt-4 overflow-hidden rounded-[1.25rem] ring-1 ring-slate-100">
            <div className="grid grid-cols-5 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
              <span>{isEnglish ? "Date" : "தேதி"}</span>
              <span>{isEnglish ? "Score" : "மதிப்பெண்"}</span>
              <span>{isEnglish ? "Accuracy" : "துல்லியம்"}</span>
              <span>{isEnglish ? "Attempts" : "முயற்சிகள்"}</span>
              <span>{isEnglish ? "Duration" : "நேரம்"}</span>
            </div>
            {attempts.length ? (
              attempts.map((attempt, index) => (
                <div
                  key={`${attempt.completedAt}-${index}`}
                  className="grid grid-cols-5 gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600"
                >
                  <span>{formatDate(attempt.completedAt, language)}</span>
                  <span>
                    {attempt.score} / {attempt.totalQuestions}
                  </span>
                  <span>{getAccuracy(attempt)}%</span>
                  <span>{attempt.totalResponses ?? attempt.totalQuestions}</span>
                  <span>{attempt.durationSeconds}s</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">
                {isEnglish
                  ? "No quiz attempts have been recorded yet."
                  : "இன்னும் எந்த வினாடி வினா முயற்சியும் பதிவு செய்யப்படவில்லை."}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
