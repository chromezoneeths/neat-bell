#!/bin/bash
# This is a script Willow uses to deploy to her server, but you can modify it for your computer.
rm -rf build || true
npm run build
cd build
sftp root@10.2.0.1 <<EOT
cd /data/bell-www-2
put -r *
quit
EOT
