// Order status constants and utilities for consistent order status handling

export type OrderStatus = "not paid" | "paid" | "processing" | "completed" | "refund" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "not paid",
  "paid", 
  "processing",
  "completed",
  "refund",
  "cancelled"
];

export const getOrderStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "default"; // Green
    case "paid":
    case "processing":
      return "secondary"; // Blue
    case "not paid":
      return "outline"; // Gray
    case "refund":
    case "cancelled":
      return "destructive"; // Red
    default:
      return "outline";
  }
};

export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-100";
    case "paid":
      return "text-blue-600 bg-blue-100";
    case "processing":
      return "text-yellow-600 bg-yellow-100";
    case "not paid":
      return "text-gray-600 bg-gray-100";
    case "refund":
      return "text-orange-600 bg-orange-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
