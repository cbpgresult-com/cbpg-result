from flask import Flask, request, send_file
import fitz
import requests
import io
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "CBPG Watermark Server Running Successfully"

@app.route("/watermark")
def watermark():
    pdf_url = request.args.get("url")
    if not pdf_url:
        return "PDF URL Missing", 400

    try:
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()

        pdf = fitz.open(stream=response.content, filetype="pdf")
        logo_path = "po.jpg"

        for page in pdf:
            rect = page.rect
            footer_y = rect.height - 12

            page.draw_line(
                (40, footer_y - 12),
                (rect.width - 40, footer_y - 12),
                color=(0.10, 0.35, 0.95),
                width=1
            )

            if os.path.exists(logo_path):
                page.insert_image(
                    fitz.Rect(45, footer_y - 10, 67, footer_y + 12),
                    filename=logo_path
                )

            badge = fitz.Rect(75, footer_y - 3, 132, footer_y + 11)
            page.draw_rect(
                badge,
                color=(0,0.6,0),
                fill=(0,0.75,0)
            )

            page.insert_text(
                (84, footer_y + 7),
                "VERIFIED",
                fontsize=7,
                color=(1,1,1)
            )

            page.insert_text(
                (145, footer_y + 7),
                "CBPG RESULT PORTAL",
                fontsize=10,
                color=(0,0,0)
            )

            page.insert_text(
                (145, footer_y + 17),
                "cbpgresult-com.github.io",
                fontsize=6,
                color=(0.45,0.45,0.45)
            )

        output = io.BytesIO()
        pdf.save(output)
        output.seek(0)

        return send_file(
            output,
            mimetype="application/pdf",
            download_name="CBPG_Result.pdf"
        )

    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
