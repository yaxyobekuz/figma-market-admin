import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiKey, HiCheckCircle, HiTrash } from 'react-icons/hi2';
import { Card, Input, Button, Badge } from '../components/ui';
import {
  ACCESS_TOKEN_KEY,
  getStoredAccessToken,
  saveAccessToken,
  clearAccessToken,
} from '../config/auth.config';

const AccessToken = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const stored = getStoredAccessToken();
    if (stored) {
      setTokenInput(stored);
      setHasToken(true);
    }
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    const trimmed = tokenInput.trim();

    if (!trimmed) {
      toast.error('Token kiriting');
      return;
    }

    saveAccessToken(trimmed);
    setHasToken(true);
    toast.success('Access token saqlandi');
  };

  const handleClear = () => {
    clearAccessToken();
    setTokenInput('');
    setHasToken(false);
    toast.success('Access token o`chirildi');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <HiKey className="w-6 h-6 text-violet-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Access Token</h2>
            <p className="text-sm text-gray-400">
              Dizaynlarni yaratish, yangilash yoki o&apos;chirish uchun backendda belgilangan access tokendan foydalaniladi.
              Token brauzerning localStorage&apos;ida saqlanadi va barcha so&apos;rovlarga avtomatik qo&apos;shiladi.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-gray-500">Storage kaliti:</span>
              <code className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-xs">
                {ACCESS_TOKEN_KEY}
              </code>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg" className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant={hasToken ? 'success' : 'secondary'}>
            {hasToken ? 'Token mavjud' : 'Token kiritilmagan'}
          </Badge>
          {hasToken && (
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <HiCheckCircle className="w-4 h-4" />
              <span>So&apos;rovlarga avtomatik qo&apos;shiladi</span>
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSave}>
          <Input
            label="Access token"
            type="password"
            placeholder="Your access token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="primary" icon={HiKey}>
              Tokenni saqlash
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon={HiTrash}
              onClick={handleClear}
              disabled={!hasToken}
            >
              Tokenni o&apos;chirish
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          Eslatma: token brauzer localStorage&apos;ida saqlanadi. Agar token o&apos;zgarsa, yangi qiymatni shu yerga kiriting.
        </p>
      </Card>
    </div>
  );
};

export default AccessToken;