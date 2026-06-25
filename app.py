from flask import Flask, request, send_file
import fitz
import requests
import io
import os

app = Flask(**name**)

@app.route("/")
def home():
return "CBPG Watermark Server Running Successfully"

@app.route("/watermark")
def watermark():

```
pdf_url = request.args.get("url")

if not pdf_url:
    return "PDF URL Missing", 400

try:

    response = requests.get(pdf_url, timeout=30)

    pdf = fitz.open(
        stream=response.content,
        filetype="pdf"
    )

    logo_path = "po.jpg"

    for page in pdf:

        rect = page.rect

        # Footer line
        page.draw_line(
            (40, rect.height - 35),
            (rect.width - 40, rect.height - 35),
            color=(0.15, 0.35, 0.85),
            width=1
        )

        # Logo
        if os.path.exists(logo_path):
            page.insert_image(
                fitz.Rect(
                    45,
                    rect.height - 30,
                    65,
                    rect.height - 10
                ),
                filename=logo_path
            )

        # Verified Text
        page.insert_text(
            (75, rect.height - 18),
            "VERIFIED",
            fontsize=10,
            color=(0.0, 0.6, 0.0)
        )

        # Portal Name
        page.insert_text(
            (145, rect.height - 18),
            "CBPG RESULT PORTAL",
            fontsize=11,
            color=(0.0, 0.0, 0.0)
        )

        # Website
        page.insert_text(
            (320, rect.height - 18),
            "cbpgresult-com.github.io",
            fontsize=9,
            color=(0.45, 0.45, 0.45)
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
    return f"Error: {str(e)}", 500
```

if **name** == "**main**":
app.run(
host="0.0.0.0",
port=5000
)
