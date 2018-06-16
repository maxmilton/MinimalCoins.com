#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
trap 'echo_err "Aborting due to failure."; finish &> /dev/null' ERR

# options (private; set externally)
BUILD_DIR="${BUILD_DIR:-$(mktemp -d -t build.XXXXXXXXXX)}"
DEPLOY_FILE="${DEPLOY_FILE:-deploy.tgz}"
REMOTE_SSH="${REMOTE_SSH:?Need to set REMOTE_SSH non-empty}"
REMOTE_PATH="${REMOTE_PATH:?Need to set REMOTE_PATH non-empty}"
REMOTE_DIR="${REMOTE_DIR:-html}"
FS_PERMISSIONS="${FS_PERMISSIONS:?Need to set FS_PERMISSIONS non-empty}"
BACKUPS_TO_KEEP=5
CLOUDFLARE_SITE="minimalcoins.com"

# feedback utilities
echo_err() { echo -e "\\n\\033[1;31mError:\\033[0m ${1}" 1>&2; echo -en "\\a\\n"; exit 2; }
echo_info() { echo -e "\\n${1}\\n" >&1; }

# check we're on the master git branch
[[ $(git rev-parse --abbrev-ref HEAD) != "master" ]] && echo_err 'Not on git "master" branch.'

# check linting and tests are passing
yarn run lint || echo_err 'Linting failed'
yarn run test || echo_err 'Running tests suite failed'

# run build
yarn run build || echo_err "Build failed"

# bundle deployable package
echo_info 'Creating deployable file...'
tar -cJf "$BUILD_DIR"/"$DEPLOY_FILE" ./dist && echo_info "Done; $(wc -c "$BUILD_DIR"/"$DEPLOY_FILE")"

# upload deploy file to the production server
echo_info "Uploading package to ${REMOTE_SSH} server..."
upload() {
  rsync -vv --partial --progress --rsh=ssh "$BUILD_DIR"/"$DEPLOY_FILE" "$REMOTE_SSH":~/
}
# try uploading up to 3 times in case of errors
upload || upload || upload || exit 2

# execute commands on the remote server
echo_info "Executing commands on ${REMOTE_SSH} server..."
ssh "$REMOTE_SSH" DEPLOY_FILE="$DEPLOY_FILE" REMOTE_PATH="$REMOTE_PATH" REMOTE_DIR="$REMOTE_DIR" BACKUPS_TO_KEEP="$BACKUPS_TO_KEEP" FS_PERMISSIONS="$FS_PERMISSIONS" '/bin/sh -sx' <<'ENDSSH'
  sudo mkdir -p "$REMOTE_PATH"
  sudo mv ~/"$DEPLOY_FILE" "$REMOTE_PATH"
  sudo tar -cJf "$REMOTE_PATH"/"$REMOTE_DIR"-backup-$(date --iso-8601=minutes).tar.xz "$REMOTE_PATH"/"$REMOTE_DIR"
  sudo rm -f $(ls -t "$REMOTE_PATH"/"$REMOTE_DIR"-backup-* | awk "NR>$BACKUPS_TO_KEEP")
  sudo rm -rf "$REMOTE_PATH"/"$REMOTE_DIR"
  sudo tar xJf "$REMOTE_PATH"/"$DEPLOY_FILE" -C "$REMOTE_PATH"
  sudo mv "$REMOTE_PATH"/dist "$REMOTE_PATH"/"$REMOTE_DIR"
  sudo chown -R $FS_PERMISSIONS "$REMOTE_PATH"/"$REMOTE_DIR"
  sudo rm -f "$REMOTE_PATH"/"$DEPLOY_FILE"
  # sudo nginx -t && sudo nginx -s reload
  sudo docker exec nginx nginx -t && sudo docker exec nginx nginx -s reload
ENDSSH

# open Cloudflare in a browser to purge the CDN cache
xdg-open https://www.cloudflare.com/a/caching/"$CLOUDFLARE_SITE"
echo_info 'NOTE: Please purge your CloudFlare cache.'

echo_info 'Deployment complete!'

# clean up on exit
function finish {
  echo_info "Removing temp dir: ${BUILD_DIR}"
  rm -rf "$BUILD_DIR"
}
trap finish EXIT
