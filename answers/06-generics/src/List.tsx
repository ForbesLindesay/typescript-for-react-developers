import React from 'react';

export interface ListProps<T> {
  items: readonly T[];
  renderItem(item: T): React.ReactNode;
}

export default function List<T>(props: ListProps<T>) {
  return <>{props.items.map(props.renderItem)}</>;
}
