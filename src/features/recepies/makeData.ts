export type Recipe = {
    id: string;
    name: string;
    bitrix_id: string;
    weight: string;
    time1: string;
    time2: string;
    prep: string;

    subRows?: Recipe[];
  };
  
  export const fakeData: Recipe[] = [
    {
      id: '1',
      name: 'Browney',
      bitrix_id: '00087',
      weight: '',
        time1: '',
        time2: '',
        prep: '',
      subRows: [
        {
          id: '1.1',
          name: 'Мука',
          weight: '',
          bitrix_id: '10101',
          time1: '',
          time2: '',
          prep: '',
        },
        {
            id: '1.2',
            name: '222',
            bitrix_id: '',
            weight: '',
            time1: '50min',
            time2: '60min',
            prep: 'well',
            subRows: [
                {
                  id: '1.2.1',
                  name: '333',
                  bitrix_id: '30303',
                  weight: '5555',
                  time1: '',
                  time2: '',
                  prep: '',
                }
              ],
        },
      ],
    },
  ];
  

  