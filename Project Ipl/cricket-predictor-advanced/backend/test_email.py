# -*- coding: utf-8 -*-
from email_service import send_welcome_email

if __name__ == "__main__":
    # Replace with an email you can check
    recipient = "your_test_recipient@example.com"
    ok = send_welcome_email(recipient, "TestUser", "testuser123")
    print("Sent?", ok)
