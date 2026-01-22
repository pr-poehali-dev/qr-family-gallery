import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const QR_AUTH_URL = 'https://functions.poehali.dev/39aacb63-4df4-438f-9ee0-13de41ed7e7f';

export default function GenerateQR() {
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [albumUrl, setAlbumUrl] = useState('');

  useEffect(() => {
    setAlbumUrl(window.location.origin);
  }, []);

  const generateQR = async () => {
    setLoading(true);
    try {
      const response = await fetch(QR_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'generate' }),
      });

      const data = await response.json();
      if (data.qr_data) {
        setQrData(data.qr_data);
      }
    } catch (error) {
      console.error('Ошибка генерации QR-кода:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'семейный-альбом-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6 animate-scale-in shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="Key" size={40} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Генерация QR-кода доступа</h1>
          <p className="text-muted-foreground">
            Создайте уникальный QR-код для доступа к семейному альбому
          </p>
        </div>

        <div className="space-y-6">
          {!qrData ? (
            <div className="text-center space-y-4">
              <Button
                onClick={generateQR}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="QrCode" size={20} className="mr-2" />
                    Создать QR-код
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-8 rounded-xl flex justify-center">
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={300}
                  level="H"
                  includeMargin
                />
              </div>

              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  Этот QR-код даёт доступ к вашему семейному альбому. Сохраните его в безопасном месте.
                </p>
              </Card>

              <div className="flex gap-3">
                <Button onClick={downloadQR} className="flex-1" variant="outline">
                  <Icon name="Download" size={20} className="mr-2" />
                  Скачать QR-код
                </Button>
                <Button onClick={generateQR} className="flex-1">
                  <Icon name="RefreshCw" size={20} className="mr-2" />
                  Создать новый
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Как использовать:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Скачайте QR-код и распечатайте его</li>
                  <li>Разместите QR-код в семейном альбоме или рамке</li>
                  <li>Отсканируйте код на странице входа для доступа</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button variant="ghost" onClick={() => window.location.href = '/'} className="w-full">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Вернуться к альбому
          </Button>
        </div>
      </Card>
    </div>
  );
}
