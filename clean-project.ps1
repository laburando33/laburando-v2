Write-Host "🧼 Limpiando proyecto Laburando..."

# Borrar node_modules globales del monorepo
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue

# Borrar node_modules dentro de apps
Remove-Item -Recurse -Force "apps\web\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "apps\mobile\node_modules" -ErrorAction SilentlyContinue

# Borrar carpetas innecesarias de otros subproyectos
Remove-Item -Recurse -Force "apps\web\.next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".turbo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".vscode" -ErrorAction SilentlyContinue

# Borrar backups, logs y archivos innecesarios
Get-ChildItem -Path . -Include *.log, *.tmp, *.bak -Recurse | Remove-Item -Force

Write-Host "✅ Limpieza completada. Ahora ejecutá npm install solo en apps/mobile si vas a hacer build."
