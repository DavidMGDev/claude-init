---
name: windows-context-menu
description: "Add, position, or de-duplicate entries in the Windows Explorer right-click menu through the registry, and keep a ledger of every custom entry made. Use when adding an \"Open X here\" verb or a verb for one file type, when an entry lands in the wrong place or under Show more options, when a menu item appears twice, when a context-menu command flashes a console window, or when asked which custom entries exist."
---

# Windows context menu

Everything here was verified on Windows 11 26200 with the classic context menu
enabled. Registry paths are `HKCU`, so none of it needs admin rights.

## Record every change

`entries.md` in this folder is the ledger of every custom entry and menu mod.
Read it before adding anything, so you reuse a pattern that already works and
know which key names you are sorting against. The job is not done until the
ledger matches the registry:

1. Add, edit or remove the row in `entries.md` for whatever you added, renamed,
   moved or deleted. Write script paths as `<tools>\...` and the home folder as
   `~`, since the skill is public and the registry already holds the real path.
2. If the work taught something general, such as a placeholder that misbehaved
   or a class key not listed here, put it in the matching section of this file.
3. Ship both through `make-ci-skill` as an update to `windows-context-menu`.
   This step is the owner's standing instruction, so run it without asking.
   Where `make-ci-skill` is not installed, edit the copy in
   `~/.claude/skills/windows-context-menu/` instead.

To compare the ledger with what is really registered:

```powershell
$root = 'HKCU:\Software\Classes'
$classes = 'Directory','Directory\Background','DesktopBackground','Drive','*','AllFileSystemObjects'
$classes += Get-ChildItem -LiteralPath "$root\SystemFileAssociations" -ErrorAction SilentlyContinue |
  ForEach-Object { "SystemFileAssociations\$($_.PSChildName)" }
foreach ($c in $classes) {
  $p = "$root\$c\shell"
  if (Test-Path -LiteralPath $p) { Get-ChildItem -LiteralPath $p | ForEach-Object {
    $cmd = (Get-ItemProperty -LiteralPath "$($_.PSPath)\command" -ErrorAction SilentlyContinue).'(default)'
    '{0}\shell\{1} | {2} | {3}' -f $c, $_.PSChildName, (Get-ItemProperty -LiteralPath $_.PSPath).'(default)', $cmd } }
}
```

A row in the registry with no row in the ledger was made outside this skill:
add it. The sweep only covers the classes listed, so a verb registered under
some other class exists only in the ledger.

## The two menus

Windows 11 ships a trimmed menu that only renders packaged `IExplorerCommand`
handlers. Everything registered the classic way is pushed under **Show more
options**, which opens the Windows 10 menu.

The usual mod is an empty default value on this key, which unregisters the new
menu's shell extension and makes Explorer fall back to the classic one:

```powershell
$k = 'HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32'
New-Item -Path $k -Force | Out-Null
Set-ItemProperty -Path $k -Name '(default)' -Value ''
Stop-Process -Name explorer -Force
```

Delete the `{86ca1aa0-...}` key to go back. **The mod is why duplicates
appear**: it collapses both menus into one, so an app that registers both a
packaged handler and a legacy one now shows both at once.

## Three ways an entry gets there

| Mechanism | Registered at | Needs code? |
| --- | --- | --- |
| Static verb | `<class>\shell\<VerbName>` with a `command` subkey | No, just a command line |
| Legacy shell extension | `<class>\shellex\ContextMenuHandlers\<Name>` pointing at a CLSID implementing `IContextMenu` | In-process COM DLL |
| Packaged command | `desktop5:ItemType` / `desktop5:Verb` in an MSIX manifest, pointing at a CLSID implementing `IExplorerCommand` | COM DLL in a (possibly sparse) MSIX package |

Static verbs are the only kind you can create from the registry alone.

## Render order

Verified by observation. The order as a whole is not documented anywhere.

1. Static verbs with `Position` = `Top`
2. Explorer's own items: View, Sort by, Group by, Refresh, Customise, Paste
3. **Packaged `IExplorerCommand` handlers** (Open in Terminal, PowerRename)
4. **Static `shell` verbs**, sorted alphabetically by key name
5. **Legacy `shellex` handlers**
6. Give access to, New, Properties

A static verb can only ever land in group 1 or group 4. It cannot be
interleaved with groups 3 or 5.

## Placing a static verb

`Position` is a `REG_SZ` on the verb key and accepts only `Top` or `Bottom`.
There is no value that positions an entry relative to another item, and `Top`
means the top of the whole menu, above View, not the top of the extensions
block. It is usually too aggressive.

**The real lever is the key name.** Static verbs sort alphabetically,
case-insensitively, across the `HKLM` and `HKCU` class hives merged into
`HKEY_CLASSES_ROOT`. To sit at the head of group 4, name the key so it sorts
ahead of the neighbours already there. Check what you are competing with:

```powershell
Get-ChildItem 'Registry::HKEY_CLASSES_ROOT\Directory\Background\shell' |
  ForEach-Object { $p = Get-ItemProperty $_.PSPath
    '{0,-22} {1,-28} {2}' -f $_.PSChildName, $p.'(default)', $p.Position }
```

