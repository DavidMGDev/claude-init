---
name: steer-resume
description: "Steer the user's approved resume toward one job posting: study the company, its values, its hiring process and the applicant tracking system that reads the file, then make the smallest set of edits to the base resume and build a checked PDF, keeping every standing correction the user has given. Use for /steer-resume, 'steer my resume', 'tailor my resume to this posting', 'apply to this job', a pasted job posting next to a resume request, or when the user asks for help with a posting's application questions."
argument-hint: "Job posting URL or pasted text"
---

# Steer a resume toward a posting

The user already has a resume they approved line by line. This skill points that resume at one posting without rewriting it from scratch. Done means: a PDF in `Final/` that passes `build.py`, a short list of what changed from the base and why, the posting requirements the resume cannot cover, and the private profile updated with anything the user corrected along the way.

The rules below came from a user correcting AI drafts over several days. The drafts scored well with judges and still got sent back for being cramped, for echoing the posting, and for reading like a prompt. Treat the rules as the user's taste, and treat the private profile as stronger than this file when they differ.

## Where things live

Nothing personal is in this skill. The candidate's facts stay on their machine:

| File | Holds |
|---|---|
| `~/.claude/steer-resume/profile.md` | Verified facts and numbers, where the evidence is, what never goes on a resume and why, wording the user settled on, corrections from past runs |
| `~/.claude/steer-resume/base.json` | The approved resume, in the format `build.py` reads, including the `never` list |
| `<Company>-Application/` in the current project | This application: `posting.md`, `resume.json`, the built HTML and PDF, `Final/` |

Read `profile.md` and `base.json` first, every run. If they are missing, this is a first run: go to "First run" at the end before anything else.

## 1. Read the posting

Save the full posting text to `<Company>-Application/posting.md`. A careers page can show a stale "filled" banner, so when the site runs on a known system, fetch its job data instead of trusting the page (Workday serves it at `https://<tenant>.wd<N>.myworkdayjobs.com/wday/cxs/<tenant>/<site>/job/<path>`, with the closing date and whether resume parsing is on).

Pull out, in a short list:

- Closing date, start date, location, hours, and the file types and count the portal accepts.
- Eligibility gates (student status, months left to graduate, language level, work permit). Check the profile against each. A failed gate is the first thing to tell the user.
- The work areas and hard skills it names, and the soft skills, in its own words.

## 2. Study the company

Run two `scout` agents in parallel (or do it inline when the company is small). Brief each with the posting URL and the exact question, and ask for sources tagged official or third-party.

- **How they hire.** The stages, any online assessment and whether its result locks for a period, what interviewers score (a named competency model if one exists), the company's stated values, and its own advice to applicants.
- **How the file is read.** Which applicant tracking system the portal runs on, whether it parses the resume into form fields, whether an AI ranks applications, and what that system is known to misread.

Treat the reports as leads. Before a claim shapes the resume, open the official page it rests on.

Tell the user about anything that should happen before applying, such as an assessment that locks for a year.

## 3. Map requirements to evidence

Make a table: each requirement and work area from step 1, the strongest evidence in `profile.md`, and where that evidence sits in the base resume (or "not on it").

For each gap, look before concluding there is nothing: course lists, local course folders, and GitHub, including repos the user contributes to but does not own.

```sh
gh repo list <user> --limit 200
gh api "user/repos?affiliation=collaborator,organization_member" --jq '.[].full_name'
```

Then ask the user one round of questions with AskUserQuestion, one per gap, about coursework or projects that could cover it. A requirement with no real evidence stays uncovered and gets reported. It does not get a vague bullet.

## 4. Steer the base

Copy `base.json` to `<Company>-Application/resume.json` and edit that copy. Match the posting through selection and order, not through its phrases:

- Reorder projects so the most relevant, most professional one comes first. Swap entries in or out from the profile. Reorder skill rows and the items inside them.
- Retune the summary. When it changes by more than the availability line, write three to five options, each built from the whole resume, and let the user pick.
- Update the title line and availability for this posting.
- Add this posting's own phrases (hours, team names, area names) to the `never` list so the checker catches an echo.
- Leave every line that already works alone.

## 5. Build and check

```sh
python ~/.claude/skills/steer-resume/build.py <Company>-Application/resume.json
```

It writes the HTML and PDF beside the JSON, prints how full the last page is, and exits 1 with a `FIX` line for each problem: a dash or semicolon, a `never` phrase, an unfilled `[gap]`, first person in the summary, the wrong page count, a name that is not the first line of the PDF text, an email that is not directly under it, an orphan line, or a last page outside half to two thirds full. `--pages 1` changes the target.

Then open the PDF with Read and look at both pages. The script cannot see "cramped", a label that wraps, or an entry split across the page break.

Fix by rewording or cutting the lowest-return line. Do not shrink the font or margins to make something fit.

## 6. Audit

Before showing it, go through the resume once for each question:

- **Truth.** Does every number, date, team size and tool match the profile exactly, attached to the right project?
- **Echo.** Could a reader tell which posting this was written for from anything except the availability line?
- **Coverage.** Which rows of the step 3 table are now visible in the top half of page one, and which are still missing?
- **Slop.** Run `no-ai-slop` in detect mode over the text if it is installed.

## 7. Deliver

Copy the PDF to `<Company>-Application/Final/<First>_<Last>_Resume.pdf`. Report what changed from the base and why, what is not covered, and the dates from step 1.

After the upload, ask the user to check the fields the portal filled in from the resume, starting with the name. Once a resume is submitted, propose a re-upload only for a major change, because re-uploading can mean filling the forms again.

