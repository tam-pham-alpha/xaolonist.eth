/**
 * Ngũ hành × CK VN — snapshot data for the Oracle atlas micro-module.
 * Caps are approximate nghìn tỷ VND (T), HOSE ~2026-07. Not investment advice.
 */

export type ElementId = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export type MappingMode = 'classic' | 'period9';

export type StockRow = {
  symbol: string;
  name: string;
  marketCapT: number;
  /** Classic: ngành. Period9: lý do vào basket. */
  note: string;
};

export type ElementDef = {
  id: ElementId;
  label: string;
  han: string;
  sectors: string;
  stocks: StockRow[];
};

export const SNAPSHOT_NOTE = 'Snapshot HOSE ~2026-07 · cap nghìn tỷ VND (T)';

export const ELEMENTS: ElementDef[] = [
  {
    id: 'kim',
    label: 'Kim',
    han: '金',
    sectors: 'Ngân hàng · chứng khoán · bảo hiểm · thép · kim loại',
    stocks: [
      { symbol: 'VCB', name: 'Vietcombank', marketCapT: 474, note: 'Ngân hàng' },
      { symbol: 'BID', name: 'BIDV', marketCapT: 268, note: 'Ngân hàng' },
      { symbol: 'CTG', name: 'VietinBank', marketCapT: 231, note: 'Ngân hàng' },
      { symbol: 'TCB', name: 'Techcombank', marketCapT: 211, note: 'Ngân hàng' },
      { symbol: 'VPB', name: 'VPBank', marketCapT: 198, note: 'Ngân hàng' },
      { symbol: 'MBB', name: 'MB Bank', marketCapT: 180, note: 'Ngân hàng' },
      { symbol: 'HPG', name: 'Hòa Phát', marketCapT: 175, note: 'Thép' },
      { symbol: 'LPB', name: 'LPBank', marketCapT: 163, note: 'Ngân hàng' },
      { symbol: 'HDB', name: 'HDBank', marketCapT: 135, note: 'Ngân hàng' },
      { symbol: 'STB', name: 'Sacombank', marketCapT: 134, note: 'Ngân hàng' },
    ],
  },
  {
    id: 'moc',
    label: 'Mộc',
    han: '木',
    sectors: 'Cao su · nông nghiệp · dược · sữa / thực phẩm thực vật',
    stocks: [
      { symbol: 'VNM', name: 'Vinamilk', marketCapT: 124, note: 'Sữa / F&B' },
      { symbol: 'GVR', name: 'Tập đoàn Cao su VN', marketCapT: 109, note: 'Cao su' },
      { symbol: 'SBT', name: 'TTC - Biên Hòa', marketCapT: 19, note: 'Đường / nông sản' },
      { symbol: 'HAG', name: 'Hoàng Anh Gia Lai', marketCapT: 18, note: 'Nông nghiệp' },
      { symbol: 'DPM', name: 'Đạm Phú Mỹ', marketCapT: 15, note: 'Phân bón' },
      { symbol: 'DCM', name: 'Đạm Cà Mau', marketCapT: 15, note: 'Phân bón' },
      { symbol: 'DHG', name: 'Dược Hậu Giang', marketCapT: 12, note: 'Dược' },
      { symbol: 'BAF', name: 'BAF Việt Nam', marketCapT: 11, note: 'Nông nghiệp' },
      { symbol: 'HPA', name: 'Hòa Phát Agriculture', marketCapT: 9, note: 'Nông nghiệp' },
      { symbol: 'PHR', name: 'Phước Hòa Rubber', marketCapT: 8, note: 'Cao su' },
    ],
  },
  {
    id: 'thuy',
    label: 'Thủy',
    han: '水',
    sectors: 'Đồ uống · du lịch · hàng không · logistics / cảng · thủy sản',
    stocks: [
      { symbol: 'MCH', name: 'Masan Consumer', marketCapT: 178, note: 'Đồ uống / FMCG' },
      { symbol: 'VPL', name: 'Vinpearl', marketCapT: 132, note: 'Du lịch' },
      { symbol: 'VJC', name: 'VietJet', marketCapT: 101, note: 'Hàng không' },
      { symbol: 'HVN', name: 'Vietnam Airlines', marketCapT: 70, note: 'Hàng không' },
      { symbol: 'SAB', name: 'Sabeco', marketCapT: 60, note: 'Đồ uống' },
      { symbol: 'GMD', name: 'Gemadept', marketCapT: 31, note: 'Cảng / logistics' },
      { symbol: 'VHC', name: 'Vĩnh Hoàn', marketCapT: 12, note: 'Thủy sản' },
      { symbol: 'BWE', name: 'Nước – MT Bình Dương', marketCapT: 10, note: 'Nước' },
      { symbol: 'PVT', name: 'PV Trans', marketCapT: 9, note: 'Vận tải biển' },
      { symbol: 'HAH', name: 'Hải An', marketCapT: 8, note: 'Vận tải biển' },
    ],
  },
  {
    id: 'hoa',
    label: 'Hỏa',
    han: '火',
    sectors: 'Khí / dầu / điện · lọc hóa · công nghệ · bán lẻ điện tử',
    stocks: [
      { symbol: 'GAS', name: 'PV Gas', marketCapT: 164, note: 'Khí' },
      { symbol: 'BSR', name: 'Lọc hóa dầu BSR', marketCapT: 115, note: 'Lọc dầu' },
      { symbol: 'FPT', name: 'FPT', marketCapT: 110, note: 'Công nghệ' },
      { symbol: 'MWG', name: 'Thế Giới Di Động', marketCapT: 104, note: 'Bán lẻ điện tử' },
      { symbol: 'GEE', name: 'Gelex Electricity', marketCapT: 43, note: 'Điện' },
      { symbol: 'POW', name: 'PV Power', marketCapT: 42, note: 'Điện' },
      { symbol: 'PLX', name: 'Petrolimex', marketCapT: 41, note: 'Xăng dầu' },
      { symbol: 'REE', name: 'REE', marketCapT: 27, note: 'Điện / kỹ thuật' },
      { symbol: 'PGV', name: 'EVN Genco 3', marketCapT: 26, note: 'Điện' },
      { symbol: 'FRT', name: 'FPT Retail', marketCapT: 19, note: 'Bán lẻ điện tử' },
    ],
  },
  {
    id: 'tho',
    label: 'Thổ',
    han: '土',
    sectors: 'Bất động sản · khu công nghiệp · VLXD · xây dựng',
    stocks: [
      { symbol: 'VIC', name: 'Vingroup', marketCapT: 1516, note: 'BĐS / conglomerate' },
      { symbol: 'VHM', name: 'Vinhomes', marketCapT: 560, note: 'BĐS' },
      { symbol: 'VRE', name: 'Vincom Retail', marketCapT: 52, note: 'BĐS bán lẻ' },
      { symbol: 'BCM', name: 'Becamex', marketCapT: 39, note: 'KCN / BĐS' },
      { symbol: 'NVL', name: 'Novaland', marketCapT: 30, note: 'BĐS' },
      { symbol: 'KBC', name: 'Kinh Bắc', marketCapT: 25, note: 'KCN / BĐS' },
      { symbol: 'KDH', name: 'Khang Điền', marketCapT: 20, note: 'BĐS' },
      { symbol: 'VPI', name: 'Văn Phú Invest', marketCapT: 20, note: 'BĐS' },
      { symbol: 'CRV', name: 'CRV Real Estate', marketCapT: 18, note: 'BĐS' },
      { symbol: 'VGC', name: 'Viglacera', marketCapT: 17, note: 'VLXD' },
    ],
  },
];

