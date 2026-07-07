import fitz  # PyMuPDF


def extract_resume_text(pdf_path):
    text = ""

    doc = fitz.open(pdf_path)

    for page in doc:
        text += page.get_text()

    doc.close()

    return text.strip()


if __name__ == "__main__":
    resume = extract_resume_text("uploads/resume.pdf")
    print(resume[:2000])