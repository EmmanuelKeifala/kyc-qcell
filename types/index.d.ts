declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export type DataType = {
  id: string;
  created_at: string;
  phoneNumber: string;
  otp: string;
  verificationStatus: 'pending' | 'verified' | 'requires visit' | 'flagged';
  selfieUrl: string;
  idCardUrl: string;
  metadata: Record<string, any>; // Adjust as needed for specific metadata structure
};
