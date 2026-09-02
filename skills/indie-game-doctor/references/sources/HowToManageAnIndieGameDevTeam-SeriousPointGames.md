Here is a comprehensive, structured extraction of all the indie game development direction, team management, pipeline, design, and production knowledge shared in the talk:

---

# Comprehensive Indie Game Development & Team Direction Guide

---

## 1. Core Philosophy: "One Shoe Doesn't Fit All"
* **Adaptive Management:** Production methods, pipelines, and management strategies cannot be one-size-fits-all. They must scale and adapt dynamically to your team's size, individual workstyles, communication needs, and development phases.
* **Iterative Organization:** Studio processes should be playtested and iterated upon just like game mechanics. Expect to make mistakes, learn from them, and restructure as the team expands.

---

## 2. Managing Diverse Workstyles: Merging Structure and Flexibility

Every team member operates on a different spectrum of structure vs. flexibility:

### Workstyle Profiles
* **Person A (Structure-Oriented):**
  * Thrives on clear routines, predictable schedules, explicit milestones, and reliable sources of reference.
  * Reliable output when clear instructions, specifications, and regular check-ins are provided.
* **Person B (Autonomy/Flexibility-Oriented):**
  * Thrives on creative freedom, exploring alternative solutions, and variety.
  * Rapidly adapts to change and solves complex problems when given ownership over their workflow.

### The Hybrid Kanban + KPI System
To balance both workstyles without micromanagement:
1. **Macro Structure via KPIs (Key Performance Indicators):**
   * Set measurable, reasonable weekly output expectations (e.g., 1 completed asset card per team member per week).
   * Across a 12-person art sub-team, this reliably forecasts ~48 assets per month.
2. **Micro Flexibility via Self-Selection Backlogs:**
   * Break macro deliverables into a backlog of granular task cards.
   * Provide a **selection phase** where developers choose their own task from the backlog on their own schedule.
   * Structure-driven members receive clear task criteria and predictability; autonomy-driven members maintain agency over what they work on and how they tackle it.
3. **Compassionate Policy (Especially for Volunteer/Zero-Hours Indie Teams):**
   * Maintain flexibility for personal life events or zero-hour contracts—if a developer cannot deliver during a specific week, allow them to defer without penalty while keeping team communication open.

---

## 3. Tool & Pipeline Strategy: Standardize Outcomes, Not Software

* **Software Agnosticism (Blender vs. Maya / Photoshop vs. Substance):**
  * Mandating a single 3D or 2D creation tool harms morale and slows onboarding if artists are forced out of their preferred workflow.
  * Focus on standardizing the **Outcome / Export Format** (e.g., standard `.FBX` scale/pivot settings, `.PNG` textures with strict naming conventions) rather than policing the creation tool.
* **Exceptions to the Rule:**
  * Strict software constraints should only exist when driven by hard technical requirements (e.g., a proprietary game-engine plugin, specific rig compatibility, or automated pipeline scripts).
  * Always clearly explain the *why* behind technical tool mandates.

---

## 4. Task Information Density: Pre-Production vs. Production

The detail of a task specification should match the development phase and desired level of creative exploration:

| Development Phase | Task Information Density | Purpose / Objective | Example |
| :--- | :--- | :--- | :--- |
| **Pre-Production / Prototyping** | **Low–Medium Detail** (High Freedom) | Exploration, research, look-development, and creative problem solving. | *"Experiment with particle styles and propose a visual direction."* |
| **Production** | **High Detail** (Specific & Descriptive) | Fast execution, consistency, clear acceptance criteria, and engine readiness. | *"Create a localized falling-snow particle system (Texture: 512x512, max 100 particles/sec, scale: 0.1–0.3)."* |

* **Rule of Thumb:** If you need a specific, non-negotiable result, make the task descriptive and unambiguous. If you want creative input and ideation, keep the brief open and encourage feedback loops.

---

