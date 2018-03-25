#!/bin/bash
set -E

# options (these should be set externally as they're private)
BUILD_DIR=${BUILD_DIR:-"$(mktemp -d -t build.XXXXXXXXXX)"}
DEPLOY_FILE=${DEPLOY_FILE:-"deploy.tgz"}
REMOTE_SSH="${REMOTE_SSH:?Need to set REMOTE_SSH non-empty}"
REMOTE_DIR="${REMOTE_DIR:?Need to set REMOTE_DIR non-empty}"
FS_PERMISSIONS="${FS_PERMISSIONS:?Need to set FS_PERMISSIONS non-empty}"
BACKUPS_TO_KEEP=5
CLOUDFLARE_SITE="minimalcoins.com"

# feedback utilities
echo_err() { echo -e "\n\033[1;31mError:\033[0m $1" 1>&2; echo -en "\a\n"; }
echo_info() { echo -e "\n$1\n" >&1; }

# run build
yarn run build

# bundle deployable package
echo_info "Creating deployable file..."
tar -cJf "$BUILD_DIR/$DEPLOY_FILE" ./dist && echo_info "Done; $(wc -c "$BUILD_DIR/$DEPLOY_FILE")"

# upload deploy file to the production server
echo_info "Uploading package to $REMOTE_SSH server...\n"
upload() {
  rsync --partial --progress --rsh=ssh "$BUILD_DIR/$DEPLOY_FILE" "$REMOTE_SSH":~/
}
# try uploading up to 3 times in case of errors
upload || upload || upload || exit 2

# execute commands on the remote server
echo_info "Executing commands on $REMOTE_SSH server...\n"
ssh "$REMOTE_SSH" DEPLOY_FILE="$DEPLOY_FILE" REMOTE_DIR="$REMOTE_DIR" BACKUPS_TO_KEEP="$BACKUPS_TO_KEEP" FS_PERMISSIONS="$FS_PERMISSIONS" '/bin/sh -sx' <<'ENDSSH'
  sudo mv ~/$DEPLOY_FILE $REMOTE_DIR
  sudo tar -cJf $REMOTE_DIR/html-backup-$(date --iso-8601=minutes).tar.xz $REMOTE_DIR/html
  sudo rm -f $(ls -t $REMOTE_DIR/html-backup-* | awk "NR>$BACKUPS_TO_KEEP")
  sudo rm -rf $REMOTE_DIR/html
  sudo tar xJf $REMOTE_DIR/$DEPLOY_FILE -C $REMOTE_DIR
  sudo mv $REMOTE_DIR/dist $REMOTE_DIR/html
  sudo chown -R $FS_PERMISSIONS $REMOTE_DIR/html
  sudo rm -f $REMOTE_DIR/$DEPLOY_FILE
  sudo nginx -t && sudo nginx -s reload
ENDSSH

echo_info "Deployment complete!"

# clean up on exit
function finish {
  echo_info "Removing temp dir: $BUILD_DIR"
  rm -rf "$BUILD_DIR"
}
trap finish EXIT
