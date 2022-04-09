#!/bin/bash

libs=( $( cat ./afp_libs.json ) )

PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo $PACKAGE_VERSION
ROOT_DIR=$PWD
for i in "${libs[@]}"
do
	echo $i change version to $PACKAGE_VERSION
# 's:[0-9]\+.[0-9]\+.[0-9]+:123:'
	# sed  -i '' '/version/s:[0-9]\+.[0-9]\+.[0-9]+:123:' $i/package.json
	sed -i '/version/s/[0-9]\+.[0-9]\+.[0-9]\+/'"76.0\"/" $i/package.json
  # sed -i '' '/version/s/[^.]*$/'"${PACKAGE_VERSION}\"/" $i/package.json
  # sed -i '' '/version/s/(.)(.)(.*)/'"${PACKAGE_VERSION}\"/" $i/package.json
done
