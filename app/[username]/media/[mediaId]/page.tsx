import MediaId from "../_components/media-id";

type Params = Promise<{ mediaId: string; username: string }>;

export default async function MediaIdPage({ params }: { params: Params }) {
  const { mediaId, username } = await params;

  return (
    <MediaId params={{ mediaId, username }} />
  );
}
