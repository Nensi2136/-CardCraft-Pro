import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import { Loader2, RefreshCw, Users, CreditCard, MessageSquare, Star } from 'lucide-react';
import { apiService, ApiResponse } from '@/react-app/services/api';

type DataType = 'users' | 'templates' | 'payments' | 'categories' | 'reviews';

interface ApiDataDisplayProps {
  dataType: DataType;
  title?: string;
  limit?: number;
}

export default function ApiDataDisplay({ dataType, title, limit = 10 }: ApiDataDisplayProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<any>;

      switch (dataType) {
        case 'users':
          // Note: This endpoint might need authentication
          response = await apiService.users.getProfile();
          if (response.success && response.data) {
            setData([response.data]);
          } else {
            setData([]);
          }
          break;

        case 'templates':
          response = await apiService.cards.getTemplates();
          if (response.success && response.data) {
            setData(response.data.slice(0, limit));
          } else {
            setData([]);
          }
          break;

        case 'categories':
          response = await apiService.cards.getCategories();
          if (response.success && response.data) {
            setData(response.data.slice(0, limit));
          } else {
            setData([]);
          }
          break;

        case 'payments':
          response = await apiService.payments.getUserPayments();
          if (response.success && response.data) {
            setData(response.data.slice(0, limit));
          } else {
            setData([]);
          }
          break;

        case 'reviews':
          response = await apiService.reviews.getReviews();
          if (response.success && response.data) {
            setData(response.data.slice(0, limit));
          } else {
            setData([]);
          }
          break;

        default:
          setError('Unknown data type');
          return;
      }

      if (!response.success) {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataType, limit]);

  const getIcon = () => {
    switch (dataType) {
      case 'users': return <Users className="w-5 h-5" />;
      case 'templates': return <Star className="w-5 h-5" />;
      case 'payments': return <CreditCard className="w-5 h-5" />;
      case 'categories': return <Users className="w-5 h-5" />;
      case 'reviews': return <MessageSquare className="w-5 h-5" />;
      default: return <RefreshCw className="w-5 h-5" />;
    }
  };

  const renderDataItem = (item: any, index: number) => {
    switch (dataType) {
      case 'users':
        return (
          <div key={item.id || index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.email}</p>
                <p className="text-xs text-gray-500">Role: {item.role}</p>
              </div>
              <Badge variant="secondary">{item.role}</Badge>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div key={item.id || index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-xs text-gray-500">ID: {item.id}</p>
              </div>
              <div className="text-right">
                {item.isPremium && <Badge variant="default">Premium</Badge>}
                <p className="text-sm font-medium">${item.price || '0.00'}</p>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div key={item.id || index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                {item.templateCount !== undefined && (
                  <p className="text-xs text-gray-500">{item.templateCount} templates</p>
                )}
              </div>
              {item.isActive !== undefined && (
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div key={item.id || index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">Payment #{item.id?.slice(-8)}</h4>
                <p className="text-sm text-gray-600">{item.paymentMethod}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={
                    item.status === 'completed' ? 'default' : 
                    item.status === 'pending' ? 'secondary' : 'destructive'
                  }
                >
                  {item.status}
                </Badge>
                <p className="text-sm font-medium">${item.amount}</p>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div key={item.id || index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (item.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{item.rating || 0}/5</span>
                </div>
                {item.comment && <p className="text-sm text-gray-700">{item.comment}</p>}
                {item.templateId && (
                  <p className="text-xs text-gray-500 mt-1">Template: {item.templateId}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="p-4 border rounded-lg">
            <pre className="text-xs overflow-auto">{JSON.stringify(item, null, 2)}</pre>
          </div>
        );
    }
  };

  const getDefaultTitle = () => {
    switch (dataType) {
      case 'users': return 'User Data';
      case 'templates': return 'Card Templates';
      case 'payments': return 'Payment History';
      case 'categories': return 'Template Categories';
      case 'reviews': return 'Reviews';
      default: return 'API Data';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            {title || getDefaultTitle()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading data...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={fetchData} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600">
                  Showing {data.length} item{data.length !== 1 ? 's' : ''}
                </div>
                <div className="space-y-3">
                  {data.map((item, index) => renderDataItem(item, index))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