Naming a verb `ContinueWithT3Code` rather than `T3Code` is what moves it ahead
of `git_gui` and `git_shell`. The key name is never shown to the user, only the
default value is, so it is free to pick for sort order.

> Do **not** try to order verbs by setting the `shell` key's default value. That
> value names the **default verb**, the one that runs on double-click. Setting
> it on `Directory` would make double-clicking a folder run your command instead
> of opening the folder.

## Writing a static verb

```powershell
$key = 'HKCU:\Software\Classes\Directory\Background\shell\OpenSomethingHere'
New-Item -Path "$key\command" -Force | Out-Null
Set-ItemProperty -Path $key -Name '(default)' -Value 'Open Something here'
Set-ItemProperty -Path $key -Name 'Icon' -Value '"C:\Path\app.exe",0'
Set-ItemProperty -Path "$key\command" -Name '(default)' -Value '"C:\Path\app.exe" "%V"'
```

Values on the verb key:

| Value | Effect |
| --- | --- |
| `(default)` | The menu label. An `&` marks the keyboard accelerator. |
| `MUIVerb` | Label loaded from a resource; overrides `(default)` when present. |
| `Icon` | `"path\to.exe",0` for the first icon in a binary, or a path to an `.ico`. |
| `Position` | `Top` or `Bottom`. Omit for normal sort-order placement. |
| `Extended` | Present, even empty, means the entry only shows on Shift + right-click. |
| `NoWorkingDirectory` | Stops Explorer setting the working directory, which can matter for network paths. |

Which class key to register under:

| Class | Right-clicking |
| --- | --- |
| `Directory` | a folder |
| `Directory\Background` | empty space inside a folder |
| `Drive` | a drive in This PC |
| `*` | any file |
| `AllFileSystemObjects` | any file or folder |
| `SystemFileAssociations\.ext` | a file with that extension |

**Use `%V` for the path, not `%1`.** `%1` works under `Directory` but expands to
nothing under `Directory\Background`. `%V` is correct for both. Guard against a
trailing backslash when the target may be a drive root: `"C:\"` ends up
escaping the closing quote. Writing `"%V."` is the shortest guard, and the
Claude Code entry in `entries.md` relies on it.

### One file type only

Register under `SystemFileAssociations\.<ext>`, not under the extension's
ProgID. The ProgID belongs to whichever app currently opens the type, so a verb
placed there disappears when the default app changes.

```powershell
$key = 'HKCU:\Software\Classes\SystemFileAssociations\.ogg\shell\ConvertToMp3'
New-Item -Path "$key\command" -Force | Out-Null
Set-ItemProperty -Path $key -Name '(default)' -Value 'Convert to MP3'
Set-ItemProperty -Path "$key\command" -Name '(default)' -Value 'wscript.exe "C:\Path\ogg2mp3.vbs" "%1"'
```

- `%1` is the file's full path, and it is the right placeholder here.
- For a second file type, write the same verb key under that extension too and
  point it at the same script. `.webm` reuses the `.ogg` script this way.
- With several files selected, Explorer starts the command once per file, all
  at the same time. Three selected files gave three conversions.
- Past 15 selected files the verb does nothing: sixteen gave zero conversions.
  Microsoft documents the limit and the `MultipleInvokePromptMinimum` DWORD
  under `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer` that raises
  it (KB 2022295). Raising it was not tested here.
- A command line cannot build "same name, other extension" by itself.
  `%~dpn1` only works inside a batch file. Pass `%1` to a script and derive the
  output path there.

### Cascading submenu

Set `MUIVerb` plus `SubCommands` (an empty string) on the parent key, and put
the child verbs under `shell\<Parent>\shell\<Child>`.

## Suppressing the console window

A `command` pointing at `cmd.exe` or `powershell.exe` flashes a console for as
long as the command runs. `-WindowStyle Hidden` does not fix it, because the
console host is created before the window style is applied.

Point the command at `wscript.exe` and a small `.vbs` that relaunches the real
script with the window hidden:

```vbs
Dim fso, shell, folder, target
Set fso   = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
If WScript.Arguments.Count > 0 Then target = WScript.Arguments(0) Else target = folder
If Right(target, 1) = "\" Then target = Left(target, Len(target) - 1)
shell.Run "powershell -NoProfile -ExecutionPolicy Bypass -File """ & folder & _
          "\your-script.ps1"" """ & target & """", 0, False
```

The script is then invisible, so route its errors to a dialog rather than to a
console it no longer has:

```powershell
(New-Object -ComObject WScript.Shell).Popup($message, 0, 'Title', 16) | Out-Null
```

### One executable, no PowerShell

When the verb only has to run one program, the `.vbs` can do the whole job:
derive the output path, run the program hidden, wait, and show a dialog only on
failure. This is the script behind the `.ogg` verb above.

