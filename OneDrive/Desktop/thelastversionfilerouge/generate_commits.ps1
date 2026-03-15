$startDate = Get-Date -Year 2026 -Month 3 -Day 15
$endDate = Get-Date # Today
$totalCommits = 90

# Calculate the time interval between each commit
$timeSpan = $endDate - $startDate
$intervalMinutes = $timeSpan.TotalMinutes / $totalCommits

Write-Host "Creating $totalCommits commits between $($startDate.ToString('yyyy-MM-dd')) and $($endDate.ToString('yyyy-MM-dd'))..."

# Initial commit for the files
git add .
$firstCommitDate = $startDate.ToString("yyyy-MM-ddTHH:mm:ss")
$env:GIT_AUTHOR_DATE = $firstCommitDate
$env:GIT_COMMITTER_DATE = $firstCommitDate
git commit -m "Initial project commit"

# Generate the remaining 89 empty commits to build up the history
for ($i = 1; $i -lt $totalCommits; $i++) {
    $commitDate = $startDate.AddMinutes($intervalMinutes * $i).ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $commitDate
    $env:GIT_COMMITTER_DATE = $commitDate
    $commitMessage = "Refactor and improve codebase (Part $i)"

    git commit --allow-empty -m $commitMessage | Out-Null
}

Write-Host "Successfully generated $totalCommits commits!"
