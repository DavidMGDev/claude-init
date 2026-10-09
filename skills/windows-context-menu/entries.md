# Context menu ledger

Every custom entry and menu mod made on the owner's machine, oldest first. Keys
are relative to `HKCU\Software\Classes`. Script paths use `<tools>` for the
folder the machine keeps its scripts in, `<scratch>` for a throwaway folder and
`~` for the home folder; the
registry holds the real path. `SKILL.md` says when and how to update this file.

"Recorded" is the day the row was written. Rows dated 2026-10-06 with "found"
were already registered when the ledger started, so their real age is unknown.

## Static verbs

### Open Claude Code here

| | |
| --- | --- |
| Keys | `Directory\shell\ContinueWithClaudeCode`, `Directory\Background\shell\ContinueWithClaudeCode` |
| Command | `wt.exe -d "%V." cmd /k claude` |
| Icon | `"~\.local\bin\claude.exe",0` |
| Recorded | 2026-10-06, found |

Opens Windows Terminal in the folder and starts Claude Code. The key name does
not match the label on purpose: `ContinueWith...` sorts ahead of `git_gui` and
`git_shell`. The `.` after `%V` is the trailing-backslash guard for drive roots.
A console is wanted here, so there is no `wscript` wrapper.

### Continue with T3Code

| | |
| --- | --- |
| Keys | `Directory\shell\ContinueWithT3Code`, `Directory\Background\shell\ContinueWithT3Code` |
| Command | `wscript.exe "<tools>\t3code\t3here.vbs" "%V"` |
| Icon | `"~\AppData\Local\Programs\t3code\T3 Code (Alpha).exe",0` |
| Recorded | 2026-10-06, found |

Opens the folder as a T3 Code project, creating the project only when that
path has none yet. The `.vbs` hides the console and hands off to `t3here.ps1`.
Named to sort with the entry above.

### Paste into Markdown File

| | |
| --- | --- |
| Keys | `Directory\Background\shell\PasteIntoMarkdownFile` |
| Command | `wscript.exe "<tools>\paste-markdown\pastemd.vbs" "%V"` |
| Icon | none |
| Recorded | 2026-10-06, found |

Writes the clipboard text into a new `Clipboard.md` in the folder, numbered
like an Explorer duplicate when one exists. The `.vbs` hides the console and
hands off to `pastemd.ps1`. Background only.

### Convert to MP3

| | |
| --- | --- |
| Keys | `SystemFileAssociations\.ogg\shell\ConvertToMp3`, and the same key under each extension listed below |
| Command | `wscript.exe "<scratch>\ogg2mp3\ogg2mp3.vbs" "%1"` |
| Icon | none |
| Recorded | 2026-10-06 for `.ogg` and `.webm`, 2026-10-09 for the other sixteen |

Extensions: `.ogg` `.webm` `.opus` `.oga` `.weba` `.spx` `.m4a` `.aac` `.flac`
`.wma` `.amr` `.aiff` `.aif` `.wv` `.mka` `.ac3` `.caf` `.3ga`. Each was
converted once from a generated file. `.wav` and `.mp3` are left out on
purpose, and `.ape` because ffmpeg cannot write one to test with.

Shows on those files only and writes `<name>.mp3` beside the source with
`ffmpeg.exe -vn -q:a 2`, so a `.webm` with video gives its audio track.
Every key runs the same script. It skips with a dialog when the `.mp3` already exists.
The script is the one printed in `SKILL.md` under "One executable, no
PowerShell". Needs ffmpeg on the saved PATH. Works on up to 15 selected files.
The script sits in a scratch folder, not with the other tools, so the entry
breaks if that folder is cleared.

## Menu mods

### Classic context menu

| | |
| --- | --- |
| Keys | `CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32`, empty default value |
| Recorded | 2026-10-06, found |

On. Every entry above therefore shows in the first menu, not under Show more
options. Delete the `{86ca1aa0-...}` key to undo.

### PowerRename legacy handler removed

| | |
| --- | --- |
| Keys | `Directory\Background\shellex\ContextMenuHandlers\PowerRenameExt`, `AllFileSystemObjects\shellex\ContextMenuHandlers\PowerRenameExt`, both deleted |
| Recorded | 2026-10-06, found still absent |

Removes the second PowerRename entry that the classic menu exposes.
`restore-powerrename-legacy-shellex.reg` puts the keys back. A PowerToys update
can recreate them.

## Left alone

App-registered handlers seen in the user hive on 2026-10-06 and not touched:
PowerToys `FileLocksmithExt` under `AllFileSystemObjects` and `Drive`, and
PowerToys `ImageResizer` under `SystemFileAssociations` for fourteen image
extensions. If either shows twice in the menu, the de-duplication steps in
`SKILL.md` apply.
