import os
from pypdf import PdfReader

def extract_pdf_to_txt(pdf_path, txt_path):
    print(f"Extracting {pdf_path} to {txt_path}...")
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"\n--- PAGE {i+1} ---\n" + page_text
        
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Finished. Extracted {len(reader.pages)} pages, total length: {len(text)} chars.")
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")

if __name__ == "__main__":
    # Path relative to project root
    styleguide_dir = "content/styleguide"
    extract_pdf_to_txt(os.path.join(styleguide_dir, "DaoTrading.pdf"), os.path.join(styleguide_dir, "DaoTrading.txt"))
    extract_pdf_to_txt(os.path.join(styleguide_dir, "Perfect+Trading+eBook.pdf"), os.path.join(styleguide_dir, "PerfectTrading.txt"))
