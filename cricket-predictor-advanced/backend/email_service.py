import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_SENDER = os.getenv("EMAIL_SENDER", "noreply.wicketly@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
NOREPLY_EMAIL = os.getenv("NOREPLY_EMAIL", "noreply.wicketly@gmail.com")
EMAIL_LOGIN_USERNAME = os.getenv("EMAIL_LOGIN_USERNAME", "")

def send_welcome_email(recipient_email: str, user_name: str, username: str):
    """
    Send welcome email to new user with services information.
    Uses noreply email address so users cannot reply.
    """
    if not EMAIL_PASSWORD:
        print("⚠️  Email not configured. Skipping email send.")
        return False
    
    try:
        subject = "Welcome to Wicketly.AI! 🏏"
        
        html_content = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px; }}
                    .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }}
                    .content {{ background: white; padding: 20px; margin-top: 20px; border-radius: 5px; }}
                    .services {{ margin: 20px 0; }}
                    .service-item {{ background: #f0f0f0; padding: 12px; margin: 10px 0; border-left: 4px solid #dc2626; border-radius: 3px; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
                    .noreply-notice {{ background: #ffe6e6; padding: 12px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #dc2626; font-size: 12px; }}
                    .button {{ background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Wicketly.AI! 🏏</h1>
                    </div>
                    
                    <div class="content">
                        <div class="noreply-notice">
                            <strong>⚠️ This is an automated noreply email</strong><br>
                            Please do not reply to this email. Visit our website for support.
                        </div>
                        
                        <p>Hi <strong>{user_name}</strong>,</p>
                        
                        <p>Thank you for signing up with us! We're excited to have you as part of the Wicketly.AI community.</p>
                        
                        <p><strong>Your Account Details:</strong></p>
                        <ul>
                            <li>Display Name: {user_name}</li>
                            <li>Username: {username}</li>
                            <li>Email: {recipient_email}</li>
                        </ul>
                        
                        <p><strong>🎯 Features You Now Have Access To:</strong></p>
                        <div class="services">
                            <div class="service-item">
                                📊 <strong>Live IPL Match Statistics</strong> - Real-time match updates and performance metrics
                            </div>
                            <div class="service-item">
                                🤖 <strong>AI-Powered Match Predictions</strong> - Advanced ML models predicting match outcomes
                            </div>
                            <div class="service-item">
                                📈 <strong>Player Performance Analytics</strong> - Detailed player stats and trend analysis
                            </div>
                            <div class="service-item">
                                ⚔️ <strong>Head-to-Head Team Analysis</strong> - Team matchup statistics and historical data
                            </div>
                            <div class="service-item">
                                🎯 <strong>Fantasy Cricket Recommendations</strong> - Smart player suggestions for fantasy teams
                            </div>
                            <div class="service-item">
                                📚 <strong>Historical IPL Data & Records</strong> - Complete IPL database and records
                            </div>
                            <div class="service-item">
                                ⚡ <strong>Real-time Match Updates</strong> - Instant notifications during live matches
                            </div>
                        </div>
                        
                        <p><strong>Next Steps:</strong></p>
                        <ol>
                            <li>Log in to your account</li>
                            <li>Explore IPL predictions and analytics</li>
                            <li>Start building your fantasy cricket teams</li>
                        </ol>
                        
                        <p>For any questions or support, please visit our website contact page or email us directly.</p>
                        
                        <p><strong>Happy Predictions!</strong></p>
                        <p>— The Wicketly.AI Team 🏏</p>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 Wicketly.AI. All rights reserved.</p>
                        <p><strong>This is an automated noreply email - Please do not reply</strong></p>
                        <p>If you need to contact us, visit: www.wicketly-ai.com/contact</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = NOREPLY_EMAIL
        message["To"] = recipient_email
        message["Reply-To"] = f"support@wicketly.com"  # Direct replies to support if user tries
        
        # Attach HTML content
        message.attach(MIMEText(html_content, "html"))
        
        # Send email using noreply account
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            # Allow providers where login username is different (e.g. SendGrid uses 'apikey')
            login_user = EMAIL_LOGIN_USERNAME if EMAIL_LOGIN_USERNAME else EMAIL_SENDER
            server.login(login_user, EMAIL_PASSWORD)
            server.sendmail(NOREPLY_EMAIL, recipient_email, message.as_string())
        
        print(f"✅ Welcome email sent to {recipient_email} from {NOREPLY_EMAIL}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        return False
