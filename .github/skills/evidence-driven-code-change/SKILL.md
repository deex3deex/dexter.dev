---
name: evidence-driven-code-change
description: "Use for implementing or fixing code changes through focused local investigation, a falsifiable hypothesis, minimal edits, and executable validation. Applies to debugging, bug fixes, feature work, and small refactors where the controlling code path must be identified before editing."
argument-hint: "Describe the requested behavior, anchor file or symbol, and any failing check."
user-invocable: true
---

# Evidence-Driven Code Change

## What This Produces

A small, reviewable implementation change grounded in the code that controls the requested behavior, with a focused validation result and any remaining risk stated clearly.

## Procedure

1. **Choose the local anchor.** Start with the most concrete available signal: a named file, symbol, failing behavior, failing command, test, or nearby implementation. If none is given, perform one targeted search to find it.
2. **Read only the nearby path.** Inspect the owning abstraction, a neighboring test, or a call site. If the starting file only forwards or registers behavior, follow one hop to the code that computes, mutates, or controls it.
3. **State a falsifiable hypothesis.** Write down what appears to be wrong or missing, which local code path supports that belief, and one cheap check that could disconfirm it.
4. **Pick the smallest testable edit.** Preserve existing APIs and local patterns. Prefer a reversible probe when confidence is incomplete. Do not broaden exploration once the hypothesis, check, and edit are concrete.
5. **Edit the narrow slice.** Keep the patch focused and avoid unrelated formatting, refactors, or metadata changes. Add comments only when the resulting logic would otherwise be difficult to parse.
6. **Validate immediately.** After the first substantive edit, run the cheapest behavior-scoped check available. Prefer, in order:
   - the failing or reproducing check;
   - a focused test for the touched behavior;
   - a narrow compile, typecheck, or lint command;
   - a diff inspection only when no executable check is available.
7. **Respond to the result.** If validation supports the hypothesis but reveals a local defect, repair the same slice and rerun the same check. If it falsifies the hypothesis, take one nearby hop to the more direct controller. If ambiguous, do one nearby disambiguating read or check before editing another slice.
8. **Complete the change.** Make adjacent follow-up edits only when required, rerunning focused validation after each. Finish with at least one executable post-edit check when the environment provides one.

## Decision Rules

- **Keep searching:** only when the controlling boundary or discriminating check is still unresolved.
- **Start editing:** once one plausible local hypothesis, one falsifiable check, and one small edit are identified.
- **Broaden scope:** only when focused validation proves the issue is controlled elsewhere or the requested contract crosses module boundaries.
- **Ask the user:** when requirements conflict, the local change is impossible without choosing among materially different behaviors, or validation requires unavailable credentials or external systems.

## Portfolio Validation

This workspace is a static site with no package manifest or build step. For HTML, CSS, and JavaScript changes:

1. Start a local server from the workspace root with `python -m http.server 8000` (use another available port if needed). Opening files directly can hide relative-path and browser security problems.
2. Load `http://localhost:8000/` and confirm the redirect reaches `html/portfolio.html`. Check the touched page directly as well when the change is page-specific.
3. Exercise the affected behavior in a browser. For `js/portfolio.js`, test email-copy success or fallback behavior, the status message, section reveal, and reduced-motion behavior as applicable.
4. Check the page at a desktop viewport and a narrow mobile viewport. Confirm there is no horizontal overflow, clipped text, overlapping content, broken navigation, or missing image/font resource.
5. Inspect the browser console for errors and verify that changed local asset references return successfully. A screenshot is useful evidence for layout changes, but it does not replace interaction checks.
6. Stop the local server after validation.

For a cheap non-browser check, confirm every changed relative `href`, `src`, and CSS `url(...)` path resolves to an existing workspace file. External font URLs may be unavailable offline and should be reported separately rather than treated as local asset failures.

## Completion Checklist

- [ ] The controlling code path is identified.
- [ ] The hypothesis could have been disproved by the selected check.
- [ ] The patch is minimal and consistent with nearby code.
- [ ] The first edit was followed by focused validation.
- [ ] Relevant tests, typechecks, or lint checks pass, or their blocker is reported.
- [ ] Static portfolio pages were checked through a local HTTP server when applicable.
- [ ] Changed interactive behavior and desktop/mobile layout were browser-checked when applicable.
- [ ] Remaining assumptions and test gaps are explicit.
