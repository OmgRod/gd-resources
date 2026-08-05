import { Children, useMemo, useState } from 'react';

const DEFAULT_QUESTIONS = [
  {
    id: 'flow',
    type: 'mcq',
    prompt: 'What would you like to explore?',
    options: ['Quick guidance', 'Detailed walkthrough'],
    branchMap: ['quick', 'detailed'],
  },
];

function normalizeQuestions(questions = []) {
  const source = Array.isArray(questions) && questions.length > 0 ? questions : DEFAULT_QUESTIONS;

  return source.map((question, index) => ({
    id: question?.id || `question-${index + 1}`,
    type: question?.type === 'input' ? 'input' : 'mcq',
    prompt: question?.prompt || `Question ${index + 1}`,
    options: Array.isArray(question?.options) ? question.options : [],
    placeholder: question?.placeholder || 'Type your answer…',
    branchMap: question?.branchMap,
    required: question?.required !== false,
  }));
}

function normalizeInput(value = '') {
  return String(value || '').trim().toLowerCase();
}

function resolveBranch(question, answer) {
  if (!question?.branchMap || answer == null) {
    return null;
  }

  const branchMap = question.branchMap;

  if (typeof branchMap === 'string') {
    return branchMap;
  }

  if (Array.isArray(branchMap)) {
    return branchMap[answer] ?? null;
  }

  if (typeof branchMap === 'object') {
    if (question.type === 'input') {
      return branchMap[normalizeInput(answer)] || null;
    }

    return branchMap[answer] || null;
  }

  return null;
}

function getResolvedBranch(questions, answers) {
  for (const question of questions) {
    const answer = answers[question.id];
    const branch = resolveBranch(question, answer);

    if (branch) {
      return branch;
    }
  }

  return null;
}

function isQuestionAnswered(question, answer) {
  if (question.type === 'input') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  return Number.isInteger(answer) && answer >= 0;
}

function getBranchChildren(children) {
  return Children.toArray(children)
    .filter(Boolean)
    .map((child) => ({
      id: child.props?.id,
      title: child.props?.title,
      content: child.props?.children,
    }))
    .filter((branch) => typeof branch.id === 'string');
}

function Branch({ id, title, children }) {
  return null;
}

export default function InteractiveFlowchart({
  questions = [],
  defaultBranch = null,
  className = '',
  children,
}) {
  const parsedQuestions = useMemo(() => normalizeQuestions(questions), [questions]);
  const [answers, setAnswers] = useState({});

  const branchId = useMemo(
    () => getResolvedBranch(parsedQuestions, answers) || defaultBranch,
    [parsedQuestions, answers, defaultBranch]
  );

  const branchChildren = useMemo(() => getBranchChildren(children), [children]);
  const currentBranch = branchChildren.find((branch) => branch.id === branchId);

  const totalQuestions = parsedQuestions.length;
  const answeredCount = parsedQuestions.filter((question) => isQuestionAnswered(question, answers[question.id])).length;
  const currentStep = Math.min(answeredCount, totalQuestions - 1);

  function updateAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="space-y-4">
        <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Interactive flowchart</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Answer the questions to reveal the branch that contains the information for your path.
          </p>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Progress: {answeredCount}/{totalQuestions}
          </div>
        </div>

        {parsedQuestions.map((question, index) => {
          const answer = answers[question.id];
          const showQuestion = branchId == null || branchId === defaultBranch || index <= currentStep;

          if (!showQuestion) {
            return null;
          }

          return (
            <section key={question.id} className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
              <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{question.prompt}</p>

              {question.type === 'input' ? (
                <input
                  type="text"
                  value={typeof answer === 'string' ? answer : ''}
                  onChange={(event) => updateAnswer(question.id, event.target.value)}
                  placeholder={question.placeholder}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={`${question.id}-option-${optionIndex}`}
                      type="button"
                      onClick={() => updateAnswer(question.id, optionIndex)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        answer === optionIndex
                          ? 'border-blue-500 bg-blue-50 text-slate-900 dark:border-blue-400 dark:bg-blue-950/40'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {currentBranch ? (
            <div className="space-y-3">
              {currentBranch.title ? (
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentBranch.title}</p>
              ) : null}
              <div>{currentBranch.content}</div>
            </div>
          ) : branchId ? (
            <p>No matching branch content was found for &ldquo;{branchId}&rdquo;.</p>
          ) : (
            <p>Choose an answer to reveal the right path.</p>
          )}
        </div>
      </div>
    </div>
  );
}

InteractiveFlowchart.Branch = Branch;
