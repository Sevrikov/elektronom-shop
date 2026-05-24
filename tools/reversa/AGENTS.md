# Reversa Sandbox For Elektronom

Reversa is installed here as an isolated internal tool, not in the root of the
Next.js application.

## How To Use

Run Reversa commands from this folder:

```powershell
cd C:\Users\sevri\Сайт\elektronom\tools\reversa
npm exec reversa -- status
```

When activating Reversa in an AI-agent chat, use the local skill:

```text
reversa
```

Then read and follow:

```text
.agents/skills/reversa/SKILL.md
```

## Target Project

The application to analyze is the parent Elektronom project:

```text
C:\Users\sevri\Сайт\elektronom
```

Do not change the parent application files from this sandbox unless the user
explicitly asks for code edits.

## Non-Negotiable Rule

Reversa output must stay inside this sandbox:

```text
tools/reversa/.reversa/
tools/reversa/_reversa_sdd/
```
