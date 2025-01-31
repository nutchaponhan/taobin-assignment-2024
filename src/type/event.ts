export const eventType = {
  sale: 'sale',
  refill: 'refill',
  lowStock: 'lowStock',
  stockLevelOk: 'stockLevelOk',
} as const;

export type EventType = (typeof eventType)[keyof typeof eventType];

export abstract class IEvent {
  abstract type(): EventType;
  abstract machineId(): string;
}
