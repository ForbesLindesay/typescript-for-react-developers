export interface ListProps {
  items: readonly any[];
  renderItem(item: any): React.ReactNode;
}

export default function List(props: ListProps) {
  return <>{props.items.map(props.renderItem)}</>;
}
