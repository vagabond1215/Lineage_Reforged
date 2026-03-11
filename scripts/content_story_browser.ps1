Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([Threading.Thread]::CurrentThread.ApartmentState -ne [Threading.ApartmentState]::STA) {
    throw "This script must run in STA mode. Use run-content-browser.cmd or launch with powershell -STA."
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$workspaceRoot = Split-Path -Path $PSScriptRoot -Parent
$databaseRoot = Join-Path $workspaceRoot "packages/content/base"
$coverageRoot = Join-Path $workspaceRoot "docs/data-dictionary"
$storyRoot = Join-Path $workspaceRoot "story"

$script:selectedFilePath = $null

function New-FolderTag {
    param([string]$Path = "")
    return [pscustomobject]@{
        Kind = "folder"
        Path = $Path
    }
}

function New-FileTag {
    param([string]$Path)
    return [pscustomobject]@{
        Kind = "file"
        Path = $Path
    }
}

function Add-PlaceholderNode {
    param(
        [System.Windows.Forms.TreeNode]$Parent,
        [string]$Message
    )

    $node = New-Object System.Windows.Forms.TreeNode($Message)
    $node.Tag = [pscustomobject]@{
        Kind = "placeholder"
    }
    [void]$Parent.Nodes.Add($node)
}

function Get-OrAddFolderNode {
    param(
        [System.Windows.Forms.TreeNode]$Parent,
        [string]$Name,
        [string]$Path = ""
    )

    foreach ($child in $Parent.Nodes) {
        if ($null -ne $child.Tag -and $child.Tag.Kind -eq "folder" -and $child.Text -eq $Name) {
            return $child
        }
    }

    $node = New-Object System.Windows.Forms.TreeNode($Name)
    $node.Tag = New-FolderTag -Path $Path
    [void]$Parent.Nodes.Add($node)
    return $node
}

function Add-FileNodeFromParts {
    param(
        [System.Windows.Forms.TreeNode]$Parent,
        [string[]]$Parts,
        [int]$StartIndex,
        [string]$FullPath
    )

    if ($Parts.Length -eq 0 -or $StartIndex -gt ($Parts.Length - 1)) {
        return
    }

    $current = $Parent
    $lastIndex = $Parts.Length - 1

    for ($i = $StartIndex; $i -lt $lastIndex; $i++) {
        $current = Get-OrAddFolderNode -Parent $current -Name $Parts[$i]
    }

    $fileNode = New-Object System.Windows.Forms.TreeNode($Parts[$lastIndex])
    $fileNode.Tag = New-FileTag -Path $FullPath
    [void]$current.Nodes.Add($fileNode)
}

function Sort-TreeNodes {
    param([System.Windows.Forms.TreeNodeCollection]$Collection)

    $folders = @()
    $files = @()

    foreach ($node in $Collection) {
        if ($null -ne $node.Tag -and $node.Tag.Kind -eq "folder") {
            $folders += $node
        }
        else {
            $files += $node
        }
    }

    $sorted = @($folders | Sort-Object -Property Text) + @($files | Sort-Object -Property Text)
    $Collection.Clear()

    foreach ($node in $sorted) {
        [void]$Collection.Add($node)
        if ($node.Nodes.Count -gt 0) {
            Sort-TreeNodes -Collection $node.Nodes
        }
    }
}

function Get-RelativePath {
    param(
        [string]$RootPath,
        [string]$FullPath
    )

    return [System.IO.Path]::GetRelativePath($RootPath, $FullPath)
}

function Get-ReadableContent {
    param([string]$FilePath)

    $raw = Get-Content -LiteralPath $FilePath -Raw
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()

    if ($extension -eq ".json") {
        try {
            $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
            return $parsed | ConvertTo-Json -Depth 100
        }
        catch {
            return $raw
        }
    }

    return $raw
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "Story and Data Browser"
$form.StartPosition = "CenterScreen"
$form.Width = 1280
$form.Height = 780
$form.MinimumSize = New-Object System.Drawing.Size(1024, 640)

$splitContainer = New-Object System.Windows.Forms.SplitContainer
$splitContainer.Dock = "Fill"
$splitContainer.Orientation = "Vertical"
$splitContainer.SplitterDistance = 360
$splitContainer.Panel1MinSize = 260
$splitContainer.Panel2MinSize = 480

$treeView = New-Object System.Windows.Forms.TreeView
$treeView.Dock = "Fill"
$treeView.HideSelection = $false
$treeView.FullRowSelect = $true
$treeView.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$splitContainer.Panel1.Controls.Add($treeView)

$rightLayout = New-Object System.Windows.Forms.TableLayoutPanel
$rightLayout.Dock = "Fill"
$rightLayout.ColumnCount = 1
$rightLayout.RowCount = 3
[void]$rightLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::AutoSize)))
[void]$rightLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100)))
[void]$rightLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::AutoSize)))