## 5. Living Documentation & Standard Operating Procedures (SOPs)

### Why Traditional GDDs Fail
* Static, multi-page PDFs or monolithic Game Design Documents (GDDs) quickly become tedious, unread, and obsolete as design evolves.

### The Living Documentation Model
* **Dynamic Single Source of Truth (SSOT):**
  * Centralize game design, art guides, lore, narrative trees, and engine specs in living visual workspaces (e.g., *Milanote*, *Notion*, or *Lark*).
  * The documentation grows and updates in real-time alongside development.
  * Cross-department visibility allows sound, animation, 3D, and narrative designers to reference each other's progress instantly without scheduling alignment meetings.
* **Standard Operating Procedures (SOPs):**
  * Create clear, modular SOPs for critical asset handoffs (e.g., *Folder Structure -> Awaiting Texturing -> Model Review -> Engine Integration*).
  * Establishes objective standards for quality, file naming, and repository management.

---

## 6. Feedback Architecture & Studio Morale

Long indie cycles (2–4+ years) require deliberate feedback loops to sustain team morale:

### 1. Self-Assessment Method (Best for Creative Reviews)
* Before critiquing work, ask the creator:
  > *"Which version is your favorite and why? Why did you pick Choice A over Choice B?"*
* **Benefits:**
  * Empowers the artist to defend and explain their creative reasoning.
  * Shifts feedback from top-down judgment to a collaborative dialogue.
  * Reinforces a sense of ownership over the final game assets.

### 2. Actionable Feedback Sandwich
* **Layer 1 (Praise Strengths):** Highlight specific positive elements that succeed.
* **Layer 2 (Constructive, Actionable Critique):** Clearly define what needs changing, why, and how to approach it.
* **Layer 3 (Reiterate Strengths & Offer Support):** End with encouragement and offer guidance or resources.

### 3. Avoiding Disingenuous / Backhanded Feedback
* **Harmful Feedback:** Vague, condescending phrases like *"Not bad for you"* or superficial comments like *"Looks good, just increase contrast"* without context.
* **Constructive Feedback:** Must be empathetic, specific, humane, and focused purely on project objectives rather than personal capability.
* **Response Timeliness:** Keep feedback turnaround tight (within 24–48 hours) so developers are never blocked or left feeling ignored.

---

## 7. Scalable Meeting Structures & Inclusive Facilitation

### The Pitfalls of Large Meetings
* All-hands meetings with **>20 people** become unproductive lectures where the majority remain silent observers.
* Direct 1-on-1s for every developer are impossible at scale (e.g., 70+ members).

### Tiered Departmental Meeting Flow
```
Sub-Team Meetings (Early Week: Mon–Wed)
[3D Art Team]   [Narrative Team]   [Programming Team]   [Audio Team]
       │                 │                  │                │
       └─────────────────┼──────────────────┼────────────────┘
                         ▼
             Department Leads Meeting (Thursday)
             (Blocker resolution & studio alignment)
                         │
                         ▼
        Feedback & Action Items Propagate Down to Teams
```

### The "Pose, Pause, Pick" (PPP) Facilitation Technique
To prevent dominant voices from monopolizing voice channels and meetings:
1. **Pose:** Ask a clear, open question to the room (e.g., *"What were your main blockers this week?"*).
2. **Pause:** Wait several seconds in silence. This allows introverted or reflective team members time to formulate their thoughts.
3. **Pick:** Call on specific members gently (e.g., *"Let's start with Amanda, then go to Chris"*).

---

## 8. Emotional Resilience & Leadership Mindset

* **Acknowledge the Emotional Cycle:** Managing a game project involves unavoidable phases of anxiety, creative doubt, frustration, and fatigue. Recognizing these as standard milestones of the development process prevents panic and burnout.
* **Foster Empathy:** Prioritize psychological safety, celebrate small wins in team chats, and build a culture where team members feel comfortable flagging problems early.