When the user corrects anything, apply it, then record it in `profile.md` under "Corrections" with the date and their reason. If they choose a new final version, write it back to `base.json`.

## Standards

### When the user's preference and the posting pull apart

Standing preferences in the profile apply by default. When one would cost something for this posting (a portal that demands one page, a skill the posting weighs heavily that the user prefers to play down), say so once, with the reason and a recommendation, and follow the user's answer. The `never` list is not up for discussion.

### Length and layout

- One and a half pages: two pages with the last one half to two thirds full. A full single page reads cramped and a full second page reads padded. Go to one page only when the posting or portal requires it.
- When it feels tight, give it air and cut content. Space beats one more bullet.
- Single column, serif, real text, no tables, columns, icons or photo. Contact details in the body, never in a header or footer.
- Plain section names in this order: Summary, Education, Experience, Projects, Skills, Languages. No "Additional", interests or misc section at the end.
- No line with one or two words alone on it. Reword the sentence to pull it back.
- Skill labels short enough to stay on one line.

### Header

- The name alone on the first line, with no letter-spacing.
- The email on the line directly under the title, then phone and location.
- Location as region and country. Never write a place name that could pass for a person's name: a parser once filled the candidate's name field with a town whose name is also a surname. Use the region or canton instead, in every entry.
- Citizenship or work authorization on the second contact line when it is an advantage.
- Title line: what the candidate is, then availability.

### Summary

- Three or four sentences that a person can read in one pass. No pronouns: "Builds", "Designed and taught", "can stay on for".
- Shape: who they are and what they build with which stack, then the two strongest achievements someone else validated, then availability.
- A little technical, so it introduces what the candidate can do. One or two numbers at most. The proof is in the body.

### Not written for the posting

- Availability is the only thing allowed to echo the posting, stated formally: "Available in <city> from <month year>".
- No hours per week, no "full time", no company name, no names of the posting's teams or work areas, in the summary, the skill labels, or file metadata.
- Skill rows use plain industry labels (Programming, Web & Mobile, Data & ML, Cloud & DevOps, Security, Ways of working).
- Keywords count only as real skills inside real bullets.

### What goes in

- Team, course and client work ranks above solo work. A project the user did for fun goes last however large its numbers are, and nothing labels it as a hobby.
- A Languages section whenever the candidate has more than one working language. Only languages they can work in.
- A language or tool employers still rely on gets shown when the evidence exists, even from a course project. Look for the evidence before leaving it out.
- Courses in progress are listed as in progress.
- Course and team projects get a descriptive, professional name ("3D Animation Production Planner (team project)"), not the team's nickname for it.
- A grade average stays off when the scale would not be clear to this reader.
- Local terms with no clean translation keep their original name.
- Credit the team where there was one: "led the technical build, working with a second assistant".

### What stays out

- Everything on the `never` list and in the profile's exclusions.
- Counts that give no advantage, such as how many people attended. "Fully booked" says enough.
- Ventures that have not delivered yet.
- Projects with thin evidence, such as a repo with a handful of commits.
- Anything from a field the user does not want to be read as working in.

### Truth

- Use the strongest framing the facts support. Framing can be generous, facts cannot move.
- Every number exact and checked at the source (the Git host's API, the package registry, the certificate). "About 7" does not become "7".
- "Owned" only for what the candidate owned. In a teammate's repo, state the role and the part.
- Each tool belongs to the project it was used in.
- Every line has to survive "tell me more about that" in an interview.

### Sentences

- No em dashes, en dashes or semicolons. Date ranges read "Feb to Jun 2027". Header lines separate items with " · ".
- A bullet is two lines, three at most: verb, what was built, how, and a number.
- Plain words. None of "leverage", "robust", "seamless", "passionate", "results-driven", "spearheaded".

## Application questions

When the user asks for help with the portal's free-text questions:

- Check their course list against GitHub and local folders first, then ask about missing projects with AskUserQuestion at the end.
- Draft at mid length, two to four sentences per answer: the course or project, what they did, one number.
- When the user rewrites an answer in their own words, keep their version. Fix grammar and nothing else. Their voice convinces more than a polished paragraph.
- Flag anything that contradicts the resume or credits a tool to the wrong project.
- Keep the address, phone, email, voluntary disclosures and the referrer's name out of anything that gets published.

## First run

With no `profile.md` or `base.json`:

1. Find what exists: resumes and cover letters in the project and home folders, the LinkedIn text if the user pastes it, GitHub through `gh`, certificates.
2. Ask one round of questions for what cannot be found: dates, graduation plan, awards, team sizes, what to leave off and why.
3. Verify every number at its source and write `profile.md` with sections Identity, Education, Experience, Projects, Verified numbers, Never include, Wording, Corrections.
4. Write `base.json` in this shape, then continue from step 1:

```json
{
  "name": "First Last",
  "title": "Role · Available in City from Month Year",
  "contact": ["email · phone · Region, Country", "linkedin.com/in/x · github.com/x"],
  "summary": "Three or four sentences.",
  "sections": [
    {"head": "Experience", "entries": [
      {"left": "Organization", "right": "City, Country", "sub_left": "Role", "sub_right": "Jan 2025 to Present",
       "bullets": ["Verb, what, how, number."]},
      {"left": "Project name | Stack, in italics", "right": "Mar to Jun 2026", "bullets": ["..."]}
    ]}
  ],
  "rows": [
    {"head": "Skills", "items": [["Programming", "Python, SQL"]]},
    {"head": "Languages", "items": ["English: native · Spanish: native"]}
  ],
  "never": ["phrases that must not appear"]
}
```

`build.py` writes PDF only. If a portal refuses PDF, say so and build the DOCX by hand for that application.
