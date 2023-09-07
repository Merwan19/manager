export const GLOBAL_DKIM_STATUS = {
  OK: 'OK',
  NOK: 'NOK',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
};

export const DKIM_STATUS = {
  DELETING: 'deleting',
  DISABLING: 'disabling',
  ENABLING: 'enabling',
  IN_PRODUCTION: 'inProduction',
  READY: 'ready',
  TODO: 'todo',
  WAITING_RECORD: 'waitingRecord',
};

export const DKIM_MATCHING_SCHEMA_STATUS = {
  OK: [DKIM_STATUS.IN_PRODUCTION],
  NOK: [
    DKIM_STATUS.DELETING,
    DKIM_STATUS.DISABLING,
    DKIM_STATUS.READY,
    DKIM_STATUS.WAITING_RECORD,
  ],
  NOT_CONFIGURED: [DKIM_STATUS.TODO],
};

export default {
  GLOBAL_DKIM_STATUS,
  DKIM_STATUS,
  DKIM_MATCHING_SCHEMA_STATUS,
};
