import os
import re
import json

backend_dir = "/Users/foysal/Documents/FOYSAL/Projects/richardhan-server/src"
endpoints = []

# Regex patterns
controller_pattern = re.compile(r'@Controller\([\'"]([^\'"]*)[\'"]\)')
method_pattern = re.compile(r'@(Get|Post|Put|Patch|Delete)\([\'"]?([^\'"]*)[\'"]?\)')

for root, dirs, files in os.walk(backend_dir):
    for file in files:
        if file.endswith('.controller.ts'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find controller base route
            controller_match = controller_pattern.search(content)
            base_route = controller_match.group(1) if controller_match else ""
            if not base_route.startswith('/'):
               base_route = '/' + base_route

            # Normalize base route
            if base_route == '/':
                base_route = ''

            # Find all methods
            # We iterate through the file line by line to keep things contextual if needed, 
            # or just use findall
            matches = method_pattern.finditer(content)
            for match in matches:
                http_method = match.group(1).upper()
                sub_route = match.group(2)
                
                if sub_route and not sub_route.startswith('/'):
                    sub_route = '/' + sub_route
                
                full_path = f"{base_route}{sub_route}"
                
                # Normalizing trailing slashes etc
                full_path = re.sub(r'/+', '/', full_path)
                
                endpoints.append({
                    "method": http_method,
                    "path": full_path,
                    "file": file
                })

# Sort by path
endpoints.sort(key=lambda x: x['path'])

with open('backend_endpoints.json', 'w') as f:
    json.dump(endpoints, f, indent=2)

print(f"Extracted {len(endpoints)} endpoints.")
