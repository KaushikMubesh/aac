import { useState, useEffect } from "react";
import successSound from "../assets/success.mp3";
import { quizQuestions } from "../data/quizQuestions";

export default function Quiz({
  setPage,
  language,
  currentStudent,
  onQuizComplete,
  onTeacherBackRequest,
}) {
  const isEnglish = language === "en";
  const questions = quizQuestions;

  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [incorrectResponses, setIncorrectResponses] = useState(0);
  const [attemptSaved, setAttemptSaved] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const speak = (msg) => {
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = language === "ta" ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (index >= questions.length) {
      const audio = new Audio(successSound);
      audio.play();
    } else {
      speak(questions[index].question[language]);
    }
  }, [index, language]);

  useEffect(() => {
    if (index < questions.length || attemptSaved) return;

    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const percentage = Math.round((score / questions.length) * 100);
    const accuracyPercentage = totalResponses
      ? Math.round((score / totalResponses) * 100)
      : 0;

    onQuizComplete?.({
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      percentage,
      accuracyPercentage,
      totalResponses,
      incorrectResponses,
      durationSeconds,
      studentId: currentStudent?.studentId ?? "",
    });

    setAttemptSaved(true);
  }, [
    attemptSaved,
    currentStudent?.studentId,
    incorrectResponses,
    index,
    onQuizComplete,
    questions.length,
    score,
    startedAt,
    totalResponses,
  ]);

  const current = questions[index];

  const checkAnswer = (option) => {
    setTotalResponses((prev) => prev + 1);

    if (option.en === current.question.en) {
      setMessage(isEnglish ? "Great job! Keep going!" : "சிறப்பு! தொடருங்கள்!");
      speak(isEnglish ? "Great job" : "சிறப்பு");
      setScore((prev) => prev + 1);

      setTimeout(() => {
        setMessage("");
        setIndex((prev) => prev + 1);
      }, 1000);
    } else {
      setIncorrectResponses((prev) => prev + 1);
      setMessage(isEnglish ? "Try again" : "மீண்டும் முயற்சிக்கவும்");
      speak(isEnglish ? "Try again" : "மீண்டும் முயற்சிக்கவும்");
    }
  };

  if (index >= questions.length) {
    const percentage = Math.round((score / questions.length) * 100);
    const accuracyPercentage = totalResponses
      ? Math.round((score / totalResponses) * 100)
      : 0;

    return (
      <div className="min-h-screen px-4 py-6 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-[0_28px_90px_rgba(16,35,63,0.12)] backdrop-blur sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#22c55e,#14b8a6)] text-4xl shadow-[0_18px_40px_rgba(20,184,166,0.28)]">
              ⭐
            </div>
            <h1 className="mt-6 text-4xl font-black text-slate-900">
              {isEnglish ? "Quiz Finished" : "வினாடி வினா முடிந்தது"}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              {isEnglish ? "You completed all questions." : "அனைத்து கேள்விகளையும் முடித்துவிட்டீர்கள்."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[1.5rem] bg-sky-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {isEnglish ? "Score" : "மதிப்பெண்"}
                </div>
                <div className="mt-2 text-4xl font-black text-sky-950">
                  {score} / {questions.length}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-emerald-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {isEnglish ? "Completion" : "முடித்த சதவீதம்"}
                </div>
                <div className="mt-2 text-4xl font-black text-emerald-950">
                  {percentage}%
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-violet-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
                  {isEnglish ? "Accuracy" : "துல்லியம்"}
                </div>
                <div className="mt-2 text-4xl font-black text-violet-950">
                  {accuracyPercentage}%
                </div>
              </div>ELJnccsvl

              <div className="rounded-[1.5rem] bg-rose-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                  {isEnglish ? "Total Taps" : "மொத்த முயற்சிகள்"}
                </div>
                <div className="mt-2 text-4xl font-black text-rose-950">
                  {totalResponses}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setIndex(0);
                  setScore(0);
                  setTotalResponses(0);
                  setIncorrectResponses(0);
                  setMessage("");
                  setAttemptSaved(false);
                  setStartedAt(Date.now());
                }}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20"
              >
                {isEnglish ? "Restart Quiz" : "வினாடி வினாவை மீண்டும் தொடங்கு"}
              </button>

              <button
                onClick={onTeacherBackRequest}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-800 ring-1 ring-slate-200"
              >
                {isEnglish ? "Teacher Exit" : "ஆசிரியர் வெளியேறு"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_25px_90px_rgba(16,35,63,0.12)] backdrop-blur sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">
              {isEnglish ? "Interactive Practice" : "தொடர்பாடல் பயிற்சி"}
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              {isEnglish ? "Learning Quiz" : "கற்றல் வினாடி வினா"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              {isEnglish
                ? "Listen, observe, and choose the correct image."
                : "கேட்டு, கவனித்து, சரியான படத்தைத் தேர்ந்தெடுக்கவும்."}
            </p>
            {currentStudent && (
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {isEnglish ? "Student" : "மாணவர்"}: {currentStudent.name} ({currentStudent.studentId})
              </p>
            )}
          </div>

          <button
            onClick={onTeacherBackRequest}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20"
          >
            {isEnglish ? "Teacher Exit" : "ஆசிரியர் வெளியேறு"}
          </button>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#f59e0b,#f97316,#fb7185)] p-6 text-white shadow-[0_20px_55px_rgba(249,115,22,0.26)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                  {isEnglish ? "Question" : "கேள்வி"}
                </p>
                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {isEnglish ? `Find: ${current.question[language]}` : `கண்டுபிடிக்கவும்: ${current.question[language]}`}
                </p>
              </div>
              <div className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
                {index + 1} / {questions.length}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-[1.5rem] bg-sky-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {isEnglish ? "Score" : "மதிப்பெண்"}
              </div>
              <div className="mt-2 text-3xl font-black text-sky-950">{score}</div>
            </div>

            <div className="rounded-[1.5rem] bg-violet-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
                {isEnglish ? "Accuracy" : "துல்லியம்"}
              </div>
              <div className="mt-2 text-3xl font-black text-violet-950">
                {totalResponses ? Math.round((score / totalResponses) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => checkAnswer(opt)}
              className="group rounded-[1.75rem] border border-white bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(249,115,22,0.16)]"
            >
              <div className="overflow-hidden rounded-[1.35rem] bg-slate-100">
                <img
                  src={opt.img}
                  alt={opt[language]}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-lg font-bold text-slate-800">
                {opt[language]}
              </div>
            </button>
          ))}
        </div>

        {message && (
          <div
            className={`mt-6 rounded-[1.5rem] px-5 py-4 text-center text-lg font-bold ${
              message.includes("Try") || message.includes("மீண்டும்")
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}