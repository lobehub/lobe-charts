import { Center, Empty } from '@lobehub/ui';
import { Inbox } from 'lucide-react';
import { ReactNode, isValidElement, memo } from 'react';

export interface NoDataProps {
  className?: string;
  noDataText?:
    | ReactNode
    | {
        desc: ReactNode;
        title: ReactNode;
      };
}

const NoData = memo<NoDataProps>(
  ({
    noDataText = {
      desc: "There's no data available for your selection.",
      title: 'No Data',
    },
    className,
  }) => {
    const isReactNodeText = isValidElement(noDataText);
    return (
      <Center height={'100%'} width={'100%'}>
        <Empty
          className={className}
          description={isReactNodeText ? noDataText : (noDataText as any)?.desc}
          icon={Inbox}
          title={isReactNodeText ? undefined : (noDataText as any)?.title}
        />
      </Center>
    );
  },
);

export default NoData;
