import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
        }
      );
      setIsScanning(true);
    } catch (err) {
      setError('Не удалось запустить камеру. Проверьте разрешения.');
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Отсканируйте QR-код</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {error ? (
          <div className="text-center space-y-4">
            <Icon name="AlertCircle" size={48} className="mx-auto text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
            <p className="text-sm text-muted-foreground text-center">
              Наведите камеру на QR-код для доступа
            </p>
          </>
        )}
      </div>
    </div>
  );
}
