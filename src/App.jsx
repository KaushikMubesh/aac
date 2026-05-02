import { useEffect, useMemo, useState } from "react";
import MainMenu from "./pages/MainMenu";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import StudentProgress from "./pages/StudentProgress";
import TeacherDashboard from "./pages/TeacherDashboard";
import {
  appendQuizAttemptInCloud,
  fetchStudentsFromCloud,
  isFirebaseConfigured,
  upsertStudentInCloud,
} from "./lib/firebase";

const TEACHER_USERNAME = "teacher";
const TEACHER_PASSWORD = "aac123";

function TeacherExitModal({
  language,
  isOpen,
  onClose,
  onConfirm,
  password,
  setPassword,
  error,
}) {
  const isEnglish = language === "en";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_28px_90px_rgba(16,35,63,0.28)]">
        <div className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-800">
          {isEnglish ? "Teacher Confirmation" : "ஆசிரியர் உறுதிப்படுத்தல்"}
        </div>
        <h2 className="mt-4 text-2xl font-black text-slate-900">
          {isEnglish ? "Exit student view" : "மாணவர் திரையிலிருந்து வெளியேறு"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isEnglish
            ? "To protect the student from accidental back presses, only a teacher can leave this screen."
            : "மாணவர் தவறுதலாக பின்செல்வதைத் தடுக்க, இந்த திரையிலிருந்து வெளியேற ஆசிரியர் மட்டும் அனுமதிக்கப்படுகிறார்."}
        </p>

        <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
          {isEnglish ? "Teacher Password" : "ஆசிரியர் கடவுச்சொல்"}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder={isEnglish ? "Enter teacher password" : "ஆசிரியர் கடவுச்சொல்லை உள்ளிடவும்"}
          />
        </label>

        {error && (
          <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onConfirm}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            {isEnglish ? "Confirm Teacher Exit" : "ஆசிரியர் வெளியேற்றத்தை உறுதிப்படுத்து"}
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-800 ring-1 ring-slate-200"
          >
            {isEnglish ? "Stay on Screen" : "இந்த திரையில் தொடர்க"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("menu");
  const [language, setLanguage] = useState("en");
  const [students, setStudents] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [teacherLoggedIn, setTeacherLoggedIn] = useState(false);
  const [teacherError, setTeacherError] = useState("");
  const [studentNotice, setStudentNotice] = useState("");
  const [teacherExitRequest, setTeacherExitRequest] = useState(null);
  const [teacherExitPassword, setTeacherExitPassword] = useState("");
  const [teacherExitError, setTeacherExitError] = useState("");
  const [cloudStatus, setCloudStatus] = useState(
    isFirebaseConfigured()
      ? "Cloud storage is connected through Firebase."
      : "Firebase is not configured yet. Add your keys to start cloud storage.",
  );
  const [isLoadingStudents, setIsLoadingStudents] = useState(isFirebaseConfigured());

  const loadStudents = async () => {
    if (!isFirebaseConfigured()) return;

    try {
      setIsLoadingStudents(true);
      const cloudStudents = await fetchStudentsFromCloud();
      setStudents(cloudStudents);
      setCloudStatus("Cloud student data loaded from Firebase.");
    } catch (error) {
      setCloudStatus(error.message);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const currentStudent = useMemo(
    () => students.find((student) => student.studentId === currentStudentId) ?? null,
    [students, currentStudentId],
  );

  const isStudentProtectedPage =
    currentStudent && ["home", "quiz", "progress"].includes(page);

  useEffect(() => {
    if (!isStudentProtectedPage) return;

    window.history.pushState({ studentLocked: true }, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState({ studentLocked: true }, "", window.location.href);
      setTeacherExitRequest(() => () => setPage("menu"));
      setTeacherExitPassword("");
      setTeacherExitError("");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isStudentProtectedPage, page]);

  const requestTeacherExit = (action) => {
    setTeacherExitRequest(() => action);
    setTeacherExitPassword("");
    setTeacherExitError("");
  };

  const closeTeacherExit = () => {
    setTeacherExitRequest(null);
    setTeacherExitPassword("");
    setTeacherExitError("");
  };

  const confirmTeacherExit = () => {
    if (teacherExitPassword !== TEACHER_PASSWORD) {
      setTeacherExitError("Teacher password is incorrect.");
      return;
    }

    const pendingAction = teacherExitRequest;
    closeTeacherExit();
    pendingAction?.();
  };

  const handleStudentAccess = async (formData) => {
    const studentId = formData.studentId.trim().toUpperCase();
    const name = formData.name.trim();

    if (!studentId || !name) {
      setStudentNotice("Enter student name and ID to continue.");
      return;
    }

    const existingStudent = students.find((student) => student.studentId === studentId);
    const studentRecord = existingStudent
      ? {
          ...existingStudent,
          name,
          age: formData.age.trim(),
          supportNeed: formData.supportNeed.trim(),
        }
      : {
          studentId,
          name,
          age: formData.age.trim(),
          supportNeed: formData.supportNeed.trim(),
          createdAt: new Date().toISOString(),
          attempts: [],
        };

    setStudents((prev) => {
      const hasStudent = prev.some((student) => student.studentId === studentId);
      return hasStudent
        ? prev.map((student) =>
            student.studentId === studentId ? studentRecord : student,
          )
        : [...prev, studentRecord];
    });
    setCurrentStudentId(studentId);
    setTeacherLoggedIn(false);
    setTeacherError("");
    setPage("menu");
    setStudentNotice(
      existingStudent
        ? "Student profile opened. Syncing with cloud..."
        : "Student profile created. Syncing with cloud...",
    );

    try {
      await upsertStudentInCloud(studentRecord);
      setStudentNotice(
        existingStudent
          ? "Welcome back. Student profile loaded from cloud."
          : "New student profile created and saved to cloud.",
      );
      setCloudStatus("Student data synced to Firebase cloud storage.");
    } catch (error) {
      setStudentNotice(
        "Student opened locally, but cloud sync failed. Check Firebase/Firestore and internet.",
      );
      setCloudStatus(error.message || "Cloud sync failed.");
    }
  };

  const handleTeacherLogin = async ({ username, password }) => {
    if (
      username.trim().toLowerCase() === TEACHER_USERNAME &&
      password === TEACHER_PASSWORD
    ) {
      setTeacherLoggedIn(true);
      setTeacherError("");
      setPage("teacher");
      await loadStudents();
      return true;
    }

    setTeacherError("Invalid teacher username or password.");
    return false;
  };

  const handleTeacherLogout = () => {
    setTeacherLoggedIn(false);
    setTeacherError("");
    setPage("menu");
  };

  const handleStudentLogout = () => {
    setCurrentStudentId("");
    setStudentNotice("");
    setPage("menu");
  };

  const handleQuizComplete = async (attempt) => {
    if (!currentStudentId) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === currentStudentId
          ? {
              ...student,
              attempts: [...(student.attempts ?? []), attempt],
            }
          : student,
      ),
    );

    try {
      await appendQuizAttemptInCloud(currentStudentId, attempt);
      setCloudStatus("Quiz progress saved to Firebase cloud storage.");
    } catch (error) {
      setCloudStatus(error.message || "Quiz saved locally, but cloud sync failed.");
    }
  };

  if (page === "home" && currentStudent) {
    return (
      <>
        <Home
          language={language}
          currentStudent={currentStudent}
          onTeacherBackRequest={() => requestTeacherExit(() => setPage("menu"))}
          teacherPassword={TEACHER_PASSWORD}
        />
        <TeacherExitModal
          language={language}
          isOpen={Boolean(teacherExitRequest)}
          onClose={closeTeacherExit}
          onConfirm={confirmTeacherExit}
          password={teacherExitPassword}
          setPassword={setTeacherExitPassword}
          error={teacherExitError}
        />
      </>
    );
  }

  if (page === "quiz" && currentStudent) {
    return (
      <>
        <Quiz
          setPage={setPage}
          language={language}
          currentStudent={currentStudent}
          onQuizComplete={handleQuizComplete}
          onTeacherBackRequest={() => requestTeacherExit(() => setPage("menu"))}
        />
        <TeacherExitModal
          language={language}
          isOpen={Boolean(teacherExitRequest)}
          onClose={closeTeacherExit}
          onConfirm={confirmTeacherExit}
          password={teacherExitPassword}
          setPassword={setTeacherExitPassword}
          error={teacherExitError}
        />
      </>
    );
  }

  if (page === "progress" && currentStudent) {
    return (
      <>
        <StudentProgress
          setPage={setPage}
          language={language}
          student={currentStudent}
          onTeacherBackRequest={() => requestTeacherExit(() => setPage("menu"))}
        />
        <TeacherExitModal
          language={language}
          isOpen={Boolean(teacherExitRequest)}
          onClose={closeTeacherExit}
          onConfirm={confirmTeacherExit}
          password={teacherExitPassword}
          setPassword={setTeacherExitPassword}
          error={teacherExitError}
        />
      </>
    );
  }

  if (page === "teacher" && teacherLoggedIn) {
    return (
      <TeacherDashboard
        setPage={setPage}
        language={language}
        students={students}
        onTeacherLogout={handleTeacherLogout}
      />
    );
  }

  return (
    <MainMenu
      setPage={setPage}
      language={language}
      setLanguage={setLanguage}
      currentStudent={currentStudent}
      onStudentAccess={handleStudentAccess}
      onStudentLogout={handleStudentLogout}
      onTeacherLogin={handleTeacherLogin}
      onTeacherOpen={() => setPage("teacher")}
      teacherLoggedIn={teacherLoggedIn}
      teacherError={teacherError}
      studentNotice={studentNotice}
      teacherCredentials={{
        username: TEACHER_USERNAME,
        password: TEACHER_PASSWORD,
      }}
      cloudStatus={cloudStatus}
      isLoadingStudents={isLoadingStudents}
      isFirebaseReady={isFirebaseConfigured()}
    />
  );
}

export default App;
