interface Props {
  params: { id: string }
}

export default function page({ params: { id } }: Props) {
  return <div>{id}</div>
}
