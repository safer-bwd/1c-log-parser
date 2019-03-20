import { isNull } from '../utils/helpers';

export default {
  date: e => e.date,
  transactionStatus: e => e.transactionStatus,
  transactionId: e => (isNull(e.transaction) ? null : e.transaction.id),
  transactionDate: e => (isNull(e.transaction) ? null : e.transaction.date),
  userId: e => (isNull(e.user) ? null : e.user.id),
  userName: e => (isNull(e.user) ? null : e.user.name),
  computer: e => e.computer,
  application: e => e.application,
  connection: e => e.connection,
  event: e => e.event,
  level: e => e.level,
  comment: e => e.comment,
  metadataId: e => (isNull(e.metadata) ? null : e.metadata.id),
  metadataName: e => (isNull(e.metadata) ? null : e.metadata.name),
  data: e => e.data,
  dataPresentation: e => e.dataPresentation,
  server: e => e.server,
  port: e => e.port,
  syncPort: e => e.syncPort,
  session: e => e.session
};
