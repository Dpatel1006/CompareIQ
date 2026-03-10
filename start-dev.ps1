# CompareIQ — Clean Start Script
# Kills any processes on ports 3000 and 3001, then starts backend + frontend
# Usage: Run this from E:\CompareIQ

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CompareIQ — Clean Dev Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill ports 3000 and 3001
Write-Host "→ Clearing ports 3000 and 3001..." -ForegroundColor Yellow
@(3000, 3001) | ForEach-Object {
    $port = $_
    $pids = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess
    if ($pids) {
        $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
        Write-Host "  ✓ Port $port freed" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Port $port already free" -ForegroundColor Gray
    }
}

# Step 2: Kill any other stray node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "→ Starting Backend (port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\CompareIQ\backend; Write-Host 'BACKEND — http://localhost:3001' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 5

Write-Host "→ Starting Frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\CompareIQ\frontend; Write-Host 'FRONTEND — http://localhost:3000' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Both servers launching in new windows" -ForegroundColor Green
Write-Host "  Frontend → http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend  → http://localhost:3001" -ForegroundColor Green
Write-Host "  API Docs → http://localhost:3001/api/docs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
