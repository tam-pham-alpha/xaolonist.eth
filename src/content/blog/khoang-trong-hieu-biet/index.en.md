---
slug: "khoang-trong-hieu-biet"
title: "The comprehension gap, the price of coding with AI"
summary: "AI can generate code far faster than humans can understand and verify it, and that gap is becoming a new kind of debt in software"
author: "Tam Pham"
category: "forge"
status: "published"
date: "2026-09-09"
cover: "./cover.jpg"
lang: "en"
---

*Translated from [Comprehension Debt - the hidden cost of AI generated code](https://addyosmani.com/blog/comprehension-debt/) by Addy Osmani, published March 14, 2026*

**Comprehension debt**, which we can call **the comprehension gap**, is the quiet cost that human memory and thinking pay when we lean too heavily on AI and automation. For software engineers, the problem becomes especially clear as more and more work is handed to AI agents

There is a kind of cost that never appears on the velocity charts once a team starts using AI to write more and more code. Especially when the volume of AI-generated code grows so large that reading all of it becomes exhausting. That cost keeps accumulating in the background, until one day it has to be paid back, with interest

The comprehension gap is **the widening distance between how much code exists in a system and how much of that code any human actually understands**

Unlike technical debt, which usually shows itself through slower builds, tangled dependencies, or the unease that comes whenever someone has to touch an old module, the comprehension gap creates a false sense of confidence. The codebase still looks clean. The tests stay green. Everything seems fine. Until the bill arrives, usually at the worst possible moment

[Margaret-Anne Storey](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) once described a student team that hit this wall in week seven of a project. They could no longer make a simple change **without accidentally breaking something else**. The real problem was not bad code. No one on the team could still explain why earlier design decisions had been made, or how the different parts of the system were supposed to work together. The mental model of the whole system had disappeared

That is the moment when comprehension debt starts compounding right in front of us

I have read many Hacker News threads where engineers were truly wrestling with the structural version of this problem. It is no longer the familiar argument between people who are optimistic about AI and people who are skeptical. The field is trying to figure out what rigor in software engineering should look like once the bottleneck has moved somewhere else

A recent Anthropic study titled [How AI Impacts Skill Formation](https://www.anthropic.com/research/AI-assistance-coding-skills) pointed to the hidden downsides of relying too heavily on AI coding assistants. In a randomized controlled trial with 52 software engineers learning a new library, people who used AI finished the work in roughly the same time as the control group, but scored 17% lower on a later comprehension test, 50% versus 67%. The steepest drop showed up in debugging, followed by conceptual understanding and code reading. **The researchers stressed that passive delegation of the “just make it work” kind damages skill formation far more than actively using AI to ask questions and learn**. The full paper is on [arXiv](https://arxiv.org/abs/2601.20245/)

## There is a speed asymmetry

**AI generates code far faster than humans can evaluate it.** That sounds obvious, but the consequences are easy to underestimate

When a developer on the team writes the code themselves, human review has always been a bottleneck, but it used to be a useful one. Reading a PR forced the reviewer to understand the change. It exposed hidden assumptions, caught design decisions that conflicted with an architecture built six months earlier, and helped spread knowledge of the codebase among the people responsible for keeping it alive

AI-generated code breaks this feedback loop. The volume is too high. The code is also syntactically clean, often well presented, and looks correct at a glance, exactly the signals that used to make us feel safe enough to merge. But being right on the surface is not the same as being right at the system level. The codebase looks healthy, while human understanding underneath it is quietly being hollowed out

I once read an engineer say that the bottleneck of building software has always been a competent developer who actually understands the project. AI does not remove that limit. It only creates the illusion that we have escaped it

The inversion is sharper than it first appears. When code was still expensive to produce, a senior engineer could usually review faster than a junior could write. **AI reverses that: a junior can now generate code faster than a senior can inspect it with real seriousness.** The limiting factor that once made review meaningful has disappeared. **What used to be a quality gate is now a throughput problem**

## I like tests a lot, but tests are not a complete answer

Our natural reflex is to lean harder on deterministic verification methods such as unit tests, integration tests, static analysis, linters, and formatters. I do this a great deal on projects that depend heavily on [AI coding agents](https://addyosmani.com/agentic-engineering/ai-coding-agent/). If human review has become the bottleneck, automate the checking itself. Let machines check machines

That helps. But it has a very clear limit

A test suite that could cover every observable behavior of a system would, in many cases, be more complex than the code it is checking. A layer of complexity we cannot reason about does not give us much safety. Deeper still is a more basic problem: you cannot write a test for a behavior you have never thought of

Nobody writes a test to confirm that a dragged element must not become completely transparent. Of course they do not. That possibility never entered their mind. This is exactly the kind of bug that slips through, not because the tests were written poorly, but because no one thought they needed to look there

There is another failure mode that deserves a name. **When AI changes the behavior of an implementation and then updates hundreds of test cases to match the new behavior, the question is no longer “is this code correct?” It becomes “were all those test changes actually necessary, and is the current coverage enough to catch the things I have not even thought of yet?”** Tests cannot answer that question. Only understanding can

The data is starting to show the same thing. Some studies find that developers who use AI in a delegated, generate-the-code way score below 40% on comprehension tests, while those who use AI to ask about concepts, learn, and explore trade-offs score above 65%. The tool itself does not destroy understanding. The way we use it does

Tests are necessary. But they are not enough

## Lean on specs, but specs do not tell the whole story either

A common proposed solution is to write a very detailed natural-language specification first. Attach it to the PR. Review the spec instead of reviewing the code. Then trust that AI will faithfully turn that intent into an implementation

The idea is appealing in the same way Waterfall once was. Define the problem carefully first, then execute. Everything is cleanly separated

The problem is that turning a spec into working software contains countless implicit decisions: edge cases, data structures, error handling, performance trade-offs, and the way components interact. No spec can describe all of them. **Two engineers implementing the same spec can still produce two systems with many observable differences.** Neither system has to be wrong. They are simply different. And many of those differences will later matter to users in ways nobody predicted

There is another possibility worth sitting with. A spec detailed enough to describe a program completely is, in essence, the program itself, only written in a language that cannot be executed. The organizational cost of writing specs detailed enough to replace code review may well exceed the productivity gains AI provides. And in the end, we still have not reviewed the thing that was actually produced

The deeper issue is that in many cases, there is no **correct** spec to begin with. Requirements emerge while we build. Edge cases only appear when the system is used. The assumption that a non-trivial system can be fully specified before construction starts has been tested many times, and it has rarely held. AI does not change that. It only adds a new layer of implicit decisions made without human deliberation

## Learn from history

Decades of managing software quality across distributed teams, with uneven levels of understanding and communication, have produced many practical methods that have been tested over time. Those methods do not vanish simply because one member of the team is now an AI model

**What changes with AI is cost, which drops sharply, speed, which rises sharply, and the cost of managing work between people, which falls close to zero. What does not change is the need for someone who owns enough system context to keep a coherent understanding of what the codebase is actually doing, and why it is doing it that way**

This is the uncomfortable redistribution of value that the comprehension gap creates

As the amount of AI-generated code grows, the engineer who truly understands the system becomes more valuable, not less. That is the ability to look at a diff and almost immediately see which behavior is carrying the rest of the system. The ability to remember why an architectural decision was made on a tense night eight months ago

It is also the ability to tell a safe refactor from a refactor that quietly changes something users already depend on. That skill becomes the scarce resource the whole system has to rely on

## We also have a gap in how we measure

**The comprehension gap is dangerous precisely because almost nothing in our current measurement systems can see it**

Velocity still looks excellent. DORA metrics stay stable. The number of PRs goes up. Code coverage stays green

Performance reviews see a rise in productivity. They do not see the decline in understanding, because almost none of the artifacts organizations use to measure output contain that dimension. The incentive system is optimizing correctly for what it measures. The problem is that what gets measured no longer fully represents what actually matters

This is what makes the comprehension gap even quieter than technical debt. Technical debt is often a conscious trade-off. You choose a shortcut, you roughly know where the debt lives, and you can schedule a time to pay it down. The comprehension gap accumulates almost invisibly, often without anyone deliberately deciding to accept it. It is the sum of hundreds of reviews where the code looked fine, the tests passed, and another PR was already waiting

The organizational assumption that **reviewed code is understood code** no longer holds. Engineers approve code they do not fully understand, but the act of approval still carries an implicit guarantee. Responsibility has been spread everywhere, and almost no one noticed

## Regulation may arrive sooner than we think

Any industry that grows too quickly eventually attracts regulation. Tech has long been unusually insulated from that pattern, partly because software bugs could often still be fixed, and partly because the industry always moved faster than regulators could follow

That window is starting to close. When AI-generated code begins to run in healthcare systems, financial infrastructure, or government services, “AI wrote it and we did not review all of it” will no longer stand as an explanation in a post-incident report, especially when lives or large assets are at stake

Teams that are already building a discipline of understanding, treating a real grasp of the system rather than passing tests as a non-negotiable requirement, will be in a better position when that moment arrives than teams that only optimized for merge speed

## What the comprehension gap actually asks of us

The right question now is no longer “how do we generate more code?” The question should be “how do we actually understand more of what we are putting into production?”, so that users keep receiving an experience of consistent quality

That shift in perspective has very practical consequences. It means we have to be extremely clear about what a change is supposed to do before we start writing it. We have to treat verification not as something added at the end, but as a structural constraint from the beginning. We have to keep a system-level mental model that lets us catch AI mistakes at the architectural layer instead of inspecting every line. And we have to be honest about the difference between two sentences: “the tests passed” and “I understand what this is doing, and why it is doing it that way”

**Making code cheap to generate does not mean we can also skip understanding it on the cheap. The work of understanding the system is the real work**

AI can take on the part that turns an idea into code. But someone still has to understand what was just produced, why it was produced that way, and whether the implicit decisions inside it were the right ones. If not, we are only postponing a bill that will eventually have to be paid in full

Sooner or later, we will have to pay for understanding. And that debt accumulates interest very quickly
