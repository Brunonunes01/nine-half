$ErrorActionPreference = "Stop"

Write-Host "==> Indo para a raiz do projeto..."
Set-Location -Path "$PSScriptRoot\.."

Write-Host "==> Removendo node_modules e package-lock.json..."
if (Test-Path "node_modules") {
  Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
  Remove-Item -Force "package-lock.json"
}

Write-Host "==> Atualizando versoes no package.json..."
npm pkg set dependencies.expo="^54.0.0"
npm pkg set dependencies.react="19.0.0"
npm pkg set dependencies.react-native="0.79.6"
npm pkg set dependencies.react-dom="19.0.0"
npm pkg set dependencies.react-native-web="^0.20.0"
npm pkg set dependencies.@expo/metro-runtime="~5.0.5"

Write-Host "==> Instalando dependencias..."
npm install

Write-Host "==> Aplicando ajustes recomendados pelo Expo..."
npx expo install --fix

Write-Host "==> Limpando cache e iniciando projeto..."
npx expo start -c

