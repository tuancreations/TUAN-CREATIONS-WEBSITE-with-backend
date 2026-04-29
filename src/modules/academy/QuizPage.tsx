import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Award, Clock3, CheckCircle2, ClipboardList, PlayCircle } from "lucide-react";
import { getQuizzes, getQuizResults, submitQuizAnswers, type Quiz, type QuizResult } from "../../services/api";
import { useAuth } from "../../store/auth";

export default function QuizPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const courseIdNumber = Number(courseId);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [resultsByQuiz, setResultsByQuiz] = useState<Record<string, QuizResult[]>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const quizItems = await getQuizzes(courseIdNumber);
      if (!isMounted) return;
      setQuizzes(quizItems);
      setSelectedQuizId((prev) => prev ?? quizItems[0]?._id ?? null);
      if (quizItems[0]?._id) {
        const firstResults = await getQuizResults(quizItems[0]._id);
        if (!isMounted) return;
        setResultsByQuiz((prev) => ({ ...prev, [quizItems[0]._id as string]: firstResults }));
      }
    };

    if (!Number.isNaN(courseIdNumber)) {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [courseIdNumber]);

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      if (!selectedQuizId || resultsByQuiz[selectedQuizId]) return;
      const quizResults = await getQuizResults(selectedQuizId);
      if (!isMounted) return;
      setResultsByQuiz((prev) => ({ ...prev, [selectedQuizId]: quizResults }));
    };

    loadResults();

    return () => {
      isMounted = false;
    };
  }, [resultsByQuiz, selectedQuizId]);

  const selectedQuiz = useMemo(() => quizzes.find((quiz) => quiz._id === selectedQuizId) ?? null, [quizzes, selectedQuizId]);
  const selectedResults = selectedQuizId ? resultsByQuiz[selectedQuizId] ?? [] : [];

  const handleSubmit = async () => {
    if (!selectedQuiz?._id) return;
    setActiveQuizId(selectedQuiz._id);
    setResultMessage(null);

    const payload = selectedQuiz.questions.map((question, index) => ({
      questionId: index,
      selectedAnswer: answers[index] ?? -1,
    }));

    const result = await submitQuizAnswers(selectedQuiz._id, payload, selectedQuiz.timeLimit * 60 - 1);
    if (result) {
      setResultsByQuiz((prev) => ({
        ...prev,
        [selectedQuiz._id as string]: [result, ...(prev[selectedQuiz._id as string] ?? [])],
      }));
      setResultMessage(result.passed ? `Passed with ${result.percentageScore}%` : `Scored ${result.percentageScore}%, try again.`);
    } else {
      setResultMessage("Submission could not be saved right now.");
    }

    setActiveQuizId(null);
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-soft)]">Tier 3</p>
            <h1 className="mt-2 font-display text-3xl">Quizzes</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-soft)]">
              Take course quizzes, see your attempts, and track your progress across each learning path.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <div className="flex items-center gap-2 text-sm text-[var(--text-soft)]"><Clock3 size={16} /> Timed</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-soft)]"><Award size={16} /> Results saved</div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ClipboardList size={16} /> Available Quizzes
            </div>
            <div className="mt-4 space-y-2">
              {quizzes.map((quiz) => (
                <button
                  key={quiz._id}
                  onClick={() => setSelectedQuizId(quiz._id ?? null)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${selectedQuizId === quiz._id ? "border-[var(--accent)] bg-[rgba(203,164,34,0.14)]" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                >
                  <div className="text-sm font-semibold">{quiz.title}</div>
                  <div className="mt-1 text-xs text-[var(--text-soft)]">{quiz.questions.length} questions • {quiz.passingScore}% to pass</div>
                </button>
              ))}
              {quizzes.length === 0 && <p className="text-sm text-[var(--text-soft)]">No published quizzes yet.</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-lg">Past Attempts</h2>
            <div className="mt-3 space-y-2">
              {selectedResults.map((result) => (
                <div key={result._id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>{result.passed ? "Passed" : "Retake"}</span>
                    <span className="font-semibold">{result.percentageScore}%</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">Attempt {result.attemptNumber} • {result.timeSpent}s</p>
                </div>
              ))}
              {selectedResults.length === 0 && <p className="text-sm text-[var(--text-soft)]">No attempts recorded yet.</p>}
            </div>
          </div>
        </aside>

        <section className="card space-y-6">
          {selectedQuiz ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-soft)]"><PlayCircle size={16} /> Live quiz interface</div>
                  <h2 className="mt-2 font-display text-2xl">{selectedQuiz.title}</h2>
                  {selectedQuiz.description && <p className="mt-2 text-sm text-[var(--text-soft)]">{selectedQuiz.description}</p>}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-soft)]">
                  <div>Time limit: {selectedQuiz.timeLimit} minutes</div>
                  <div className="mt-1">Attempts: {selectedQuiz.attempts}</div>
                </div>
              </div>

              <div className="space-y-5">
                {selectedQuiz.questions.map((question, index) => (
                  <article key={`${question.question}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-base font-semibold">{index + 1}. {question.question}</h3>
                    <div className="mt-4 grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:bg-white/10">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            checked={answers[index] === optionIndex}
                            onChange={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                            className="h-4 w-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {question.explanation && <p className="mt-3 text-xs text-[var(--text-soft)]">Hint: {question.explanation}</p>}
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-primary" onClick={handleSubmit} disabled={activeQuizId === selectedQuiz._id}>
                  {activeQuizId === selectedQuiz._id ? "Submitting..." : "Submit Quiz"}
                </button>
                {!user && <p className="text-sm text-[var(--text-soft)]">Sign in to save your results.</p>}
                {resultMessage && (
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <CheckCircle2 size={16} /> {resultMessage}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-[var(--text-soft)]">Select a quiz to begin.</div>
          )}
        </section>
      </div>
    </div>
  );
}
