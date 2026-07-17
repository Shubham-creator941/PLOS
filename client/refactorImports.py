import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Consolidate multiline primitives imports if possible?
    # Better: just replace the path
    # Replace anything ending in /primitives/XXX with @/primitives
    # But wait, if multiple primitives are imported from different lines, they will just become:
    # import { Card } from '@/primitives'
    # import { Button } from '@/primitives'
    # This is valid ES syntax.
    
    # regex for matching primitive imports:
    # import { X, Y } from '../../primitives/Z'
    # we just want to replace the path string
    content = re.sub(r'from\s+[\'"](\.\./)+primitives(/[\w]+)?[\'"]', "from '@/primitives'", content)
    content = re.sub(r'from\s+[\'"](\.\./)+widgets(/[\w]+)?[\'"]', "from '@/widgets'", content)
    content = re.sub(r'from\s+[\'"](\.\./)+providers(/[\w]+)?[\'"]', "from '@/providers'", content)

    # Some might be single quote, some double quote. The regex handles both but replaces with single quote.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def walk_dir(d):
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    walk_dir('./src')
