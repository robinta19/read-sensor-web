// Define the shape of the state
type BearState = {
  bears: number;
};

// Define the shape of the actions
type BearActions = {
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
};

// Combine state and actions
export type BearStore = BearState & BearActions;

type AllowedPrimitive = string | number | boolean | Date | File | Blob | null;
export type AllowedValue = AllowedPrimitive | AllowedPrimitive[];

// Format 2: Array data
export type DataArray<T> = T[];

// Format 3: Single object data
export type DataObject<T> = T;

export type decodedProps = {
  id: number;
  email: string;
  name: string;
  role: string;
  user_data: any;
  iat: number;
  exp: number;
};
