export type TrainingCustomer = {
  id: number;
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
};

export type Training = {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customer: TrainingCustomer;
};