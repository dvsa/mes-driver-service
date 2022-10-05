export interface Address {
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
