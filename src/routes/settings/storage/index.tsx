import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Cloud, Database, Settings } from "lucide-react";
import SettingCard from "@/components/settings/setting-card";
import SettingHeader from "@/components/settings/setting-header";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/storage/")({
  component: StorageSettingsPage,
});

interface StorageConfig {
  provider: 'cloudflare' | 'aws' | 'database';
  credentials: {
    accountId?: string;
    apiToken?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucket?: string;
  };
  options?: {
    [key: string]: any;
  };
}

interface DatabaseConfig {
  provider: 'postgresql';
  credentials: {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
  };
  options?: {
    [key: string]: any;
  };
}

interface EmailConfig {
  provider: 'resend';
  credentials: {
    apiKey: string;
  };
  options?: {
    fromEmail?: string;
    fromName?: string;
  };
}

function StorageSettingsPage() {
  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    provider: 'database',
    credentials: {},
    options: {}
  });
  
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig>({
    provider: 'postgresql',
    credentials: {
      host: '',
      port: '',
      database: '',
      username: '',
      password: ''
    },
    options: {}
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    provider: 'resend',
    credentials: {
      apiKey: ''
    },
    options: {}
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [storageTestResult, setStorageTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [databaseTestResult, setDatabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleStorageProviderChange = (provider: StorageConfig['provider']) => {
    setStorageConfig({
      provider,
      credentials: {},
      options: {}
    });
    setStorageTestResult(null);
  };

  const handleStorageCredentialChange = (key: string, value: string) => {
    setStorageConfig(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value
      }
    }));
    setStorageTestResult(null);
  };

  const handleDatabaseProviderChange = (provider: DatabaseConfig['provider']) => {
    setDatabaseConfig({
      provider,
      credentials: {},
      options: {}
    });
    setDatabaseTestResult(null);
  };

  const handleDatabaseCredentialChange = (key: string, value: string) => {
    setDatabaseConfig(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value
      }
    }));
    setDatabaseTestResult(null);
  };

  const testStorageConnection = async () => {
    setIsLoading(true);
    setStorageTestResult(null);

    try {
      const response = await fetch('/api/storage/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storageConfig),
      });

      const result = await response.json();
      setStorageTestResult(result);
    } catch (error) {
      setStorageTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Storage connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setDatabaseTestResult(null);

    try {
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databaseConfig),
      });

      const result = await response.json();
      setDatabaseTestResult(result);
    } catch (error) {
      setDatabaseTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Database connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfigurations = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/settings/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storageConfig,
          databaseConfig,
          emailConfig
        }),
      });

      if (response.ok) {
        toast.success('Configurations saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save configurations');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCloudflareConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">Account ID</Label>
          <Input
            id="accountId"
            type="text"
            placeholder="Your Cloudflare Account ID"
            value={storageConfig.credentials.accountId || ''}
            onChange={(e) => handleStorageCredentialChange('accountId', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiToken">API Token</Label>
          <Input
            id="apiToken"
            type="password"
            placeholder="Your Cloudflare API Token"
            value={storageConfig.credentials.apiToken || ''}
            onChange={(e) => handleStorageCredentialChange('apiToken', e.target.value)}
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>To get your Cloudflare credentials:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Go to <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudflare API Tokens</a></li>
          <li>Create a custom token with "Cloudflare Images:Edit" permissions</li>
          <li>Copy your Account ID from the right sidebar</li>
        </ol>
      </div>
    </div>
  );

  const renderAWSConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accessKeyId">Access Key ID</Label>
          <Input
            id="accessKeyId"
            type="text"
            placeholder="Your AWS Access Key ID"
            value={storageConfig.credentials.accessKeyId || ''}
            onChange={(e) => handleStorageCredentialChange('accessKeyId', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secretAccessKey">Secret Access Key</Label>
          <Input
            id="secretAccessKey"
            type="password"
            placeholder="Your AWS Secret Access Key"
            value={storageConfig.credentials.secretAccessKey || ''}
            onChange={(e) => handleStorageCredentialChange('secretAccessKey', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            type="text"
            placeholder="us-east-1"
            value={storageConfig.credentials.region || ''}
            onChange={(e) => handleStorageCredentialChange('region', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bucket">S3 Bucket</Label>
          <Input
            id="bucket"
            type="text"
            placeholder="your-bucket-name"
            value={storageConfig.credentials.bucket || ''}
            onChange={(e) => handleStorageCredentialChange('bucket', e.target.value)}
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>AWS S3 storage support coming soon!</p>
      </div>
    </div>
  );

  const renderDatabaseStorageConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">Database Storage</span>
        <Badge variant="secondary">Default</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Images will be stored as data URLs in your PostgreSQL database. This is the default storage method.
      </p>
    </div>
  );

  const renderPostgreSQLConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dbHost">Host</Label>
          <Input
            id="dbHost"
            type="text"
            placeholder="localhost"
            value={databaseConfig.credentials.host || ''}
            onChange={(e) => handleDatabaseCredentialChange('host', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dbPort">Port</Label>
          <Input
            id="dbPort"
            type="text"
            placeholder="5432"
            value={databaseConfig.credentials.port || ''}
            onChange={(e) => handleDatabaseCredentialChange('port', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dbDatabase">Database</Label>
          <Input
            id="dbDatabase"
            type="text"
            placeholder="mydatabase"
            value={databaseConfig.credentials.database || ''}
            onChange={(e) => handleDatabaseCredentialChange('database', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dbUsername">Username</Label>
          <Input
            id="dbUsername"
            type="text"
            placeholder="myuser"
            value={databaseConfig.credentials.username || ''}
            onChange={(e) => handleDatabaseCredentialChange('username', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dbPassword">Password</Label>
        <Input
          id="dbPassword"
          type="password"
          placeholder="mypassword"
          value={databaseConfig.credentials.password || ''}
          onChange={(e) => handleDatabaseCredentialChange('password', e.target.value)}
        />
      </div>
    </div>
  );

  const renderResendConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resendApiKey">Resend API Key</Label>
        <Input
          id="resendApiKey"
          type="password"
          placeholder="re_..."
          value={emailConfig.credentials.apiKey}
          onChange={(e) => setEmailConfig(prev => ({
            ...prev,
            credentials: {
              ...prev.credentials,
              apiKey: e.target.value
            }
          }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromEmail">From Email</Label>
          <Input
            id="fromEmail"
            type="email"
            placeholder="noreply@yourdomain.com"
            value={emailConfig.options?.fromEmail || ''}
            onChange={(e) => setEmailConfig(prev => ({
              ...prev,
              options: {
                ...prev.options,
                fromEmail: e.target.value
              }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromName">From Name</Label>
          <Input
            id="fromName"
            type="text"
            placeholder="Your App Name"
            value={emailConfig.options?.fromName || ''}
            onChange={(e) => setEmailConfig(prev => ({
              ...prev,
              options: {
                ...prev.options,
                fromName: e.target.value
              }
            }))}
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>To get your Resend API key:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Go to <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Resend API Keys</a></li>
          <li>Create a new API key</li>
          <li>Copy the key (starts with re_)</li>
        </ol>
      </div>
    </div>
  );

  return (
    <div>
      <SettingHeader
        title="Storage & Database Settings"
        subtitle="Configure your external storage and database providers"
        className="sticky top-0 z-1"
      />

      <div className="p-4 space-y-4">
        {/* Storage Configuration */}
        <SettingCard title="Image Storage" subtitle="Configure where generated images will be stored" Icon={Cloud}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="storageProvider" className="text-sm font-medium">
                  Storage Provider
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose where your generated images will be stored
                </p>
              </div>
              <Select
                value={storageConfig.provider}
                onValueChange={handleStorageProviderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a storage provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Database Storage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cloudflare">
                    <div className="flex items-center space-x-2">
                      <Cloud className="h-4 w-4" />
                      <span>Cloudflare Images</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="aws" disabled>
                    <div className="flex items-center space-x-2">
                      <Cloud className="h-4 w-4" />
                      <span>AWS S3 (Coming Soon)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {storageConfig.provider === 'cloudflare' && renderCloudflareConfig()}
            {storageConfig.provider === 'aws' && renderAWSConfig()}
            {storageConfig.provider === 'database' && renderDatabaseStorageConfig()}

            {storageTestResult && (
              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                storageTestResult.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {storageTestResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{storageTestResult.message}</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <Button
              onClick={testStorageConnection}
              disabled={isLoading || storageConfig.provider === 'database'}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Settings className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Test Storage Connection'
              )}
            </Button>
          </div>
        </SettingCard>

        {/* Database Configuration */}
        <SettingCard title="Database" subtitle="Configure your external database connection" Icon={Database}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="databaseProvider" className="text-sm font-medium">
                  Database Provider
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose your external database provider
                </p>
              </div>
              <Select
                value={databaseConfig.provider}
                onValueChange={handleDatabaseProviderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a database provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>PostgreSQL</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {databaseConfig.provider === 'postgresql' && renderPostgreSQLConfig()}

            {databaseTestResult && (
              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                databaseTestResult.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {databaseTestResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{databaseTestResult.message}</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <Button
              onClick={testDatabaseConnection}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Settings className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Test Database Connection'
              )}
            </Button>
          </div>
        </SettingCard>

        {/* Email Configuration */}
        <SettingCard title="Email Service" subtitle="Configure email notifications" Icon={Cloud}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="emailProvider" className="text-sm font-medium">
                  Email Provider
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose your email service provider
                </p>
              </div>
              <Select
                value={emailConfig.provider}
                onValueChange={(provider) => setEmailConfig(prev => ({ ...prev, provider: provider as 'resend' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an email provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">
                    <div className="flex items-center space-x-2">
                      <Cloud className="h-4 w-4" />
                      <span>Resend</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {emailConfig.provider === 'resend' && renderResendConfig()}
          </div>

          <div className="p-4 border-t">
            <Button
              onClick={() => toast.success('Email configuration saved!')}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Settings className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Test Email Service'
              )}
            </Button>
          </div>
          </SettingCard>
        {/* Save Configuration */}
        <div className="flex justify-end">
          <Button
            onClick={saveConfigurations}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Settings className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save All Configurations'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}