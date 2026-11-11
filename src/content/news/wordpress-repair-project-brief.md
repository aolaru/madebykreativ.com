---
title: "What to include in a WordPress repair brief"
description: "A practical checklist for describing a WordPress plugin problem, agreeing scope and preparing a safe environment for a focused repair."
dateLabel: "November 11, 2026"
sortDate: 2026-11-11
category: "Engineering"
service: "wordpress"
---

A useful repair brief starts with the difference between what your site does now and what it should do. You do not need a technical specification to begin the conversation.

## Describe one reproducible problem

Name the affected page or admin workflow. List the steps that trigger the issue, the expected result and what happens instead. Include a redacted error message or screenshot if it helps. A request such as “the filtered report export is empty even when matching records are visible” is easier to investigate than “the plugin is broken.” This is an illustrative example, not a claim about an unresolved product defect.

## Identify the environment

Include WordPress and PHP versions, the relevant plugins and theme, and any recent changes. Mention whether the problem appears on staging as well as production. Do not include passwords, API keys or customer records in an initial email.

## Agree what the repair includes

The proposal should identify the workflow being changed, the supported environment and the acceptance checks. A custom feature, a third-party integration and a site rebuild are different scopes, even when they begin with a small visible change.

Clarify what will be delivered: code or a plugin package, installation guidance, test notes and any included retest. Ask how the change will interact with future vendor updates. Ongoing maintenance is not automatically part of a one-off repair.

## Protect the live site

Agree a backup and staging plan before implementation. Access should be limited to what is needed, authorized by the site owner and shared through an agreed secure channel. A focused repair is not a substitute for a separate security or malware investigation.

## Inspect a real example

The [broken-link reporting case study](/work/wordpress-link-reporting/) explains the choices behind a small, published WordPress workflow. It is independent product work, not a commissioned client project.

For a repair or a small custom plugin, see [WordPress development scope and starting packages](/services/wordpress/). A brief description, approximate budget and desired deadline are enough to start a scope discussion.
