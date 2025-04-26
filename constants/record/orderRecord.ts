import { OrderStatus } from "@/constants";

export const OrderRecord: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ thanh toán',
  [OrderStatus.DELIVERING]: 'Đang giao hàng',
  [OrderStatus.COMPLETED]: 'Đã giao hàng',
  [OrderStatus.CANCELLED]: 'Đã hủy',
}