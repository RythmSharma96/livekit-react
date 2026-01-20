export enum UseCase {
  ORDER_DELIVERY = 'ORDER_DELIVERY',
  RESERVATION = 'RESERVATION',
  TAKEAWAY = 'TAKEAWAY',
}

export const USE_CASE_CONFIG = {
  [UseCase.ORDER_DELIVERY]: {
    title: 'Order Delivery Confirmation',
    description: 'Auto-call after delivery to confirm receipt and escalate if missing',
    icon: 'delivery',
  },
  [UseCase.RESERVATION]: {
    title: 'Reservation Handling',
    description: 'Reservation booking',
    icon: 'calendar',
  },
  [UseCase.TAKEAWAY]: {
    title: 'Takeaway Order Calls',
    description: 'Full order taking with POS integration and upsells',
    icon: 'takeaway',
  },
} as const;

export type UseCaseConfig = (typeof USE_CASE_CONFIG)[UseCase];
