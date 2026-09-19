#!/bin/sh

emoji="🐹"
branch=$(git symbolic-ref --short HEAD 2>/dev/null) || exit 0
message=$(cat "$1")

if echo "$message" | (! grep -q "^${branch} ${emoji}*") &&\
   echo "$message" | (! grep -q "^Merge branch*") &&\
   echo "$message" | (! grep -q "^Merge remote-tracking branch*");\
then
   echo "$branch $emoji $message" > "$1"
fi
