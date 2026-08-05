# InteractiveFlowchart

The `InteractiveFlowchart` component makes it easy to build guided, question-driven content in MDX. It asks the user one or more questions and then reveals the matching content branch once a path is selected.

Use it when you want to:

- present a decision tree or troubleshooting flow
- guide readers through an interactive path
- keep a single page with branching outcomes instead of separate static sections

## How it works

`InteractiveFlowchart` accepts a `questions` array and nested `<InteractiveFlowchart.Branch>` blocks.
It renders each question as a multiple-choice or text input prompt. When an answer resolves to a branch id, the component displays the matching branch content.

### Core props

- `questions`: array of question objects
- `defaultBranch`: optional fallback branch id
- `className`: optional wrapper class name

### Question object fields

- `id` - unique question id
- `type` - `mcq` or `input`
- `prompt` - the question text
- `options` - choice labels for `mcq`
- `placeholder` - optional placeholder for `input`
- `branchMap` - maps answers to branch ids
- `required` - whether this question must be answered (defaults to `true`)

### Branch definitions

Each branch is defined with `<InteractiveFlowchart.Branch id="..." title="...">`.
The branch content can include normal MDX/JSX, so you can write paragraphs, lists, callouts, tables, and even other components.

## Example

```jsx
<InteractiveFlowchart
  questions={[
    {
      id: 'goal',
      type: 'mcq',
      prompt: 'What do you want to do?',
      options: ['Fix a crash', 'Improve performance'],
      branchMap: ['crash', 'performance'],
    },
    {
      id: 'version',
      type: 'input',
      prompt: 'Enter your Geometry Dash version',
      placeholder: 'e.g. 2.11',
      branchMap: {
        '2.11': 'legacy',
        '2.2': 'current',
      },
      required: false,
    },
  ]}
  defaultBranch="crash"
>
  <InteractiveFlowchart.Branch id="crash" title="Crash troubleshooting">
    <p>If your game crashes on startup, make sure you are running the correct mod loader version and that no conflicting mods are installed.</p>
  </InteractiveFlowchart.Branch>

  <InteractiveFlowchart.Branch id="performance" title="Performance tips">
    <p>Lower your render settings, disable shaders, and close background apps to improve framerate.</p>
  </InteractiveFlowchart.Branch>

  <InteractiveFlowchart.Branch id="legacy" title="Legacy version notes">
    <p>For older versions such as GD 2.11, use the legacy loader branch and consult the compatibility guide.</p>
  </InteractiveFlowchart.Branch>
</InteractiveFlowchart>
```

## Branch mapping rules

- `branchMap` can be an array, object, or string.
- For `mcq` questions, arrays map option indexes to branch ids.
- For `input` questions, objects map normalized answers to branch ids.
- If a branch is not found, the component shows the fallback text or `defaultBranch` if provided.

## Notes

- The branch content is rendered as regular MDX/JSX, so you can use any page components inside a branch.
- The first question that resolves to a branch is used to choose the displayed branch.
- If no branch is selected yet, the component prompts the user to choose an answer.
