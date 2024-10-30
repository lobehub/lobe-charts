import { ScatterChart, ScatterChartProps } from '@lobehub/charts';

const data: ScatterChartProps['data'] = [
  {
    'Country': 'Argentina',
    'GDP': 13_467.1236,
    'Life expectancy': 76.3,
    'Population': 43_417_765,
  },
  {
    'Country': 'Australia',
    'GDP': 56_554.3876,
    'Life expectancy': 82.8,
    'Population': 23_789_338,
  },
  {
    'Country': 'Austria',
    'GDP': 43_665.947,
    'Life expectancy': 81.5,
    'Population': 8_633_169,
  },
  {
    'Country': 'Brazil',
    'GDP': 8757.2622,
    'Life expectancy': 75,
    'Population': 2_596_218,
  },
  {
    'Country': 'Estonia',
    'GDP': 1774.9291,
    'Life expectancy': 77.6,
    'Population': 131_547,
  },
  {
    'Country': 'Ethiopia',
    'GDP': 645.463_762_7,
    'Life expectancy': 64.8,
    'Population': 9_987_333,
  },
  {
    'Country': 'Germany',
    'GDP': 41_176.881_58,
    'Life expectancy': 81,
    'Population': 81_686_611,
  },
  {
    'Country': 'Honduras',
    'GDP': 2326.158_56,
    'Life expectancy': 74.6,
    'Population': 896_829,
  },
  {
    'Country': 'Italy',
    'GDP': 349.147_55,
    'Life expectancy': 82.7,
    'Population': 673_582,
  },
  {
    'Country': 'Lithuania',
    'GDP': 14_252.428_53,
    'Life expectancy': 73.6,
    'Population': 29_491,
  },
  {
    'Country': 'Mexico',
    'GDP': 9143.128_494,
    'Life expectancy': 76.7,
    'Population': 12_589_949,
  },
  {
    'Country': 'Norway',
    'GDP': 7455.246_54,
    'Life expectancy': 81.8,
    'Population': 518_867,
  },
  {
    'Country': 'Philippines',
    'GDP': 2878.338_37,
    'Life expectancy': 68.5,
    'Population': 11_716_359,
  },
  {
    'Country': 'Samoa',
    'GDP': 4149.363_444,
    'Life expectancy': 74,
    'Population': 193_759,
  },
  {
    'Country': 'Sao Tome and Principe',
    'GDP': 1624.639_63,
    'Life expectancy': 67.5,
    'Population': 195_553,
  },
  {
    'Country': 'Senegal',
    'GDP': 98.725_614_5,
    'Life expectancy': 66.7,
    'Population': 14_976_994,
  },
  {
    'Country': 'Switzerland',
    'GDP': 89_899.8424,
    'Life expectancy': 83.4,
    'Population': 8_282_396,
  },
  {
    'Country': 'Tajikistan',
    'GDP': 918.677_154_3,
    'Life expectancy': 69.7,
    'Population': 8_548_651,
  },
  {
    'Country': 'Ukraine',
    'GDP': 2124.662_666,
    'Life expectancy': 71.3,
    'Population': 4_515_429,
  },
  {
    'Country': 'Uruguay',
    'GDP': 15_524.842_47,
    'Life expectancy': 77,
    'Population': 3_431_552,
  },
  {
    'Country': 'Zimbabwe',
    'GDP': 118.693_83,
    'Life expectancy': 67,
    'Population': 15_777_451,
  },
];

const valueFormatter: ScatterChartProps['valueFormatter'] = {
  size: (population) => `${(population / 1_000_000).toFixed(1)}M people`,
  x: (amount) => `$${(amount / 1000).toFixed(1)}K`,
  y: (lifeExp) => `${lifeExp} yrs`,
};

export default () => {
  return (
    <ScatterChart
      category="Country"
      data={data}
      enableLegendSlider
      minYValue={60}
      showOpacity={true}
      size="Population"
      valueFormatter={valueFormatter}
      x="GDP"
      y="Life expectancy"
    />
  );
};
