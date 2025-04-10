import { BarList, BarListProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const data: BarListProps['data'] = [
  { name: '/home', value: 456 },
  { name: '/imprint', value: 351 },
  { name: '/cancellation', value: 51 },
];

export default () => {
  const store = useCreateStore();

  const props: BarListProps | any = useControls(
    {
      showAnimation: true,
      sortOrder: {
        options: ['ascending', 'descending', 'none'],
        value: 'descending',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <BarList data={data} {...props} />
    </StoryBook>
  );
};
