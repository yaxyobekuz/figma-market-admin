import { Card } from '../components/ui';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Configure admin panel settings</p>
      </div>

      <Card className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <HiOutlineWrenchScrewdriver className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-gray-400 text-center max-w-md">
          Settings page is under development. Check back later for configuration options.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
