import json
import hashlib
import secrets
import os
from datetime import datetime, timedelta

SECRET_KEY = os.environ.get('QR_SECRET_KEY', 'default-secret-key')

def handler(event: dict, context) -> dict:
    '''API для генерации и проверки QR-кодов для авторизации в семейном альбоме'''
    
    method = event.get('httpMethod', 'GET')
    
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
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'generate':
                token = secrets.token_urlsafe(32)
                signature = hashlib.sha256(f"{token}{SECRET_KEY}".encode()).hexdigest()
                qr_data = f"{token}:{signature}"
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'qr_data': qr_data,
                        'token': token
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'verify':
                qr_data = body.get('qr_data', '')
                
                if ':' not in qr_data:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'valid': False, 'error': 'Invalid QR code format'}),
                        'isBase64Encoded': False
                    }
                
                token, signature = qr_data.split(':', 1)
                expected_signature = hashlib.sha256(f"{token}{SECRET_KEY}".encode()).hexdigest()
                
                is_valid = signature == expected_signature
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'valid': is_valid,
                        'token': token if is_valid else None
                    }),
                    'isBase64Encoded': False
                }
        
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