$toolbar = New-Object System.Windows.Forms.FlowLayoutPanel
$toolbar.Dock = "Fill"
$toolbar.AutoSize = $true
$toolbar.FlowDirection = "LeftToRight"
$toolbar.Padding = New-Object System.Windows.Forms.Padding(8, 8, 8, 4)

$refreshButton = New-Object System.Windows.Forms.Button
$refreshButton.Text = "Refresh"
$refreshButton.AutoSize = $true

$openButton = New-Object System.Windows.Forms.Button
$openButton.Text = "Open Externally"
$openButton.AutoSize = $true
$openButton.Enabled = $false

[void]$toolbar.Controls.Add($refreshButton)
[void]$toolbar.Controls.Add($openButton)

$contentBox = New-Object System.Windows.Forms.TextBox
$contentBox.Dock = "Fill"
$contentBox.Multiline = $true
$contentBox.ReadOnly = $true
$contentBox.ScrollBars = "Both"
$contentBox.WordWrap = $false
$contentBox.Font = New-Object System.Drawing.Font("Consolas", 10)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Dock = "Fill"
$statusLabel.Padding = New-Object System.Windows.Forms.Padding(8, 6, 8, 8)
$statusLabel.AutoSize = $true
$statusLabel.Text = "Ready."

[void]$rightLayout.Controls.Add($toolbar, 0, 0)
[void]$rightLayout.Controls.Add($contentBox, 0, 1)
[void]$rightLayout.Controls.Add($statusLabel, 0, 2)

$splitContainer.Panel2.Controls.Add($rightLayout)
$form.Controls.Add($splitContainer)

