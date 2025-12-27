import { Center, Flexbox } from '@lobehub/ui';
import { Empty } from 'antd';
import { cssVar } from 'antd-style';
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
          description={
            isReactNodeText ? (
              noDataText
            ) : (
              <Flexbox padding={8}>
                <div style={{ color: cssVar.colorText, fontSize: 14, fontWeight: 'bold' }}>
                  {(noDataText as any)?.title}
                </div>
                <div style={{ color: cssVar.colorTextDescription, fontSize: 12 }}>
                  {(noDataText as any)?.desc}
                </div>
              </Flexbox>
            )
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Center>
    );
  },
);

export default NoData;
