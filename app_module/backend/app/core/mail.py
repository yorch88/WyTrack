import smtplib
from email.message import EmailMessage

from app.core.config import settings


async def send_email(to_email: str, link: str):

    msg = EmailMessage()

    msg["Subject"] = "Set your WyTrack password"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    msg.set_content(f"""
Welcome to WyTrack.

Create your password here:

{link}
""")

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)