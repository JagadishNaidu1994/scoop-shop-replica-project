import React, { useEffect, useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Monitor, CheckCircle, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavBar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Install NASTEA App</h1>
          <p className="text-muted-foreground text-lg">
            Get the full app experience - faster loading, offline access, and push notifications
          </p>
        </div>

        {isInstalled ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">App Installed!</h2>
              <p className="text-muted-foreground">
                NASTEA is now installed on your device. You can access it from your home screen.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Android / Desktop Install */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {isIOS ? <Smartphone className="h-8 w-8 text-primary" /> : <Monitor className="h-8 w-8 text-primary" />}
                  <div>
                    <CardTitle>Install on {isIOS ? 'iOS' : 'Your Device'}</CardTitle>
                    <CardDescription>
                      {isIOS ? 'Add to your home screen' : 'Quick installation'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isIOS ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">To install on iOS:</p>
                    <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        Tap the <Share className="h-4 w-4 inline" /> Share button in Safari
                      </li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" in the top right corner</li>
                    </ol>
                  </div>
                ) : deferredPrompt ? (
                  <Button onClick={handleInstall} className="w-full" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Install Now
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Installation is available in Chrome, Edge, or Safari browsers. 
                    If you don't see an install option, try refreshing the page.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Install?</CardTitle>
                <CardDescription>Benefits of the NASTEA app</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Faster Experience</p>
                      <p className="text-sm text-muted-foreground">App loads instantly from your device</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Works Offline</p>
                      <p className="text-sm text-muted-foreground">Browse products even without internet</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Easy Access</p>
                      <p className="text-sm text-muted-foreground">Launch from your home screen like a native app</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Get updates on orders and offers</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Install;
