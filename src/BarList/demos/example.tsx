import { SiGithub, SiGoogle, SiReddit, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { BarList, BarListProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const data: BarListProps['data'] = [
  {
    href: 'https://x.com/tremorlabs',
    icon: <SiX color="default" size={'1em'} />,
    name: 'X',
    value: 456,
  },
  {
    href: 'https://google.com',
    icon: <SiGoogle color="default" size={'1em'} />,
    name: 'Google',
    value: 351,
  },
  {
    href: 'https://github.com/tremorlabs/tremor',
    icon: <SiGithub color="default" size={'1em'} />,
    name: 'GitHub',
    value: 271,
  },
  {
    href: 'https://reddit.com',
    icon: <SiReddit color="default" size={'1em'} />,
    name: 'Reddit',
    value: 191,
  },
  {
    href: 'https://www.youtube.com/@tremorlabs3079',
    icon: <SiYoutube color="default" size={'1em'} />,
    name: 'Youtube',
    value: 91,
  },
];

export default () => {
  return (
    <Flexbox>
      <h4>Website Analytics</h4>
      <BarList data={data} leftLabel={'Source'} rightLabel={'Views'} />
    </Flexbox>
  );
};
