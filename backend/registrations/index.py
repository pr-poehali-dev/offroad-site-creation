import json
import os
import psycopg2
from datetime import datetime
from typing import Optional
from email_service import send_registration_notification

def handler(event: dict, context) -> dict:
    """API для работы с заявками на выезды: создание и получение списка"""
    
    method = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Подключение к БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ['MAIN_DB_SCHEMA']
    
    try:
        if method == 'POST':
            # Создание новой заявки
            body = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute(f"""
                    INSERT INTO {schema}.registrations 
                    (event_title, event_date, name, phone, email, vehicle, experience)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, created_at
                """, (
                    body['event_title'],
                    body['event_date'],
                    body['name'],
                    body['phone'],
                    body['email'],
                    body.get('vehicle'),
                    body.get('experience')
                ))
                
                row = cur.fetchone()
                conn.commit()
                
                # Отправляем email-уведомление координатору
                try:
                    send_registration_notification(body)
                except Exception as e:
                    print(f"Ошибка отправки email: {e}")
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'id': row[0],
                        'created_at': row[1].isoformat()
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            # Получение списка заявок
            params = event.get('queryStringParameters') or {}
            status_filter = params.get('status')
            
            with conn.cursor() as cur:
                if status_filter:
                    cur.execute(f"""
                        SELECT id, event_title, event_date, name, phone, email, 
                               vehicle, experience, status, created_at
                        FROM {schema}.registrations
                        WHERE status = %s
                        ORDER BY created_at DESC
                    """, (status_filter,))
                else:
                    cur.execute(f"""
                        SELECT id, event_title, event_date, name, phone, email, 
                               vehicle, experience, status, created_at
                        FROM {schema}.registrations
                        ORDER BY created_at DESC
                    """)
                
                rows = cur.fetchall()
                registrations = []
                
                for row in rows:
                    registrations.append({
                        'id': row[0],
                        'event_title': row[1],
                        'event_date': row[2].isoformat() if row[2] else None,
                        'name': row[3],
                        'phone': row[4],
                        'email': row[5],
                        'vehicle': row[6],
                        'experience': row[7],
                        'status': row[8],
                        'created_at': row[9].isoformat() if row[9] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'registrations': registrations}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()