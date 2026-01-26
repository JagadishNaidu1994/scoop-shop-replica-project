import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  gradient?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'slate';
  headerAction?: React.ReactNode;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  gradient = 'slate',
  headerAction
}) => {
  const gradientClasses = {
    blue: 'from-blue-50 to-blue-100',
    purple: 'from-purple-50 to-purple-100',
    green: 'from-green-50 to-emerald-100',
    red: 'from-red-50 to-rose-100',
    yellow: 'from-yellow-50 to-amber-100',
    slate: 'from-slate-50 to-slate-100'
  };

  return (
    <Card className={`border-none shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden ${className}`}>
      {(title || Icon) && (
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClasses[gradient]} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-6 w-6 text-slate-700" />
                </div>
              )}
              <div>
                {title && (
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <p className="text-sm text-slate-500 mt-1">{description}</p>
                )}
              </div>
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={title || Icon ? "pt-6" : "p-0"}>
        {children}
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'slate';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  trend
}) => {
  const gradientClasses = {
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-rose-600',
    yellow: 'from-yellow-500 to-amber-600',
    slate: 'from-slate-500 to-slate-700'
  };

  const bgGradientClasses = {
    blue: 'from-blue-50 to-blue-100',
    purple: 'from-purple-50 to-purple-100',
    green: 'from-green-50 to-emerald-100',
    red: 'from-red-50 to-rose-100',
    yellow: 'from-yellow-50 to-amber-100',
    slate: 'from-slate-50 to-slate-100'
  };

  return (
    <Card className={`border-none shadow-xl bg-gradient-to-br ${bgGradientClasses[gradient]} rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 mb-2">{title}</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClasses[gradient]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
