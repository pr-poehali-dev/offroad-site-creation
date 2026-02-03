import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def send_registration_notification(registration_data: dict) -> bool:
    """Отправка email-уведомления координатору о новой заявке"""
    
    # Проверяем наличие всех необходимых переменных окружения
    required_vars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'ADMIN_EMAIL']
    if not all(os.environ.get(var) for var in required_vars):
        print("Не все SMTP переменные настроены, email не отправлен")
        return False
    
    try:
        # Формируем письмо
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Новая заявка на выезд: {registration_data['event_title']}"
        msg['From'] = os.environ['SMTP_USER']
        msg['To'] = os.environ['ADMIN_EMAIL']
        
        # HTML версия письма
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .info-row {{ margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }}
                .label {{ font-weight: bold; color: #667eea; }}
                .value {{ margin-top: 5px; }}
                .footer {{ text-align: center; margin-top: 30px; color: #999; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚗 НОВАЯ ЗАЯВКА НА ВЫЕЗД</h1>
                </div>
                <div class="content">
                    <div class="info-row">
                        <div class="label">Маршрут:</div>
                        <div class="value">{registration_data['event_title']}</div>
                    </div>
                    <div class="info-row">
                        <div class="label">Дата выезда:</div>
                        <div class="value">{datetime.fromisoformat(registration_data['event_date']).strftime('%d.%m.%Y')}</div>
                    </div>
                    <div class="info-row">
                        <div class="label">Участник:</div>
                        <div class="value">{registration_data['name']}</div>
                    </div>
                    <div class="info-row">
                        <div class="label">Телефон:</div>
                        <div class="value"><a href="tel:{registration_data['phone']}">{registration_data['phone']}</a></div>
                    </div>
                    <div class="info-row">
                        <div class="label">Email:</div>
                        <div class="value"><a href="mailto:{registration_data['email']}">{registration_data['email']}</a></div>
                    </div>
        """
        
        if registration_data.get('vehicle'):
            html += f"""
                    <div class="info-row">
                        <div class="label">Автомобиль:</div>
                        <div class="value">{registration_data['vehicle']}</div>
                    </div>
            """
        
        if registration_data.get('experience'):
            html += f"""
                    <div class="info-row">
                        <div class="label">Опыт оффроуда:</div>
                        <div class="value">{registration_data['experience']}</div>
                    </div>
            """
        
        html += """
                    <div class="footer">
                        <p>Это автоматическое уведомление от системы регистрации OFFROAD CLUB</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Текстовая версия (fallback)
        text = f"""
        НОВАЯ ЗАЯВКА НА ВЫЕЗД
        
        Маршрут: {registration_data['event_title']}
        Дата: {datetime.fromisoformat(registration_data['event_date']).strftime('%d.%m.%Y')}
        
        Участник: {registration_data['name']}
        Телефон: {registration_data['phone']}
        Email: {registration_data['email']}
        """
        
        if registration_data.get('vehicle'):
            text += f"\nАвтомобиль: {registration_data['vehicle']}"
        if registration_data.get('experience'):
            text += f"\nОпыт: {registration_data['experience']}"
        
        # Прикрепляем обе версии
        part1 = MIMEText(text, 'plain', 'utf-8')
        part2 = MIMEText(html, 'html', 'utf-8')
        msg.attach(part1)
        msg.attach(part2)
        
        # Отправляем
        with smtplib.SMTP(os.environ['SMTP_HOST'], int(os.environ['SMTP_PORT'])) as server:
            server.starttls()
            server.login(os.environ['SMTP_USER'], os.environ['SMTP_PASSWORD'])
            server.send_message(msg)
        
        print(f"Email отправлен на {os.environ['ADMIN_EMAIL']}")
        return True
        
    except Exception as e:
        print(f"Ошибка отправки email: {e}")
        return False
