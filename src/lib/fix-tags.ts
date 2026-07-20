/**
 * Common FIX tag → name map (subset for log browsing).
 * Unknown tags still render as Tag N.
 */
export const FIX_TAGS: Record<number, string> = {
  1: 'Account',
  6: 'AvgPx',
  8: 'BeginString',
  9: 'BodyLength',
  10: 'CheckSum',
  11: 'ClOrdID',
  14: 'CumQty',
  15: 'Currency',
  17: 'ExecID',
  20: 'ExecTransType',
  21: 'HandlInst',
  22: 'SecurityIDSource',
  31: 'LastPx',
  32: 'LastQty',
  34: 'MsgSeqNum',
  35: 'MsgType',
  37: 'OrderID',
  38: 'OrderQty',
  39: 'OrdStatus',
  40: 'OrdType',
  41: 'OrigClOrdID',
  44: 'Price',
  48: 'SecurityID',
  49: 'SenderCompID',
  50: 'SenderSubID',
  52: 'SendingTime',
  54: 'Side',
  55: 'Symbol',
  56: 'TargetCompID',
  57: 'TargetSubID',
  58: 'Text',
  59: 'TimeInForce',
  60: 'TransactTime',
  75: 'TradeDate',
  103: 'OrdRejReason',
  150: 'ExecType',
  151: 'LeavesQty',
  167: 'SecurityType',
  198: 'SecondaryOrderID',
  207: 'SecurityExchange',
  336: 'TradingSessionID',
  376: 'ComplianceID',
  448: 'PartyID',
  452: 'PartyRole',
  453: 'NoPartyIDs',
  526: 'SecondaryClOrdID',
  528: 'OrderCapacity',
  847: 'TargetStrategy',
};

/** MsgType (35) short labels */
export const MSG_TYPES: Record<string, string> = {
  '0': 'Heartbeat',
  '1': 'TestRequest',
  '2': 'ResendRequest',
  '3': 'Reject',
  '4': 'SequenceReset',
  '5': 'Logout',
  A: 'Logon',
  D: 'NewOrderSingle',
  F: 'OrderCancelRequest',
  G: 'OrderCancelReplace',
  '8': 'ExecutionReport',
  '9': 'OrderCancelReject',
  V: 'MarketDataRequest',
  W: 'MarketDataSnapshot',
  X: 'MarketDataIncremental',
  j: 'BusinessMessageReject',
  AE: 'TradeCaptureReport',
};

export const SIDE_LABEL: Record<string, string> = {
  '1': 'Buy',
  '2': 'Sell',
  '5': 'SellShort',
  '6': 'SellShortExempt',
  B: 'AsDefined',
  C: 'Opposite',
};

export const ORD_STATUS: Record<string, string> = {
  '0': 'New',
  '1': 'Partial',
  '2': 'Filled',
  '4': 'Canceled',
  '5': 'Replaced',
  '6': 'PendingCancel',
  '8': 'Rejected',
  A: 'PendingNew',
  C: 'Expired',
  E: 'PendingReplace',
};

export const SAMPLE_FIX = `8=FIX.4.4|9=178|35=D|34=2|49=CLIENT|56=BROKER|52=20240720-10:15:30.123|11=ORD-1001|55=BTCUSDT|54=1|38=1.5|40=2|44=65000|59=0|60=20240720-10:15:30.100|10=128|
8=FIX.4.4|9=210|35=8|34=3|49=BROKER|56=CLIENT|52=20240720-10:15:30.250|37=EX-9001|11=ORD-1001|17=EXC-1|150=0|39=0|55=BTCUSDT|54=1|38=1.5|44=65000|32=0|31=0|151=1.5|14=0|6=0|60=20240720-10:15:30.240|10=201|
8=FIX.4.4|9=220|35=8|34=4|49=BROKER|56=CLIENT|52=20240720-10:15:31.010|37=EX-9001|11=ORD-1001|17=EXC-2|150=F|39=2|55=BTCUSDT|54=1|38=1.5|44=65000|32=1.5|31=64995.5|151=0|14=1.5|6=64995.5|60=20240720-10:15:31.000|10=088|
8=FIX.4.4|9=165|35=D|34=5|49=CLIENT|56=BROKER|52=20240720-10:16:05.000|11=ORD-1002|55=ETHUSDT|54=2|38=10|40=1|59=3|60=20240720-10:16:05.000|10=155|
8=FIX.4.4|9=195|35=8|34=6|49=BROKER|56=CLIENT|52=20240720-10:16:05.120|37=EX-9002|11=ORD-1002|17=EXC-3|150=8|39=8|55=ETHUSDT|54=2|38=10|58=Insufficient buying power|60=20240720-10:16:05.110|10=042|`;
