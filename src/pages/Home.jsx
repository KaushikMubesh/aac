import { useState } from "react";

import bye from "../assets/bye.png";
import dance from "../assets/dance.jpeg";
import dont from "../assets/dont.png";
import food from "../assets/food.jpg";
import happy from "../assets/happy.jpg";
import help from "../assets/help.jpg";
import hug from "../assets/hug.webp";
import like from "../assets/like.jpg";
import medicine from "../assets/medicine.jpg";
import more from "../assets/more.png";
import music from "../assets/music.jpg";
import no from "../assets/no.png";
import play from "../assets/play.jpg";
import sleep from "../assets/sleep.jpg";
import spoon from "../assets/spoon.jpg";
import thankyou from "../assets/tnankyou.jpg";
import toilet from "../assets/toilet.jpg";
import toy from "../assets/toy.jpg";
import tv from "../assets/tv.jpg";
import water from "../assets/water.jpg";
import yes from "../assets/yes.png";
import { extraCommunicationItems } from "../data/extraCommunicationItems";

const timeBasedLabelGroups = {
  morning: [
    "Wake up",
    "Brush teeth",
    "Bath",
    "Wash hands",
    "Get dressed",
    "Shoes",
    "Bag",
    "Milk",
    "Bread",
    "Rice",
    "School",
    "Bus",
    "Mother",
    "Father",
    "Teacher",
    "Water",
    "Toilet",
    "Help",
  ],
  afternoon: [
    "Food",
    "Water",
    "Rice",
    "Vegetables",
    "Juice",
    "Toilet",
    "Rest",
    "Sleep",
    "Play",
    "Toy",
    "Ball",
    "Puzzle",
    "Friend",
    "Teacher",
    "Question",
    "Answer",
    "Happy",
    "Medicine",
  ],
  evening: [
    "Home",
    "Park",
    "Play",
    "Music",
    "Dance",
    "TV",
    "Story",
    "Hug",
    "Thank you",
    "Toy",
    "Ball",
    "Sing",
    "Share",
    "Food",
    "Water",
    "Bath",
    "Calm",
  ],
  night: [
    "Food",
    "Water",
    "Medicine",
    "Sleep time",
    "Sleep",
    "Bed",
    "Bath",
    "Brush teeth",
    "Wash hands",
    "Mother",
    "Father",
    "Hug",
    "Bye",
    "Thank you",
    "Calm",
    "Tired",
    "Toilet",
  ],
};

