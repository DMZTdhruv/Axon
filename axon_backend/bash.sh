#!/bin/bash

folders=("auth" "blog" "workspace")
ports=("3003" "3008" "3002")

for i in "${!folders[@]}"; do
    folder="${folders[$i]}"
    port="${ports[$i]}"
    if [ -d "$folder" ]; then
        cat <<EOL > "$folder/.dockerignore"
node_modules
npm-debug.log
dist
.env
.git
.gitignore
EOL

        # Display Dockerfile content and confirmation message
        cat "$folder/Dockerfile"
        echo "Dockerfile content overwritten in $folder/Dockerfile"
    else 
        echo "Folder named $folder doesn't exist"
    fi
done
