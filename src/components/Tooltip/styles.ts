import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    background: ${rgba(token.colorBgElevated, 0.5)};
    border-radius: ${token.borderRadiusLG}px;
    border: 1px solid ${token.colorBorder};
    overflow: hidden;
    padding: 8px 12px;
    box-shadow: ${token.boxShadow};
    backdrop-filter: blur(8px);
  `,
  item: css``,
  itemData: css``,
  itemTitle: css``,
  label: css`
    font-weight: 600;
    font-size: 16px;
  `,
}));
