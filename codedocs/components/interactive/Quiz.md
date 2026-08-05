# Quiz

Render a quiz with questions, options, and scoring.

## When to use

- Use to present quiz-style questions and answers to readers.

## Props

- `className` - Additional CSS classes to apply.
- `questions` - Array of question definitions.
- `showScore` - Whether to show the quiz score after completion.

## Example

```jsx
<Quiz questions={[{question: "2+2", options: ["3","4"], answer: 1}]} />
```
