import sys
from pathlib import Path
from PyPDF2 import PdfReader

def extract(pdf_path, out_path):
    reader = PdfReader(pdf_path)
    texts = []
    for page in reader.pages:
        try:
            texts.append(page.extract_text() or "")
        except Exception as e:
            texts.append(f"[ERROR extracting page: {e}]\n")
    out_path.write_text("\n\n".join(texts), encoding="utf-8")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: extract_pdf.py input.pdf output.txt")
        sys.exit(1)
    pdf = Path(sys.argv[1])
    out = Path(sys.argv[2])
    if not pdf.exists():
        print(f"PDF not found: {pdf}")
        sys.exit(2)
    extract(pdf, out)
    print(f"Extracted to {out}")
