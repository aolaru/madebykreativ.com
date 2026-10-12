"""Import verified release metadata and public previews, never paid delivery files."""
import argparse
import hashlib
import json
import shutil
import subprocess
import zipfile
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = {
    "idea-library": ("00 Idea Library", "KREATIV_Idea_Library_v1.5.zip", "v1.5", "v1.5"),
    "product-idea-scorecard": ("01 Product Idea Scorecard", "KREATIV_Product_Idea_Scorecard_v1.5.zip", "v1.5", "v1.3"),
    "workflow-product-builder": ("02 Workflow Product Builder", "KREATIV_Workflow_Product_Builder_v1.5.zip", "v1.5", "v1.3"),
    "digital-product-launch-engine": ("03 Digital Product Launch Engine", "KREATIV_Digital_Product_Launch_Engine_v1.5.zip", "v1.5", "v1.2"),
    "ai-business-pathways": ("05 AI Business Pathways", "KREATIV_AI_Business_Pathways_v1.2.zip", "v1.2", "v1.2"),
    "system": ("04 Bundle", "KREATIV_Product-to-Profit_System_v2.4.zip", "v2.4", "v2.4"),
}
PREVIEWS = {
    "idea-library": [("idea-library/idea-handoff", 33)],
    "product-idea-scorecard": [("scorecard/buyer-situation", 10), ("scorecard/idea-scorecard", 24), ("scorecard/product-brief", 31), ("scorecard/completed-brief", 20)],
    "workflow-product-builder": [("builder/format-matrix", 10), ("builder/signal-test-log", 16), ("builder/product-specification", 46)],
    "digital-product-launch-engine": [("launch-engine/builder-handoff", 4), ("launch-engine/proof-trust", 11), ("launch-engine/campaign-calendar", 36), ("launch-engine/sell-ready-completion", 43)],
    "ai-business-pathways": [("pathways/decision-matrix", 21), ("pathways/experiment", 5)],
    "system": [("system/handoff-map", 11), ("system/first-action", 14)],
}


def render_preview(pdf, page_number, target):
    document = PdfReader(pdf)
    if not 1 <= page_number <= len(document.pages):
        raise ValueError(f"Invalid preview page {page_number} in {pdf.name}")
    index = page_number - 1
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["pdftoppm", "-f", str(index + 1), "-l", str(index + 1), "-singlefile", "-scale-to-x", "1200", "-scale-to-y", "-1", "-png", str(pdf), str(target.with_suffix(""))], check=True, capture_output=True)
    image = Image.open(target).convert("RGB")
    image.save(target, optimize=True)
    image.save(target.with_suffix(".webp"), quality=84)
    return {"page": index + 1, "width": image.width, "height": image.height}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Root of the approved Product-to-Profit releases")
    args = parser.parse_args()
    releases = {}
    for slug, (folder, archive_name, version, pdf_version) in PRODUCTS.items():
        product_root = args.source / folder
        archive = product_root / "output/package" / archive_name
        pdfs = list((product_root / "output/pdf").glob(f"*{pdf_version}.pdf"))
        if slug == "system":
            pdfs = [pdf for pdf in pdfs if "Start_Here" in pdf.name]
        elif slug == "ai-business-pathways":
            pdfs = [pdf for pdf in pdfs if "AI_Business_Pathways" in pdf.name]
        if len(pdfs) != 1:
            raise ValueError(f"Expected one primary PDF for {slug}, found {pdfs}")
        pdf = pdfs[0]
        reader = PdfReader(pdf)
        with zipfile.ZipFile(archive) as contents:
            names = [name for name in contents.namelist() if not name.endswith("/")]
            if contents.testzip() is not None:
                raise ValueError(f"Invalid archive: {archive}")
            pdf_members = [name for name in names if name.endswith(".pdf")]
            formats = [label for extension, label in [("pdf", "PDF"), ("html", "HTML reading edition"), ("xlsx", "Excel XLSX"), ("docx", "Word DOCX"), ("md", "Markdown"), ("csv", "CSV")] if any(name.endswith(f".{extension}") for name in names)]
        preview_data = {}
        for preview_name, heading in PREVIEWS[slug]:
            preview_data[preview_name] = render_preview(pdf, heading, ROOT / "public/product-to-profit/previews" / f"{preview_name}.png")
        releases[slug] = {
            "released": "2026-10-04", "version": version, "pdfVersion": pdf_version,
            "packageName": archive.name, "packageBytes": archive.stat().st_size,
            "packageSize": f"{archive.stat().st_size / 1024:.0f} KB" if archive.stat().st_size < 1048576 else f"{archive.stat().st_size / 1048576:.2f} MB",
            "fileCount": len(names), "pages": len(reader.pages), "fields": len(reader.get_fields() or {}),
            "pdfCount": len(pdf_members), "formats": formats,
            "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "previews": preview_data,
        }
        if slug in {"idea-library", "product-idea-scorecard"}:
            delivery = ROOT / "public/downloads/product-to-profit"
            delivery.mkdir(parents=True, exist_ok=True)
            shutil.copy2(archive, delivery / archive.name)
            # Existing bookmarked URLs receive the current free package as well.
            old_name = "KREATIV_Idea_Library_v2_Upgrade.zip" if slug == "idea-library" else "KREATIV_Product_Idea_Scorecard_v1.1.zip"
            shutil.copy2(archive, delivery / old_name)
    (ROOT / "src/data/productReleases.json").write_text(json.dumps(releases, indent=2) + "\n")
    print(f"Imported {len(releases)} releases and public worksheet previews.")


if __name__ == "__main__":
    main()
