---
description: How to commit and push changes to the repository
---
1. Use the `run_command` tool to check the status of the repository and understand what changes are pending.
```bash
git status
```
// turbo
2. Understand the changes to write a good commit message following Conventional Commits format (e.g. `feat: x`, `fix: y`, `chore: z`).
3. Add all changes, and commit them.
```bash
git add . && git commit -m "type: description"
```
// turbo
4. Push the changes to the remote branch.
```bash
git push
```
