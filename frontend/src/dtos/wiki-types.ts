export type page = {
  id: number;
  name: string;
  link: string;
  categories: string[];
};

export type connections = {
  originPage: number;
  targetPage: number;
};
