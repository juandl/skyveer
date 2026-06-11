export interface AwsRegion {
  value: string;
  label: string;
}

export const DEFAULT_REGION = "us-east-1";

export const REGIONS: AwsRegion[] = [
  // US
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  // Canada
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "ca-west-1", label: "Canada West (Calgary)" },
  // Europe
  { value: "eu-central-1", label: "EU (Frankfurt)" },
  { value: "eu-central-2", label: "EU (Zurich)" },
  { value: "eu-west-1", label: "EU (Ireland)" },
  { value: "eu-west-2", label: "EU (London)" },
  { value: "eu-west-3", label: "EU (Paris)" },
  { value: "eu-north-1", label: "EU (Stockholm)" },
  { value: "eu-south-1", label: "EU (Milan)" },
  { value: "eu-south-2", label: "EU (Spain)" },
  // Asia Pacific
  { value: "ap-east-1", label: "Asia Pacific (Hong Kong)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-south-2", label: "Asia Pacific (Hyderabad)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-southeast-3", label: "Asia Pacific (Jakarta)" },
  { value: "ap-southeast-4", label: "Asia Pacific (Melbourne)" },
  { value: "ap-southeast-5", label: "Asia Pacific (Malaysia)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  { value: "ap-northeast-3", label: "Asia Pacific (Osaka)" },
  // South America
  { value: "sa-east-1", label: "South America (Sao Paulo)" },
  // Africa
  { value: "af-south-1", label: "Africa (Cape Town)" },
  // Middle East
  { value: "me-south-1", label: "Middle East (Bahrain)" },
  { value: "me-central-1", label: "Middle East (UAE)" },
  // Israel
  { value: "il-central-1", label: "Israel (Tel Aviv)" },
  // GovCloud
  { value: "us-gov-east-1", label: "AWS GovCloud (US-East)" },
  { value: "us-gov-west-1", label: "AWS GovCloud (US-West)" },
  // China (requires separate account)
  { value: "cn-north-1", label: "China (Beijing)" },
  { value: "cn-northwest-1", label: "China (Ningxia)" },
];