function Load-TreeView {
    $treeView.BeginUpdate()
    try {
        $treeView.Nodes.Clear()

        $databasesNode = New-Object System.Windows.Forms.TreeNode("Databases")
        $databasesNode.Tag = New-FolderTag -Path $databaseRoot

        if (Test-Path -LiteralPath $databaseRoot) {
            $databaseFiles = Get-ChildItem -LiteralPath $databaseRoot -Recurse -File -Filter "*.json" | Sort-Object -Property FullName
            foreach ($file in $databaseFiles) {
                $relative = Get-RelativePath -RootPath $databaseRoot -FullPath $file.FullName
                $parts = $relative -split "[\\/]"
                if ($parts.Length -eq 1) {
                    Add-FileNodeFromParts -Parent $databasesNode -Parts $parts -StartIndex 0 -FullPath $file.FullName
                    continue
                }

                $topGroup = Get-OrAddFolderNode -Parent $databasesNode -Name $parts[0]
                Add-FileNodeFromParts -Parent $topGroup -Parts $parts -StartIndex 1 -FullPath $file.FullName
            }
        }

        if ($databasesNode.Nodes.Count -eq 0) {
            Add-PlaceholderNode -Parent $databasesNode -Message "(No JSON database files found.)"
        }

        $coverageNode = New-Object System.Windows.Forms.TreeNode("Coverage Reports")
        $coverageNode.Tag = New-FolderTag -Path $coverageRoot

        if (Test-Path -LiteralPath $coverageRoot) {
            $candidates = @()
            $candidates += Get-ChildItem -LiteralPath $coverageRoot -File -Filter "*coverage*report*.md" -ErrorAction SilentlyContinue
            $candidates += Get-ChildItem -LiteralPath $coverageRoot -File -Filter "*report*.md" -ErrorAction SilentlyContinue
            $candidates += Get-ChildItem -LiteralPath $coverageRoot -File -Filter "*coverage*.md" -ErrorAction SilentlyContinue
            if ($candidates.Count -eq 0) {
                $candidates = Get-ChildItem -LiteralPath $coverageRoot -File -Filter "*.md" -ErrorAction SilentlyContinue
            }

            $coverageFiles = $candidates | Sort-Object -Property FullName -Unique
            foreach ($file in $coverageFiles) {
                $relative = Get-RelativePath -RootPath $coverageRoot -FullPath $file.FullName
                $parts = $relative -split "[\\/]"
                Add-FileNodeFromParts -Parent $coverageNode -Parts $parts -StartIndex 0 -FullPath $file.FullName
            }
        }

        if ($coverageNode.Nodes.Count -eq 0) {
            Add-PlaceholderNode -Parent $coverageNode -Message "(No coverage report files found.)"
        }

        $storyNode = New-Object System.Windows.Forms.TreeNode("Story")
        $storyNode.Tag = New-FolderTag -Path $storyRoot

        if (Test-Path -LiteralPath $storyRoot) {
            $storyFiles = Get-ChildItem -LiteralPath $storyRoot -Recurse -File -Filter "*.md" | Sort-Object -Property FullName
            foreach ($file in $storyFiles) {
                $relative = Get-RelativePath -RootPath $storyRoot -FullPath $file.FullName
                $parts = $relative -split "[\\/]"
                Add-FileNodeFromParts -Parent $storyNode -Parts $parts -StartIndex 0 -FullPath $file.FullName
            }
        }

        if ($storyNode.Nodes.Count -eq 0) {
            Add-PlaceholderNode -Parent $storyNode -Message "(No story markdown files found.)"
        }

        [void]$treeView.Nodes.Add($databasesNode)
        [void]$treeView.Nodes.Add($coverageNode)
        [void]$treeView.Nodes.Add($storyNode)

        Sort-TreeNodes -Collection $treeView.Nodes
        foreach ($root in $treeView.Nodes) {
            $root.Expand()
        }
    }
    finally {
        $treeView.EndUpdate()
    }
}

$treeView.add_AfterSelect({
        param($sender, $eventArgs)

        $node = $eventArgs.Node
        if ($null -eq $node -or $null -eq $node.Tag -or $node.Tag.Kind -ne "file") {
            $script:selectedFilePath = $null
            $openButton.Enabled = $false
            return
        }

        $script:selectedFilePath = $node.Tag.Path
        $openButton.Enabled = $true
        $statusLabel.Text = "Selected: $([System.IO.Path]::GetRelativePath($workspaceRoot, $script:selectedFilePath))"

        try {
            $contentBox.Text = Get-ReadableContent -FilePath $script:selectedFilePath
            $contentBox.SelectionStart = 0
            $contentBox.ScrollToCaret()
        }
        catch {
            $contentBox.Text = "Unable to read file:`r`n$($_.Exception.Message)"
        }
    })

$refreshButton.add_Click({
        $contentBox.Clear()
        $script:selectedFilePath = $null
        $openButton.Enabled = $false
        $statusLabel.Text = "Refreshing..."
        Load-TreeView
        $statusLabel.Text = "Ready. Select a file from the tree."
    })

$openButton.add_Click({
        if ($null -eq $script:selectedFilePath) {
            return
        }

        if (-not (Test-Path -LiteralPath $script:selectedFilePath)) {
            [void][System.Windows.Forms.MessageBox]::Show(
                "The selected file no longer exists.",
                "Open Externally",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Warning
            )
            return
        }

        Start-Process -FilePath $script:selectedFilePath
    })

$form.add_Shown({
        Load-TreeView
        $statusLabel.Text = "Ready. Select a file from the tree."
    })

[void]$form.ShowDialog()
