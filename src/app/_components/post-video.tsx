
type Props = {
  video: string;
};

export function PostVideo({ video }: Props) {
  return (
    <video
        controls = {true}
        width={"800"}
        >
        <source src={video} type="video/mp4" />
        Il tuo browser non supporta il tag video.
        </video>
  );
}