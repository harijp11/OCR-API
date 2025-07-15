export interface AadhaarInfo {
    _id:string
    dob: string | null;
    aadharNumber: string | null;
    gender: string | null;
    name: string | null;
    fatherName: string | null;
    address: string | null;
    pinCode:string
    createdAt:Date
    updatedAt:Date
}   