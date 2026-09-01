---
name: coursework-notebook
description: "Write or revise the prose in a data-analysis notebook so it reads as the student's own coursework: their voice, and nothing above the line the course has actually crossed. Always asks first which classes and labs have been covered. Use when writing or trimming markdown cells and code comments in a lab or project notebook, when a section sounds too polished or too advanced to be defensible, or when preparing a group deliverable in Colab."
argument-hint: "Which notebook, and which part is yours"
---

# Coursework notebook

A notebook that gets graded is not judged only on being right. It is judged on
being **plausibly yours**. A correct paragraph that quotes a concept the course
never taught costs more than the point it makes: it reads as copied, and the
student has to defend it out loud.

Two jobs, always both:

1. Keep every sentence inside the knowledge the course has actually delivered.
2. Make it sound like the student, not like a textbook and not like an assistant.

## Ask before you write a word

The course scope is **not in this skill** and never will be — it changes every
term. Get it from the user at the start of every run. Ask, in one message:

- **Which classes and labs have you had so far?** Names, numbers, or dates.
- **Where are those materials?** A folder of notebooks, slides, PDFs.
- **Where is the assignment statement?** The enunciado is scope too.
- **Which cells are yours?** In a group deliverable, everything else is off limits.

Then **read the materials before writing.** Not skim — read, and build a
concrete list of what they cover: the concepts named, the functions used, the
vocabulary. That list is the ceiling. Do not reconstruct it from what you
already know about the subject; the point is what *this course* said.

If the user says "just use your judgement", push back once: the whole value of
this skill is the boundary, and guessing it defeats the purpose.

## The knowledge line

Three sources are in scope, nothing else:

| Source | Status |
|---|---|
| The class materials named by the user | In scope, including anything demonstrated in code |
| The assignment statement | In scope **even if class never said it** — if the enunciado says "RMSE" or "imputaciones por tipo", those words are yours to use |
| Everything else | Out |

**Out of scope does not mean the idea is out — the vocabulary is.** Almost
always the finding survives and only the label dies. Keep what was observed,
delete the name for it.

Real examples of that swap:

| Term that had to go | What replaced it |
|---|---|
| "dimensión degenerada" | nothing — the sentence continued straight into *why* it lives in the fact table |
| "llave sustituta" | "un id correlativo" |
| "llave natural" | "las columnas que la identifican" |
| "idempotencia" | "volver a correr la carga con los mismos datos no agrega filas repetidas" |
| "filas huérfanas" / "integridad referencial" | "filas sin id en la dimensión" |
| "rompe la primera forma normal" | cut — the consequence ("no se puede agrupar por puesto sin partir la cadena") was already there and did the work |
| "MedAE", "el error típico es más honesto que el promedio" | "el error de cada una" |
| "es un ensayo controlado" | "comparamos contra el valor real, que lo conocemos de antemano" |
| "la asimetría de 8.7 y 6.6" | "la media queda muy por encima de la mediana" |
| "las cuatro dimensiones de calidad" | "cada métrica" |

Note the shape: the replacement is usually **longer and plainer** than the term.
That is correct. A student who does not know the word describes the thing.

Print labels and DataFrame values count as prose. A `'tipo'` column reading
`Numérica continua asimétrica` is the same tell as a paragraph saying it.

## The voice

Spanish. First person **plural** even for a section written alone — it is a
group deliverable: *pusimos, leímos, dejamos anotado, nos pareció, caímos en
que*.

Long sentences chained with commas and `y`, the way someone talks through a
problem out loud. Connectors that carry the weight: **o sea que**, **así que**,
**y por eso**, **lo que pasa es que**, **al mirarlas**, **de ahí salen**, **hay
que tenerlo claro**.

Reference lines, verbatim from notebooks that were accepted:

> La jerarquía de League a Region que pusimos en la Dim_Liga_Region no existe.
> Las 31 ligas tienen jugadores de varias regiones y ninguna de las 170
> nacionalidades aparece en dos, o sea que Region cuelga de la nacionalidad y no
> de la liga, que visto después es bastante obvio.

> Al principio nos pareció que algo estaba mal, hasta que caímos en que refleja
> quiénes eran los faltantes, porque los jugadores sin valor registrado son en
> su mayoría de ligas menores y rating bajo.

> Hay un caso donde el número no nos favorece y lo dejamos anotado, y es que en
> potential la posición aporta casi nada, 56.2 % contra 56.4 %. Aun así dejamos
> el mismo esquema en las cuatro, porque tener cuatro procedimientos distintos
> nos pareció peor que perder esa décima.

