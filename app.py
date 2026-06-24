from flask import Flask, request, send_file
import fitz
import requests
import io

app = Flask(__name__)

@app.route("/watermark")
def watermark():

    pdf_url = request.args.get("url")

    pdf_data = requests.get(pdf_url).content

    pdf = fitz.open(stream=pdf_data, filetype="pdf")

    for page in pdf:
        rect = page.rect

        page.insert_text(
            (80, rect.height/2),
            "DOWNLOADED BY CBPG RESULT PORTAL",
            fontsize=22,
            color=(0.7,0.7,0.7)
        )

    output = io.BytesIO()

    pdf.save(output)
    output.seek(0)

    return send_file(
        output,
        mimetype="application/pdf",
        download_name="CBPG_Result.pdf"
    )
