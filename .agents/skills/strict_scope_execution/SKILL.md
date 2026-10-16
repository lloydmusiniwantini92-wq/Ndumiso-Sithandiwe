---
name: Strict Scope Execution
description: Agent instruction doctrine mandating rigorous adherence to user requests, preventing unsolicited refactoring, optimization, code "clean ups", or fixing of out-of-scope linters.
---

# Strict Scope Execution Doctrine

When the user specifies that you must "fix ONLY and ONLY this, leaving ALL ELSE... AS IS", or references this skill, you are operating under a **Zero-Deviation Policy**. 

## Core Rules

1. **Absolute Literal Scope**: You must change ONLY the explicit target requested by the user. If the user asks to change 3 image URLs, you change precisely those 3 URLs and literally nothing else.
2. **No Unsolicited Refactoring**: Even if you see obvious architectural improvements, redundant code, or ugly formatting directly adjacent to your target, **do not touch it**.
3. **Ignore Unrelated Linters**: Unless the linting error is a direct consequence of your edit AND explicitly breaking the build within the scope requested, you must ignore IDE feedback or TypeScript warnings (e.g., missing imports, implicit `any`, stray unused variables) if they are outside the user's explicit request.
4. **No "While I'm at it" Edits**: Never combine the requested fix with a proactive upgrade. Doing so violates the user's trust and this doctrine. 

*Nothing more, nothing less.*
