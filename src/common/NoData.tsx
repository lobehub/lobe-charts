import { Empty } from 'antd';
import { useTheme } from 'antd-style';
import { ReactNode, isValidElement, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

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
    const theme = useTheme();
    const isReactNodeText = isValidElement(noDataText);
    return (
      <Center height={'100%'} width={'100%'}>
        <Empty
          className={className}
          description={
            isReactNodeText ? (
              noDataText
            ) : (
              <Flexbox gap={4} padding={8}>
                <div style={{ color: theme.colorText, fontSize: 14, fontWeight: 'bold' }}>
                  {(noDataText as any)?.title}
                </div>
                <div style={{ color: theme.colorTextDescription, fontSize: 14 }}>
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
