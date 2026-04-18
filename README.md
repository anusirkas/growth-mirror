# Growth Mirror

Growth Mirror is a simple AI-inspired reflection tool for self-taught developers and junior builders.

It helps users reflect on their week and get a clearer sense of:
- where real progress happened
- what is slowing them down
- what to focus on next
- what practical step to take next

## The problem

When you are learning while also working, progress often feels invisible.

You may be busy every day, but still feel unsure whether you are actually moving forward in the right direction.

This is especially common for self-taught developers, junior builders, and career switchers who:
- learn from different sources
- juggle work and growth at the same time
- struggle with focus and direction
- postpone important learning because urgent work gets in the way

## The solution

Growth Mirror is a lightweight weekly reflection tool.

The user writes:
- what they worked on
- what they learned
- what felt difficult
- what they avoided
- what they want to improve next

The app then returns a structured reflection:
- Progress Spotted
- Biggest Gap
- Next Week Focus
- Practical Next Step

## Why I built it this way

I deliberately kept the MVP narrow.

This is not a task manager or a habit tracker.
The goal is not to track activity, but to create clarity.

I chose reflection over planning because tracking tasks does not always show meaningful growth.

## MVP scope

Included:
- Weekly reflection form
- Structured response card
- Clear and simple UI
- React + TypeScript frontend prototype

Deliberately left out:
- authentication
- reminders
- dashboards
- history tracking
- course integrations
- live LLM API integration

## Why no live AI model yet?

For this prototype, I focused first on validating the core product flow:
reflection in → clarity out.

A live LLM integration would be the next step, but I intentionally prioritized product thinking, scope control, and user flow first.

## Tech stack

- React
- TypeScript
- Vite
- CSS

## Screenshot

![Growth Mirror screenshot](./public/growth-mirror-demo.png)

## Running locally

```bash
npm install
npm run dev
```

Future improvements
- live LLM integration through a server-side function
- saved reflection history
- weekly comparison view
- monthly growth summaries
- optional learning tracker for courses and milestones


---

# 5. Screenshot README jaoks

Tee nii:

1. täida form päris sisuga  
2. vajuta submit  
3. tee screenshot nii, et form vasakul + result paremal  
4. salvesta fail näiteks:

```text
public/growth-mirror-demo.png