#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
# if you are deploying to a custom domain

echo 'jiayenli.github.io' > CNAM

if [ -z "$GITHUB_TOKEN" ]; then

  msg='deploy'

  githubUrl=git@github.com:jiayenli/Jamie-Weather.git

else

  msg='github action的自動部署'

  githubUrl=https://git:${GITHUB_TOKEN}@github.com/jiayenli/Jamie-Weather.git

  git config --global user.name ${USER_NAME}

  git config --global user.email ${USER_EMAIL}

fi

git init
git branch -m main
git add -A
git commit -m 'deploy'


# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f $githubUrl main:gh-pages


cd -