export enum ExpenseCategoryEnum {
  Samples_ProductTesting = 'Samples/Product Testing',
  StockPurchase_ChinaImports = 'Stock Purchase/China Imports',
  Website_Domain_Hosting = 'Website/Domain/Hosting',
  GST_CA_ConsultantFees = 'GST/CA/Consultant Fees',
  Warehouse_GodownRent = 'Warehouse/Godown Rent',
  Machinery_Tools = 'Machinery/Tools',
  Transport_PetrolDiesel_LocalDelivery = 'Transport/Petrol/Diesel/Local Delivery',
  Designs_Branding_Labels = 'Designs/Branding/Labels',
  Marketing_Advertising_Online_Offline = 'Marketing/Advertising Online/Offline',
  OfficeExpenses_Stationery_Electricity_Internet = 'Office Expenses/Stationery/Electricity/Internet',
  PackagingMaterial = 'Packaging Material',
  StaffSalary_LabourCharges = 'Staff Salary/Labour Charges',
  Bills_Electricity_Phone_Water = 'Bills/Electricity/Phone/Water',
  CompanyRegistration_LegalFees = 'Company Registration/Legal Fees',
  BankCharges_ForexFees = 'Bank Charges/Forex Fees',
  CustomerRefunds_Returns = 'Customer Refunds/Returns',
  Add_CompanyBalance = 'Added Into Company Balance',
  Other_Miscellaneous = 'Other/Miscellaneous',
}

export enum ModeOfPaymentEnum {
  UPI = 'UPI',
  Cash = 'Cash',
  Card = 'Card',
  BankTransfer = 'Bank Transfer',
  NetBanking = 'Net Banking',
  WireTransfer = 'Wire Transfer',
  Paypal = 'Paypal',
  Cheque = 'Cheque',
  DemandDraft = 'Demand Draft',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  IMPS = 'IMPS',
  Other = 'Other',
}

export enum PayerEnum {
  Bhargav = 'Bhargav',
  Jay = 'Jay',
  Shivam = 'Shivam',
  Sahil = 'Sahil',
  Company = 'Company',
}

export interface InvestmentCreateRequest {
  paymentDate: Date;
  amount: number;
  modeOfPayment: ModeOfPaymentEnum;
  category: ExpenseCategoryEnum;
  payer: PayerEnum;
  description: string | null;
}
