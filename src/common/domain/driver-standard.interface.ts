export interface UnstructuredAddress {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  postcode: string;
  county: string;
  language: string;
  dps: string;
  mailsort: string;
}

export interface StructuredAddress {
  poBoxNumber: string;
  organisationName: string;
  departmentName: string;
  subBuildingName: string;
  buildingName: string;
  buildingNumber: string;
  dependentThoroughfareName: string;
  thoroughfareName: string;
  doubleDependentLocality: string;
  dependentLocality: string;
  postTown: string;
  postcode: string;
  country: string;
  language: string;
  dps: string;
  uprn: string;
  udprn: string;
  mailsort: string;
}

export interface Address {
  unstructuredAddress: UnstructuredAddress;
  structuredAddress: StructuredAddress;
}

export interface Driver {
  lastName: string;
  firstNames: string;
  drivingLicenceNumber: string;
  title: string;
  nameFormat: string;
  fullModeOfAddress: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: Address;
  imagesExist: boolean;
}

export interface Licence {
  status: string;
  type: string;
}

export interface Restriction {
  restrictionCode: string;
  restrictionLiteral: string;
}

export interface Entitlement {
  categoryCode: string;
  categoryLegalLiteral: string;
  categoryShortLiteral: string;
  categoryType: string;
  fromDate: string;
  expiryDate: string;
  categoryStatus: string;
  restrictions: Restriction[];
}

export interface CategoryRestriction {
  categoryRestrictionCode: string;
  categoryRestrictionLiteral: string;
}

export interface Entitlement2 {
  category: string;
  categoryLegalLiteral: string;
  categoryShortLiteral: string;
  categoryType: string;
  categoryFromDate: string;
  categoryExpiryDate: string;
  categoryRestrictions: CategoryRestriction[];
  group?: any;
  groupShortLiteral?: any;
  groupLegalLiteral?: any;
  groupType?: any;
  groupFromDate?: any;
  groupExpiryDate?: any;
  groupRestrictions?: any;
}

export interface Token {
  validFromDate: string;
  validToDate: string;
  type: string;
  drivingLicenceNumber: string;
  issueNumber: string;
  entitlements: Entitlement2[];
  isProvisional: boolean;
}

export interface DriverStandard {
  driver: Driver;
  licence: Licence;
  entitlement: Entitlement[];
  token: Token;
}
