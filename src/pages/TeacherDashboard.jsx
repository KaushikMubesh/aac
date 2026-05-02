function formatDate(iso, language = "en") {
  return new Date(iso).toLocaleString(language === "ta" ? "ta-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getAccuracy(attempt) {
  return attempt.accuracyPercentage ?? attempt.percentage ?? 0;
}

function getStudentMetrics(student) {
  const attempts = student.attempts ?? [];
  const latest = attempts[attempts.length - 1] ?? null;
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + getAccuracy(attempt), 0) / attempts.length)
    : 0;
  const best = attempts.length ? Math.max(...attempts.map((attempt) => getAccuracy(attempt))) : 0;

  return { attempts, latest, average, best };
}

function buildSparkline(attempts) {
  if (!attempts.length) return "";

  const width = 240;
  const height = 80;
  const step = attempts.length === 1 ? 0 : width / (attempts.length - 1);
  const points = attempts
    .map((attempt, index) => {
      const x = step * index;
      const y = height - (getAccuracy(attempt) / 100) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <svg viewBox="0 0 ${width} ${height}" width="240" height="80" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="#eff6ff" />
      <polyline fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      ${attempts
        .map((attempt, index) => {
          const x = step * index;
          const y = height - (getAccuracy(attempt) / 100) * (height - 8) - 4;
          return `<circle cx="${x}" cy="${y}" r="4" fill="#0f172a" />`;
        })
        .join("")}
    </svg>
  `;
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildReportHtml(students, generatedAt) {
  const studentSections = students
    .map((student) => {
      const { attempts, latest, average, best } = getStudentMetrics(student);
      const rows = attempts.length
        ? attempts
            .map(
              (attempt) => `
                <tr>
                  <td>${formatDate(attempt.completedAt)}</td>
                  <td>${attempt.score}/${attempt.totalQuestions}</td>
                  <td>${getAccuracy(attempt)}%</td>
                  <td>${attempt.totalResponses ?? attempt.totalQuestions}</td>
                  <td>${attempt.durationSeconds}s</td>
                </tr>
              `,
            )
            .join("")
        : `<tr><td colspan="4">No quiz attempts recorded.</td></tr>`;

      return `
        <section class="student-card">
          <div class="student-header">
            <div>
              <h2>${student.name}</h2>
              <p>ID: ${student.studentId} | Age: ${student.age || "-"} | Support Need: ${student.supportNeed || "-"}</p>
            </div>
            <div class="badge">${attempts.length} attempts</div>
          </div>
          <div class="metrics">
            <div class="metric"><span>Latest Accuracy</span><strong>${latest ? `${getAccuracy(latest)}%` : "-"}</strong></div>
            <div class="metric"><span>Average Accuracy</span><strong>${average}%</strong></div>
            <div class="metric"><span>Best Accuracy</span><strong>${best}%</strong></div>
          </div>
          <div class="chart">${buildSparkline(attempts)}</div>
          <table>
            <thead>
              <tr><th>Date</th><th>Score</th><th>Accuracy</th><th>Attempts</th><th>Duration</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>AAC Progress Report</title>
        <style>
          body {
            font-family: "Avenir Next", "Segoe UI", sans-serif;
            margin: 0;
            padding: 32px;
            color: #10233f;
            background: linear-gradient(180deg, #fff8ef 0%, #f4f9ff 100%);
          }
          .report {
            max-width: 1100px;
            margin: 0 auto;
          }
          .hero {
            background: white;
            border-radius: 28px;
            padding: 28px;
            box-shadow: 0 20px 60px rgba(16, 35, 63, 0.12);
            margin-bottom: 24px;
          }
          .hero h1 {
            margin: 0;
            font-size: 34px;
          }
          .hero p {
            color: #475569;
          }
          .student-card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 18px 42px rgba(16, 35, 63, 0.08);
            margin-bottom: 20px;
          }
          .student-header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
          }
          .student-header h2 {
            margin: 0;
          }
          .student-header p {
            margin: 6px 0 0;
            color: #475569;
          }
          .badge {
            background: #e0f2fe;
            color: #0c4a6e;
            padding: 10px 14px;
            border-radius: 999px;
            font-weight: 700;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin: 18px 0;
          }
          .metric {
            background: #f8fafc;
            border-radius: 18px;
            padding: 16px;
          }
          .metric span {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #64748b;
            margin-bottom: 8px;
          }
          .metric strong {
            font-size: 28px;
          }
          .chart {
            margin-bottom: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            text-align: left;
            padding: 12px;
            border-top: 1px solid #e2e8f0;
          }
          th {
            background: #f8fafc;
          }
        </style>
      </head>
      <body>
        <main class="report">
          <section class="hero">
            <h1>AAC Student Progress Report</h1>
            <p>Generated on ${formatDate(generatedAt)}. This report summarizes quiz attendance, latest marks, and progress trends for all students stored in the app.</p>
          </section>
          ${studentSections || "<section class='student-card'><p>No student data available.</p></section>"}
        </main>
      </body>
    </html>
  `;
}

export default function TeacherDashboard({
  setPage,
  language,
  students,
  onTeacherLogout,
}) {
  const isEnglish = language === "en";
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
  const totalAttempts = sortedStudents.reduce(
    (sum, student) => sum + (student.attempts?.length ?? 0),
    0,
  );

  const handleDownload = () => {
    const generatedAt = new Date().toISOString();
    const report = buildReportHtml(sortedStudents, generatedAt);
    downloadBlob("aac-progress-report.html", report, "text/html");
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_25px_90px_rgba(16,35,63,0.12)] backdrop-blur sm:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-900">
              {isEnglish ? "Teacher Dashboard" : "ஆசிரியர் கட்டுப்பாட்டு பலகை"}
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              {isEnglish ? "Student Progress Reports" : "மாணவர் முன்னேற்ற அறிக்கைகள்"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              {isEnglish
                ? "View each student profile, their latest quiz result, and download a complete report with progress graphs."
                : "ஒவ்வொரு மாணவரின் விவரம், சமீபத்திய வினாடி வினா முடிவு மற்றும் முன்னேற்ற வரைபடத்துடன் கூடிய அறிக்கையைப் பார்க்கவும்."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleDownload}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20"
            >
              {isEnglish ? "Download Report" : "அறிக்கையை பதிவிறக்கு"}
            </button>
            <button
              onClick={() => setPage("menu")}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-800 ring-1 ring-slate-200"
            >
              {isEnglish ? "Back to Menu" : "மெனுவிற்கு திரும்பு"}
            </button>
            <button
              onClick={onTeacherLogout}
              className="rounded-full bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-100"
            >
              {isEnglish ? "Teacher Logout" : "ஆசிரியர் வெளியேறு"}
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-sky-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              {isEnglish ? "Students" : "மாணவர்கள்"}
            </div>
            <div className="mt-2 text-3xl font-black text-sky-950">{sortedStudents.length}</div>
          </div>
          <div className="rounded-[1.5rem] bg-amber-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              {isEnglish ? "Quiz Attempts" : "வினா முயற்சிகள்"}
            </div>
            <div className="mt-2 text-3xl font-black text-amber-950">{totalAttempts}</div>
          </div>
          <div className="rounded-[1.5rem] bg-emerald-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {isEnglish ? "Report Type" : "அறிக்கை வகை"}
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-950">
              {isEnglish ? "Graph + History" : "வரைபடம் + வரலாறு"}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {sortedStudents.length ? (
            sortedStudents.map((student) => {
              const { attempts, latest, average, best } = getStudentMetrics(student);

              return (
                <section
                  key={student.studentId}
                  className="rounded-[1.75rem] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{student.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {isEnglish ? "Student ID" : "மாணவர் அடையாள எண்"}: {student.studentId}
                        {" • "}
                        {isEnglish ? "Age" : "வயது"}: {student.age || "-"}
                        {" • "}
                        {isEnglish ? "Support Need" : "ஆதரவு தேவை"}: {student.supportNeed || "-"}
                      </p>
                    </div>

                    <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800">
                      {attempts.length} {isEnglish ? "attempts" : "முயற்சிகள்"}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isEnglish ? "Latest Accuracy" : "சமீபத்திய துல்லியம்"}
                      </div>
                      <div className="mt-2 text-3xl font-black text-slate-950">
                        {latest ? `${getAccuracy(latest)}%` : "-"}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isEnglish ? "Average Accuracy" : "சராசரி துல்லியம்"}
                      </div>
                      <div className="mt-2 text-3xl font-black text-slate-950">{average}%</div>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isEnglish ? "Best Accuracy" : "சிறந்த துல்லியம்"}
                      </div>
                      <div className="mt-2 text-3xl font-black text-slate-950">{best}%</div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[1.5rem] bg-sky-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                        {isEnglish ? "Progress Graph" : "முன்னேற்ற வரைபடம்"}
                      </div>
                      <div
                        className="mt-3 overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html:
                            buildSparkline(attempts) ||
                            `<div class="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">No graph yet</div>`,
                        }}
                      />
                    </div>

                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isEnglish ? "Recent History" : "சமீபத்திய வரலாறு"}
                      </div>
                      <div className="mt-3 grid gap-3">
                        {attempts.length ? (
                          [...attempts].reverse().slice(0, 4).map((attempt, index) => (
                            <div
                              key={`${attempt.completedAt}-${index}`}
                              className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600"
                            >
                              <div className="font-semibold text-slate-900">
                                {attempt.score}/{attempt.totalQuestions} • {getAccuracy(attempt)}% • {attempt.totalResponses ?? attempt.totalQuestions} taps
                              </div>
                              <div className="mt-1">{formatDate(attempt.completedAt, language)}</div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">
                            {isEnglish
                              ? "This student has not completed a quiz yet."
                              : "இந்த மாணவர் இன்னும் வினாடி வினா முடிக்கவில்லை."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] bg-white p-8 text-center text-slate-500 ring-1 ring-slate-100">
              {isEnglish
                ? "No student profiles found yet. Ask a student to log in and complete a quiz first."
                : "இன்னும் மாணவர் விவரங்கள் இல்லை. முதலில் ஒரு மாணவர் உள்நுழைந்து வினாடி வினாவை முடிக்க வேண்டும்."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
