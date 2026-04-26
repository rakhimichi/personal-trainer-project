export type CustomerFormData = {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
};

export type Customer = CustomerFormData & {
  _links: {
    self: {
      href: string;
    };
    customer: {
      href: string;
    };
    trainings: {
      href: string;
    };
  };
};

export type CustomersResponse = {
  _embedded: {
    customers: Customer[];
  };
};