set -eu

if ! command -v mise >/dev/null 2>&1; then
  curl https://mise.run | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

mise trust --yes mise.toml
mise install github:dahlia/seonbi@0.5.0
export PATH="$(mise where github:dahlia/seonbi@0.5.0):$PATH"

# Netlify has already installed Node, pnpm, and the package dependencies.
pnpm build
