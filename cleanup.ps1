$ports = @(3000, 3001)
foreach ($port in $ports) {
    $pids = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($pids) {
        foreach ($pid in $pids) {
            Write-Host "Killing process $pid on port $port"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Cleanup complete."
