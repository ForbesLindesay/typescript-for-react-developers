import React from 'react';

export interface ListProps<TItem> {
  items: readonly TItem[];
  renderItem(item: TItem): React.ReactNode;
}

export default function List<TItem>(props: ListProps<TItem>) {
  return <>{props.items.map(props.renderItem)}</>;
}