> No se corrigen ni se eliminan porque son valores extremos legítimos y no
> errores. Lo que ajustamos es el supuesto.

What those have in common, and what to copy:

- **The messy path stays in.** "Al principio nos pareció que algo estaba mal,
  hasta que caímos en que…" is worth more than the clean conclusion. So is
  admitting the group's own earlier work was wrong, and that in hindsight it was
  obvious.
- **Results that do not help are reported anyway**, with the decision to keep
  going and why.
- **Numbers inline and exact**: `1 552 filas`, `un 6.95 %`, `56.4 %`. Space as
  the thousands separator, space before `%`.
- **Decisions land as decisions**: "no se tocan", "se marca en vez de
  corregirse", "lo dejamos aparte".

Formatting: prose paragraphs, not bullet lists, inside explanatory cells. No em
dashes. Match the heading style the teammates already used in the file rather
than inventing one. Code comments are short, lowercase, and say **why**, not
what — `# el potencial nunca puede quedar por debajo del rating actual`, not a
restatement of the line below.

## Over-explaining

The most common failure is not a wrong word, it is a right paragraph that says
too much. Cut on sight:

- Justifying a method **in general** ("la mediana es robusta ante atípicos
  porque…") when the cell only needs to say it was used and what came out.
- Defining a term the course already defined. The reader is the professor.
- A second sentence that restates the first in other words.
- Telling the reader that something matters, is interesting, or is important.
  Show the number and stop.
- Supporting detail that does not change the decision. One trimmed cell dropped
  "los porteros que sí traen los seis atributos son 1 787 de FIFA 24 más un caso
  de FIFA 21 que está registrado como portero y lateral a la vez" — true, and
  the point was already made.

A useful gut check: **could this student have said this sentence out loud in a
defense, unprompted?** If it only works written down, it is too high.

Target roughly 40–250 words per markdown cell. A cell over 300 is almost
certainly explaining something twice.

## Never touch a teammate's cells

In a group notebook the student owns specific cells. Everything else is
untouchable, including cells that are wrong.

- Get the owned range explicitly. Do not infer it from writing style.
- After editing, **assert** the other cells are byte-identical. Print the
  assertion result; do not eyeball it.
- If something of the teammates' genuinely needs to change, **report it and
  stop.** Give them the exact cell and the exact edit. Let the student carry it
  to the group.

## The student's own deletions are final

If a cell differs from your local copy in a way you did not make, that is almost
certainly the student editing their own work — often deleting something *because
it was too advanced to defend*. That is this skill working, not a regression.

**Never restore it. Ask.**

Diff against what is actually in the shared notebook right now, not against a
local snapshot from earlier in the session. A snapshot goes stale the moment the
student opens Colab.

## Delivering into a shared Colab

When the notebook lives in someone else's Colab, uploading a new `.ipynb`
overwrites their work. Ship copy-paste blocks instead: one block per changed
cell, a copy button, a diff against what is in Colab today, and a checkbox that
remembers what has been pasted.

Label each block with its **absolute cell index counting every cell from 0**,
markdown and code together, and with the cell type — a markdown cell pasted into
a code cell renders as garbage.

## Verify before saying it is done

Editing `.ipynb` JSON directly is fine and often easier than a notebook editor.
What is not fine is claiming it works without these:

- `ast.parse` every code cell.
- Assert the teammates' cells are unchanged.
- Run the notebook headless (`nbclient`, stubbing `drive.mount` and repointing
  paths at a local copy of the data) and report the error count.
- Diff stored outputs against the fresh run. Anything that differs is either a
  real break or a stored output you forgot to update.
- If you changed a print label or a value that appears in a stored output,
  **mirror it into the stored output** — and re-pad the column alignment, since
  pandas aligns to the widest value and a shorter label breaks the table.
- Grep every file you produce for local paths (`C:\`, `AppData`, `Temp`, the
  vault folder). A stored output that leaks the student's home directory is a
  tell on its own. Drive paths like `/content/drive/...` are fine.

Deliverable data files get their own check: row counts, nulls, duplicates,
foreign keys that resolve, one row per unit at the declared grain, and text that
still has its accents. Compare them byte-for-byte against a fresh run,
normalising line endings first — `\r\n` vs `\n` accounts for exactly one byte
per line and is not a real difference.