function getTimeSlot() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export default function Home({
  language,
  currentStudent,
  onTeacherBackRequest,
  teacherPassword,
}) {
  const [text, setText] = useState("");
  const [timeModeEnabled, setTimeModeEnabled] = useState(false);
  const [showTimeModeModal, setShowTimeModeModal] = useState(false);
  const [timeModePassword, setTimeModePassword] = useState("");
  const [timeModeError, setTimeModeError] = useState("");
  const isEnglish = language === "en";

  const speak = (msg) => {
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = language === "ta" ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(speech);
  };

  const buttons = [
    { label: { en: "Water", ta: "தண்ணீர்" }, img: water },
    { label: { en: "Food", ta: "உணவு" }, img: food },
    { label: { en: "Toilet", ta: "கழிப்பறை" }, img: toilet },
    { label: { en: "Help", ta: "உதவி" }, img: help },
    { label: { en: "Yes", ta: "ஆம்" }, img: yes },
    { label: { en: "No", ta: "இல்லை" }, img: no },
    { label: { en: "Sleep", ta: "தூக்கம்" }, img: sleep },
    { label: { en: "TV", ta: "டிவி" }, img: tv },
    { label: { en: "Music", ta: "இசை" }, img: music },
    { label: { en: "Medicine", ta: "மருந்து" }, img: medicine },
    { label: { en: "More", ta: "மேலும்" }, img: more },
    { label: { en: "Play", ta: "விளையாடு" }, img: play },
    { label: { en: "Happy", ta: "மகிழ்ச்சி" }, img: happy },
    { label: { en: "Spoon", ta: "கரண்டி" }, img: spoon },
    { label: { en: "I like", ta: "எனக்கு பிடிக்கும்" }, img: like },
    { label: { en: "I don’t like", ta: "எனக்கு பிடிக்காது" }, img: dont },
    { label: { en: "Hug", ta: "அணை" }, img: hug },
    { label: { en: "Dance", ta: "நடனம்" }, img: dance },
    { label: { en: "Bye", ta: "பிரியாவிடை" }, img: bye },
    { label: { en: "Thank you", ta: "நன்றி" }, img: thankyou },
    { label: { en: "Toy", ta: "விளையாட்டு பொருள்" }, img: toy },
    ...extraCommunicationItems,
  ];
  const timeSlot = getTimeSlot();
  const filteredButtons = timeModeEnabled
    ? buttons.filter((button) =>
        timeBasedLabelGroups[timeSlot].includes(button.label.en),
      )
    : buttons;
  const timeSlotLabels = {
    morning: { en: "Morning", ta: "காலை" },
    afternoon: { en: "Afternoon", ta: "மதியம்" },
    evening: { en: "Evening", ta: "மாலை" },
    night: { en: "Night", ta: "இரவு" },
  };

  const handleTimeModeToggleRequest = () => {
    setShowTimeModeModal(true);
    setTimeModePassword("");
    setTimeModeError("");
  };

  const handleTimeModeConfirm = () => {
    if (timeModePassword !== teacherPassword) {
      setTimeModeError(
        isEnglish ? "Teacher password is incorrect." : "ஆசிரியர் கடவுச்சொல் தவறானது.",
      );
      return;
    }

    setTimeModeEnabled((prev) => !prev);
    setShowTimeModeModal(false);
    setTimeModePassword("");
    setTimeModeError("");
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_25px_90px_rgba(16,35,63,0.12)] backdrop-blur sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-900">
                {isEnglish ? "Daily Communication" : "தினசரி தொடர்பு"}
              </div>
              <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                {isEnglish ? "Communication Board" : "தொடர்பு பலகை"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {isEnglish
                  ? "Choose a card to speak aloud. Large visuals and clear spacing make the board easy to use."
                  : "ஒலிக்க ஒரு அட்டையைத் தேர்ந்தெடுக்கவும். பெரிய படங்களும் தெளிவான இடைவெளியும் பயன்படுத்த எளிதாக செய்கின்றன."}
              </p>
              {currentStudent && (
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {isEnglish ? "Student" : "மாணவர்"}: {currentStudent.name} ({currentStudent.studentId})
                </p>
              )}
            </div>

            <button
              onClick={onTeacherBackRequest}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            >
              {isEnglish ? "Teacher Exit" : "ஆசிரியர் வெளியேறு"}
            </button>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#0f766e,#14b8a6,#67e8f9)] p-6 text-white shadow-[0_20px_55px_rgba(20,184,166,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                {isEnglish ? "Tap to speak" : "தொட்டு பேசு"}
              </p>
              <p className="mt-3 max-w-xl text-lg font-medium leading-8 text-white/90 sm:text-xl">
                {isEnglish
                  ? "Helpful words for everyday needs, feelings, and actions."
                  : "தினசரி தேவைகள், உணர்வுகள் மற்றும் செயல்களுக்கு உதவும் சொற்கள்."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-inner shadow-white/70">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isEnglish ? "Current selection" : "தற்போதைய தேர்வு"}
              </p>
              <div className="mt-4 min-h-20 rounded-[1.25rem] bg-white px-4 py-5 text-center text-2xl font-black text-sky-700 shadow-sm ring-1 ring-slate-100">
                {text || (isEnglish ? "Tap any picture card" : "ஏதேனும் ஒரு பட அட்டையைத் தொட்டு தேர்வு செய்யவும்")}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isEnglish ? "Teacher Smart Mode" : "ஆசிரியர் ஸ்மார்ட் முறை"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {timeModeEnabled
                  ? isEnglish
                    ? `${timeSlotLabels[timeSlot].en} communication view`
                    : `${timeSlotLabels[timeSlot].ta} தொடர்பு காட்சி`
                  : isEnglish
                    ? "Full communication board"
                    : "முழு தொடர்பு பலகை"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {timeModeEnabled
                  ? isEnglish
                    ? "Only the most relevant icons for the current time of day are shown."
                    : "தற்போதைய நேரத்திற்கு பொருத்தமான சின்னங்கள் மட்டும் காட்டப்படுகின்றன."
                  : isEnglish
                    ? "All icons are visible. A teacher password is required to switch modes."
                    : "அனைத்து சின்னங்களும் காட்டப்படும். முறையை மாற்ற ஆசிரியர் கடவுச்சொல் தேவை."}
              </p>
            </div>

            <button
              onClick={handleTimeModeToggleRequest}
              className={`rounded-full px-5 py-3 text-sm font-bold shadow-lg transition ${
                timeModeEnabled
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-slate-900 text-white shadow-slate-900/20"
              }`}
            >
              {timeModeEnabled
                ? isEnglish
                  ? "Turn Time Mode Off"
                  : "நேர முறையை அணைக்கவும்"
                : isEnglish
                  ? "Turn Time Mode On"
                  : "நேர முறையை இயக்கவும்"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredButtons.map((b, i) => (
              <button
                key={i}
                onClick={() => {
                  setText(b.label[language]);
                  speak(b.label[language]);
                }}
                className="group rounded-[1.6rem] border border-white bg-white/95 p-3 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(14,116,144,0.16)]"
              >
                <div className="mb-3 overflow-hidden rounded-[1.25rem] bg-slate-100">
                  {b.img ? (
                    <img
                      src={b.img}
                      alt={b.label[language]}
                      className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-[linear-gradient(135deg,#eff6ff,#f8fafc)] text-5xl">
                      {b.emoji}
                    </div>
                  )}
                </div>
                <span className="block text-base font-bold text-slate-800 sm:text-lg">
                  {b.label[language]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showTimeModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_28px_90px_rgba(16,35,63,0.28)]">
            <div className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-900">
              {isEnglish ? "Teacher Access" : "ஆசிரியர் அணுகல்"}
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-900">
              {isEnglish ? "Change time-based board mode" : "நேர அடிப்படையிலான பலகை முறையை மாற்று"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isEnglish
                ? "Only a teacher can turn time-based communication mode on or off."
                : "நேர அடிப்படையிலான தொடர்பு முறையை ஆசிரியர் மட்டும் இயக்கவோ அணைக்கவோ முடியும்."}
            </p>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
              {isEnglish ? "Teacher Password" : "ஆசிரியர் கடவுச்சொல்"}
              <input
                type="password"
                value={timeModePassword}
                onChange={(event) => setTimeModePassword(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder={isEnglish ? "Enter teacher password" : "ஆசிரியர் கடவுச்சொல்லை உள்ளிடவும்"}
              />
            </label>

            {timeModeError && (
              <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {timeModeError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleTimeModeConfirm}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
              >
                {isEnglish ? "Confirm Change" : "மாற்றத்தை உறுதிப்படுத்து"}
              </button>
              <button
                onClick={() => {
                  setShowTimeModeModal(false);
                  setTimeModePassword("");
                  setTimeModeError("");
                }}
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-800 ring-1 ring-slate-200"
              >
                {isEnglish ? "Cancel" : "ரத்து செய்"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
