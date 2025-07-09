import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface DashboardStats {
  error: boolean;
  stats: {
    total_requests: number;
    pending_requests: number;
    active_services: number;
    total_revenue: number;
    month_revenue: number;
    total_customers: number;
    rating: number;
    total_reviews: number;
    completed_orders: number;
    verified: boolean;
  };
  message?: string;
}

export interface RevenueAnalytics {
  error: boolean;
  analytics: {
    total_revenue: number;
    monthly_revenue: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
    revenue_by_service: Array<{
      service_id: number;
      service_title: string;
      revenue: number;
      orders: number;
    }>;
    average_order_value: number;
    revenue_growth: number;
  };
}

export interface RequestAnalytics {
  error: boolean;
  analytics: {
    total_requests: number;
    pending_requests: number;
    accepted_requests: number;
    completed_requests: number;
    declined_requests: number;
    acceptance_rate: number;
    completion_rate: number;
    average_response_time: number;
    requests_by_month: Array<{
      month: string;
      requests: number;
      accepted: number;
      completed: number;
    }>;
  };
}

export interface ServiceAnalytics {
  error: boolean;
  analytics: {
    total_services: number;
    active_services: number;
    top_performing_services: Array<{
      service_id: number;
      service_title: string;
      views: number;
      requests: number;
      orders: number;
      revenue: number;
      rating: number;
    }>;
    service_performance: Array<{
      service_id: number;
      service_title: string;
      conversion_rate: number;
      average_rating: number;
      total_reviews: number;
    }>;
  };
}

export interface CustomerAnalytics {
  error: boolean;
  analytics: {
    total_customers: number;
    new_customers: number;
    repeat_customers: number;
    customer_retention_rate: number;
    average_customer_value: number;
    customer_acquisition_by_month: Array<{
      month: string;
      new_customers: number;
      repeat_customers: number;
    }>;
    top_customers: Array<{
      customer_id: number;
      customer_name: string;
      total_spent: number;
      total_orders: number;
      last_order_date: string;
    }>;
  };
}

export interface PerformanceMetrics {
  error: boolean;
  metrics: {
    response_time: {
      average: number;
      target: number;
      performance: 'good' | 'average' | 'poor';
    };
    completion_rate: {
      rate: number;
      target: number;
      performance: 'good' | 'average' | 'poor';
    };
    customer_satisfaction: {
      rating: number;
      target: number;
      performance: 'good' | 'average' | 'poor';
    };
    revenue_growth: {
      growth: number;
      target: number;
      performance: 'good' | 'average' | 'poor';
    };
  };
}

class VendorAnalyticsAPI {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD);
    return response.data;
  }

  // Get revenue analytics
  async getRevenueAnalytics(period: string = '12m'): Promise<RevenueAnalytics> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/revenue?period=${period}`
    );
    return response.data;
  }

  // Get request analytics
  async getRequestAnalytics(period: string = '12m'): Promise<RequestAnalytics> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/requests?period=${period}`
    );
    return response.data;
  }

  // Get service analytics
  async getServiceAnalytics(period: string = '12m'): Promise<ServiceAnalytics> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/services?period=${period}`
    );
    return response.data;
  }

  // Get customer analytics
  async getCustomerAnalytics(period: string = '12m'): Promise<CustomerAnalytics> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/customers?period=${period}`
    );
    return response.data;
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/performance`
    );
    return response.data;
  }

  // Get earnings report
  async getEarningsReport(startDate: string, endDate: string): Promise<{
    error: boolean;
    report: {
      total_earnings: number;
      gross_revenue: number;
      platform_fees: number;
      net_earnings: number;
      tax_amount: number;
      earnings_by_service: Array<{
        service_id: number;
        service_title: string;
        gross_revenue: number;
        platform_fees: number;
        net_earnings: number;
      }>;
      earnings_by_month: Array<{
        month: string;
        gross_revenue: number;
        platform_fees: number;
        net_earnings: number;
      }>;
    };
  }> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/earnings?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  }

  // Export analytics data
  async exportAnalytics(type: string, period: string = '12m'): Promise<Blob> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/export?type=${type}&period=${period}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Get competitor analysis
  async getCompetitorAnalysis(): Promise<{
    error: boolean;
    analysis: {
      market_position: number;
      average_market_price: number;
      your_average_price: number;
      price_competitiveness: 'competitive' | 'above_market' | 'below_market';
      market_share: number;
      top_competitors: Array<{
        business_name: string;
        rating: number;
        completed_orders: number;
        average_price: number;
      }>;
    };
  }> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/competitor-analysis`
    );
    return response.data;
  }

  // Get growth insights
  async getGrowthInsights(): Promise<{
    error: boolean;
    insights: {
      growth_opportunities: Array<{
        type: string;
        title: string;
        description: string;
        potential_impact: 'high' | 'medium' | 'low';
        effort_required: 'high' | 'medium' | 'low';
      }>;
      recommendations: Array<{
        category: string;
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
      }>;
    };
  }> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_ANALYTICS.DASHBOARD}/growth-insights`
    );
    return response.data;
  }
}

export default new VendorAnalyticsAPI();
