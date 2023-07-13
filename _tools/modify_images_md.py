import os
import re


def process_md_files(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(".md"):
            file_path = os.path.join(folder_path, filename)
            process_md_file(file_path)


def process_md_file(file_path):
    with open(file_path, "r+") as file:
        content = file.read()
        modified_content = modify_image_syntax(content)
        file.seek(0)
        file.write(modified_content)
        file.truncate()


def modify_image_syntax(content):
    pattern = r"!\[(.*?)\]\((.*?)\)\{: width=(.*?) height=(.*?)\}\n_(.*?)_\n\n"
    modified_content = re.sub(pattern, r'<figure>\n    <img src="\2" alt="\1" width=\3 class="center" />\n  <figcaption class="center">\5</figcaption>\n</figure>\n\n', content, flags=re.DOTALL)
    return modified_content


# Specify the folder path where your Markdown files are located
folder_path = "_posts"

# Process the Markdown files in the folder
process_md_files(folder_path)
