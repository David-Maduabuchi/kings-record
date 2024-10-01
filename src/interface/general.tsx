import { Profile } from "./redux-interface";

interface AuthState {
  is_authenticated: boolean;
  profile: Profile;
  redirectionMessage: string;
  redirectEmail: string;
}
interface Sidebar {
  isSidebarOpen: boolean
}

export interface RootState {
  auth_reducer: AuthState;
  sidebar_reducer: Sidebar 
}

export interface DataTableProps {
  column: {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
  }[];

  rows:
    | {
        id: number ;
        tid: string;
        amount: number;
        address: string;
        asset: string;
        name: string;
        date: string;
        time: string;
        tx_state: string;
        approved_by: string;
      }[];
}

