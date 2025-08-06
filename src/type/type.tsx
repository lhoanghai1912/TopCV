export type JobSearchParams = {
  Page?: string; // Trang hiện tại
  PageSize?: string; // Số item mỗi trang
  OderBy?: string; // Sắp xếp theo
  Filter?: string;
  Search?: string;
};

export type jobList = {
  applicationDeadline;
  companyIndustry;
  companyLogoUrl;
  companyName;
  createdAt;
  currency;
  id;
  jobField;
  jobType;
  location;
  salaryFrom;
  salaryTo;
  title;
};
