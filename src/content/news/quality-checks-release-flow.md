---
title: "Quality Checks Added to Release Flow"
description: "HTML validation, link checks, and Lighthouse scoring were added to improve release confidence."
dateLabel: "March 2026"
sortDate: 2026-03-04
---

HTML validation, broken-link checks, and Lighthouse scoring were added to the workflow to catch regressions before publishing.

The release checks are intended to catch the practical problems that affect public pages: invalid HTML, stale links, layout regressions, and missing metadata. They also make future changes easier to ship with confidence.

These checks support the same standard used across the wider Kreativ web properties: validate the generated output, not only the source files.

The release flow is intentionally practical. It is meant to catch obvious public issues before they ship, including missing pages, invalid markup, stale redirects, and links that no longer point to a useful destination.
