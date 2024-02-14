import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    flex-wrap: wrap;
  `,
  item: css`
    border-radius: ${token.borderRadius}px;
    transition: background-color 0.2s ${token.motionEaseInOut};
    padding: 8px;
    &:hover {
      background-color: ${token.colorFillTertiary};
    }
  `,
  itemName: css`
    line-height: 1;
    color: ${token.colorTextSecondary};
  `,
}));
