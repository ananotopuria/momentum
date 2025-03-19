export interface StatusTasksBoardProps {
    filters: {
      departments: string[];
      priorities: string[];
      assignee: string[];
    };
    setFilters: React.Dispatch<
      React.SetStateAction<{
        departments: string[];
        priorities: string[];
        assignee: string[];
      }>
    >;
  }



  export interface FiltersProps {
    filters: {
      departments: string[];
      priorities: string[];
      assignee: string[];
    };
    setFilters: React.Dispatch<
      React.SetStateAction<{
        departments: string[];
        priorities: string[];
        assignee: string[];
      }>
    >;
  }