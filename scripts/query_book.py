import os
import sys
import re

def highlight_keyword(text, kw):
    # Replace newlines with spaces for single-line display in snippets
    clean_text = text.replace('\n', ' ')
    # Highlight matching keyword with ANSI yellow color
    return re.sub(f"({re.escape(kw)})", r"\033[1;33m\1\033[0m", clean_text, flags=re.IGNORECASE)

def query_text_content(content, kw, file_label, max_results=3, context_before=150, context_after=250):
    matches = [m.start() for m in re.finditer(re.escape(kw), content, re.IGNORECASE)]
    if not matches:
        return 0
        
    printed_count = min(len(matches), max_results)
    print(f"\n📁 File: {file_label}")
    print(f"   Found {len(matches)} matches, showing first {printed_count}:")
    print("-" * 50)
    
    for i, idx in enumerate(matches[:max_results]):
        start = max(0, idx - context_before)
        end = min(len(content), idx + len(kw) + context_after)
        snippet = content[start:end]
        highlighted = highlight_keyword(snippet, kw)
        
        print(f"   [Match {i+1}]: ... {highlighted.strip()} ...")
        print("   " + "-" * 40)
    return len(matches)

def get_all_md_files(start_dir="."):
    md_files = []
    # Skip directories we don't want to search
    skip_dirs = {".git", ".cache", "node_modules", "public", ".gemini"}
    
    for root, dirs, files in os.walk(start_dir):
        # Modify dirs in-place to skip unwanted directories
        dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith(".")]
        
        for file in files:
            if file.endswith(".md"):
                md_files.append(os.path.join(root, file))
    return md_files

def query_md_files(keywords, max_results=3):
    md_files = get_all_md_files()
    print(f"Searching across {len(md_files)} Markdown (.md) files in the repo...")
    
    for kw in keywords:
        print("\n" + "="*70)
        print(f"🔍 SEARCHING KEYWORD IN MARKDOWN: '{kw}'")
        print("="*70)
        
        total_matches = 0
        files_with_matches = 0
        
        for md_file in md_files:
            try:
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Relativize path for nicer print labels
                rel_path = os.path.relpath(md_file)
                matches_in_file = query_text_content(content, kw, rel_path, max_results)
                if matches_in_file > 0:
                    total_matches += matches_in_file
                    files_with_matches += 1
            except Exception as e:
                print(f"Error reading {md_file}: {e}")
                
        print(f"\nSummary for '{kw}': Found {total_matches} total matches across {files_with_matches} files.")

def query_book_keywords(book_path, keywords, max_results=5):
    if not os.path.exists(book_path):
        print(f"Error: Book file not found at {book_path}")
        return

    print(f"Reading default book from {book_path}...")
    try:
        with open(book_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading book: {e}")
        return

    for kw in keywords:
        print("\n" + "="*70)
        print(f"📖 SEARCHING KEYWORD IN BOOK: '{kw}'")
        print("="*70)
        
        query_text_content(content, kw, os.path.basename(book_path), max_results)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  1. Search the book:      python scripts/query_book.py <keyword1> <keyword2> ...")
        print("  2. Search all md files:  python scripts/query_book.py --md <keyword1> <keyword2> ...")
        print("\nExample: python scripts/query_book.py --md 'Cloudflare' 'tánh biết'")
        sys.exit(1)
        
    args = sys.argv[1:]
    
    if args[0] == "--md":
        keywords = args[1:]
        if not keywords:
            print("Error: Please provide at least one keyword after --md.")
            sys.exit(1)
        query_md_files(keywords)
    else:
        book_file = "content/styleguide/DaoTrading.txt"
        query_book_keywords(book_file, args)
