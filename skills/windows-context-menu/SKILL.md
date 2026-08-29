---
name: windows-context-menu
description: "Add, position, or de-duplicate entries in the Windows Explorer right-click menu through the registry. Use when adding an \"Open X here\" verb, when an entry lands in the wrong place or under Show more options, when a menu item appears twice, or when a context-menu command flashes a console window."
---

# Windows context menu

Everything here was verified on Windows 11 26200 with the classic context menu
enabled. Registry paths are `HKCU`, so none of it needs admin rights.

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

**Use `%V` for the path, not `%1`.** `%1` works under `Directory` but expands to
nothing under `Directory\Background`. `%V` is correct for both. Guard against a
trailing backslash when the target may be a drive root: `"C:\"` ends up
escaping the closing quote.

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