```vbs
Dim fso, src, dst, rc
Set fso = CreateObject("Scripting.FileSystemObject")
If WScript.Arguments.Count = 0 Then WScript.Quit 1
src = WScript.Arguments(0)
dst = fso.BuildPath(fso.GetParentFolderName(src), fso.GetBaseName(src) & ".mp3")
If fso.FileExists(dst) Then
  MsgBox "Already exists, skipped:" & vbCrLf & dst, 48, "Convert to MP3"
  WScript.Quit 1
End If
rc = CreateObject("WScript.Shell").Run("ffmpeg.exe -loglevel error -i """ & src & _
     """ -vn -q:a 2 """ & dst & """", 0, True)
If rc <> 0 Then MsgBox "ffmpeg failed (exit " & rc & ") on:" & vbCrLf & src, 16, "Convert to MP3"
```

- **Write the program name with its extension.** `Run("ffmpeg ...", 0, True)`
  fails with `Unable to wait for process`, while `ffmpeg.exe` and
  `cmd /c ffmpeg` both work. The cause was not found.
- **Debug with `cscript //nologo script.vbs args`.** Under `wscript` a script
  error goes to a dialog and the exit code is still 0, so a failed run from a
  terminal looks like a success that produced nothing.
- **The program has to be on Explorer's PATH**, which is the saved user and
  machine PATH, not the PATH of the shell you are testing from:

  ```powershell
  $saved = [Environment]::GetEnvironmentVariable('Path','User') + ';' +
           [Environment]::GetEnvironmentVariable('Path','Machine')
  $saved -split ';' | Where-Object { $_ -and (Test-Path (Join-Path $_ 'ffmpeg.exe')) }
  ```

- Paths with spaces, apostrophes, `%` and `&` came through this script intact.
- Keep the script in a folder that will not be cleaned up or moved, because the
  registry stores its absolute path.

## Testing a verb without the mouse

`Shell.Application` builds the same verb list Explorer does, so it can confirm
that an entry shows on the right items and can invoke it:

```powershell
$ns = (New-Object -ComObject Shell.Application).Namespace('C:\Path\to\folder')
$ns.ParseName('song.ogg').Verbs() | ForEach-Object Name          # what the menu holds
($ns.ParseName('song.ogg').Verbs() | Where-Object Name -eq 'Convert to MP3').DoIt()

$items = $ns.Items(); $items.Filter(0x40, '*.ogg')               # a multi-selection
$items.InvokeVerbEx('ConvertToMp3')                              # by key name
```

`Verbs()` matches on the label and `InvokeVerbEx` on the key name. Both return
at once, so poll for the result. This reads the registry fresh, so it proves the
registration and the command, not that Explorer has refreshed its cache.

## De-duplicating an entry

An app that supports both menus registers a packaged handler *and* a legacy
`shellex` handler. Under the classic menu mod both render, so the entry appears
twice: once in group 3 and once in group 5.

Find the legacy one, which is always the lower of the two:

```powershell
foreach ($c in 'Directory','Directory\Background','AllFileSystemObjects','*') {
  $p = "HKCU:\Software\Classes\$c\shellex\ContextMenuHandlers"
  if (Test-Path $p) { Get-ChildItem $p | ForEach-Object {
    '{0}  ->  {1}' -f $_.Name, (Get-ItemProperty $_.PSPath).'(default)' } }
}
```

Confirm the packaged one exists before deleting anything, so you don't remove
the entry outright:

```powershell
Get-AppxPackage -Name '*VendorName*' | ForEach-Object {
  Select-String -Path (Join-Path $_.InstallLocation 'AppxManifest.xml') `
    -Pattern 'desktop5:ItemType|desktop5:Verb' }
```

Then back the key up as a `.reg` file and delete it.

Worked example. PowerToys PowerRename registers CLSID
`{1861E28B-A1F0-4EF4-A1FE-4C8CA88E2174}` for `Directory`,
`Directory\Background` and `*` in the package
`Microsoft.PowerToys.PowerRenameContextMenu`, and separately registers the
legacy CLSID `{0440049F-D1DC-4E46-B27B-98393D79486B}` under
`Directory\Background\shellex\ContextMenuHandlers\PowerRenameExt` and
`AllFileSystemObjects\shellex\ContextMenuHandlers\PowerRenameExt`. Removing
those two legacy keys leaves exactly one entry, higher up the menu.
`restore-powerrename-legacy-shellex.reg` in this folder puts them back.

Expect an app to recreate its legacy keys on update or reinstall.

## Gotchas

- **Restart Explorer** after any change: `Stop-Process -Name explorer -Force`.
  Explorer caches the menu and will not pick edits up on its own.
- **Do not scan the class hives recursively.** `Get-ChildItem` over
  `HKLM:\SOFTWARE\Classes` or `HKEY_CLASSES_ROOT` takes minutes and will hit
  command timeouts. Test the exact paths you care about instead.
- `HKEY_CLASSES_ROOT` is a merged view of `HKLM\Software\Classes` and
  `HKCU\Software\Classes`. Write to `HKCU`, which needs no admin, and read from
  `HKCR` when you want to see what Explorer actually sees.
- Entries that seem missing are often `Extended`, so try Shift + right-click. On
  this machine `cmd` and `Powershell` under `Directory\Background\shell` are
  both hidden that way.