/** Vận 9 / Ly Hỏa — curated basket (not a ngũ hành remapping). */
export const PERIOD9_STOCKS: StockRow[] = [
  { symbol: 'VIC', name: 'Vingroup', marketCapT: 1516, note: 'Neo All-in: VinFast / điện hóa' },
  { symbol: 'GAS', name: 'PV Gas', marketCapT: 164, note: 'Năng lượng' },
  { symbol: 'BSR', name: 'Lọc hóa dầu BSR', marketCapT: 115, note: 'Chuỗi năng lượng' },
  { symbol: 'FPT', name: 'FPT', marketCapT: 110, note: 'Công nghệ · AI' },
  { symbol: 'MWG', name: 'Thế Giới Di Động', marketCapT: 104, note: 'Thiết bị số' },
  { symbol: 'GEE', name: 'Gelex Electricity', marketCapT: 43, note: 'Điện' },
  { symbol: 'POW', name: 'PV Power', marketCapT: 42, note: 'Điện' },
  { symbol: 'PLX', name: 'Petrolimex', marketCapT: 41, note: 'Năng lượng' },
  { symbol: 'GEX', name: 'GELEX', marketCapT: 29, note: 'Điện / công nghiệp' },
  { symbol: 'REE', name: 'REE', marketCapT: 27, note: 'Điện · kỹ thuật' },
  { symbol: 'PGV', name: 'EVN Genco 3', marketCapT: 26, note: 'Phát điện' },
  { symbol: 'FRT', name: 'FPT Retail', marketCapT: 19, note: 'Bán lẻ số' },
  { symbol: 'VSH', name: 'Thủy điện Vĩnh Sơn–Sông Hinh', marketCapT: 10, note: 'Điện tái tạo' },
  { symbol: 'CTR', name: 'Viettel Construction', marketCapT: 9, note: 'Hạ tầng viễn thông' },
  { symbol: 'PC1', name: 'PC1 Group', marketCapT: 8, note: 'Hạ tầng điện' },
  { symbol: 'DGW', name: 'Digiworld', marketCapT: 8, note: 'Phân phối ICT' },
  { symbol: 'VTP', name: 'Viettel Post', marketCapT: 7, note: 'Viễn thông / logistics số' },
  { symbol: 'HDG', name: 'Hà Đô', marketCapT: 7, note: 'Năng lượng tái tạo' },
  { symbol: 'NT2', name: 'Điện lực Nhơn Trạch 2', marketCapT: 6, note: 'Phát điện' },
  { symbol: 'CMG', name: 'CMC', marketCapT: 6, note: 'Công nghệ' },
];

export function getElement(id: ElementId): ElementDef {
  return ELEMENTS.find((e) => e.id === id) ?? ELEMENTS[0];
}

export function formatCapT(t: number): string {
  return `${t.toLocaleString('vi-VN')} T`;
}
